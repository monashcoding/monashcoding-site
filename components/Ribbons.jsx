import { useEffect } from 'react';
import { Renderer, Transform, Vec3, Color, Polyline } from 'ogl';

const RIBBON_KEY = '__RIBBON_INSTANCE__';
// New value on each module evaluation - lets us detect HMR reloads
const MODULE_ID = Symbol('ribbon');

function initRibbon(config) {
  if (typeof window === 'undefined') return;

  // Disable ribbons on mobile devices
  if (window.innerWidth < 768) return;

  const existing = window[RIBBON_KEY];

  // Same module version and still healthy - skip (handles React Strict Mode double-invoke)
  if (existing?.healthy && existing?.moduleId === MODULE_ID) return;

  // Tear down old instance (HMR reload or failed previous init)
  if (existing?.cancel) existing.cancel();
  const staleContainer = document.getElementById('ribbon-container');
  if (staleContainer) staleContainer.remove();
  delete window[RIBBON_KEY];

  const {
    colors,
    baseSpring,
    baseFriction,
    baseThickness,
    offsetFactor,
    maxAge,
    pointCount,
    speedMultiplier,
    enableFade,
    enableShaderEffect,
    effectAmplitude,
    backgroundColor,
    onCanvasReady,
    onPointsUpdate,
  } = config;

  // Create a permanent container outside React - prepend to be first in body
  const container = document.createElement('div');
  container.id = 'ribbon-container';
  container.style.cssText = 'position:fixed;inset:0;z-index:2;pointer-events:none;';
  document.body.prepend(container);

  let renderer;
  try {
    // Cap DPR at 2 to avoid massive canvas on high-DPI mobile devices
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer = new Renderer({ dpr, alpha: true });
  } catch {
    // WebGL not available — remove container and bail
    container.remove();
    return;
  }

  const gl = renderer.gl;

  // Verify we actually got a working context
  if (!gl) {
    container.remove();
    return;
  }

  if (Array.isArray(backgroundColor) && backgroundColor.length === 4) {
    gl.clearColor(backgroundColor[0], backgroundColor[1], backgroundColor[2], backgroundColor[3]);
  } else {
    gl.clearColor(0, 0, 0, 0);
  }

  gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
  container.appendChild(gl.canvas);

  let cancelled = false;
  window[RIBBON_KEY] = {
    container,
    canvas: gl.canvas,
    healthy: true,
    moduleId: MODULE_ID,
    cancel: () => { cancelled = true; },
  };

  // Handle WebGL context loss/restore
  gl.canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    if (window[RIBBON_KEY]) window[RIBBON_KEY].healthy = false;
  });
  gl.canvas.addEventListener('webglcontextrestored', () => {
    if (window[RIBBON_KEY]) window[RIBBON_KEY].healthy = true;
  });

  if (onCanvasReady) {
    onCanvasReady(gl.canvas);
  }

  const scene = new Transform();
  const lines = [];

  const vertex = `
    precision highp float;

    attribute vec3 position;
    attribute vec3 next;
    attribute vec3 prev;
    attribute vec2 uv;
    attribute float side;

    uniform vec2 uResolution;
    uniform float uDPR;
    uniform float uThickness;
    uniform float uTime;
    uniform float uEnableShaderEffect;
    uniform float uEffectAmplitude;

    varying vec2 vUV;

    vec4 getPosition() {
        vec4 current = vec4(position, 1.0);
        vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
        vec2 nextScreen = next.xy * aspect;
        vec2 prevScreen = prev.xy * aspect;
        vec2 tangent = normalize(nextScreen - prevScreen);
        vec2 normal = vec2(-tangent.y, tangent.x);
        normal /= aspect;
        normal *= mix(1.0, 0.1, pow(abs(uv.y - 0.5) * 2.0, 2.0));
        float dist = length(nextScreen - prevScreen);
        normal *= smoothstep(0.0, 0.02, dist);
        float pixelWidthRatio = 1.0 / (uResolution.y / uDPR);
        float pixelWidth = current.w * pixelWidthRatio;
        normal *= pixelWidth * uThickness;
        current.xy -= normal * side;
        if(uEnableShaderEffect > 0.5) {
          current.xy += normal * sin(uTime + current.x * 10.0) * uEffectAmplitude;
        }
        return current;
    }

    void main() {
        vUV = uv;
        gl_Position = getPosition();
    }
  `;

  const fragment = `
    precision mediump float;
    uniform vec3 uColor;
    uniform float uOpacity;
    uniform float uEnableFade;
    varying vec2 vUV;
    void main() {
        float fadeFactor = 1.0;
        if(uEnableFade > 0.5) {
            fadeFactor = 1.0 - smoothstep(0.0, 1.0, vUV.y);
        }
        gl_FragColor = vec4(uColor, uOpacity * fadeFactor);
    }
  `;

  function resize() {
    // Use window dimensions since container is fixed fullscreen
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    lines.forEach(line => line.polyline.resize());
  }
  window.addEventListener('resize', resize);

  const center = (colors.length - 1) / 2;
  colors.forEach((color, index) => {
    const spring = baseSpring + (Math.random() - 0.5) * 0.05;
    const friction = baseFriction + (Math.random() - 0.5) * 0.05;
    const thickness = baseThickness + (Math.random() - 0.5) * 3;
    const mouseOffset = new Vec3(
      (index - center) * offsetFactor + (Math.random() - 0.5) * 0.01,
      0,
      0
    );

    const line = {
      spring,
      friction,
      mouseVelocity: new Vec3(),
      mouseOffset
    };

    const count = pointCount;
    const points = [];
    for (let i = 0; i < count; i++) {
      points.push(new Vec3());
    }
    line.points = points;

    line.polyline = new Polyline(gl, {
      points,
      vertex,
      fragment,
      uniforms: {
        uColor: { value: new Color(color) },
        uThickness: { value: thickness },
        uOpacity: { value: 1.0 },
        uTime: { value: 0.0 },
        uEnableShaderEffect: { value: enableShaderEffect ? 1.0 : 0.0 },
        uEffectAmplitude: { value: effectAmplitude },
        uEnableFade: { value: enableFade ? 1.0 : 0.0 }
      }
    });
    line.polyline.mesh.setParent(scene);
    lines.push(line);
  });

  resize();

  const mouse = new Vec3();
  function updateMouse(e) {
    let x, y;
    if (e.changedTouches && e.changedTouches.length) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else if (e.clientX !== undefined) {
      x = e.clientX;
      y = e.clientY;
    } else {
      return;
    }
    // Use window dimensions since container is fixed fullscreen
    const width = window.innerWidth;
    const height = window.innerHeight;
    mouse.set((x / width) * 2 - 1, (y / height) * -2 + 1, 0);
  }
  window.addEventListener('pointermove', updateMouse);
  window.addEventListener('touchstart', updateMouse, { passive: true });
  window.addEventListener('touchmove', updateMouse, { passive: true });

  const tmp = new Vec3();
  let lastTime = performance.now();

  function update() {
    if (cancelled) return;
    requestAnimationFrame(update);

    // Skip rendering if context is lost
    if (window[RIBBON_KEY] && !window[RIBBON_KEY].healthy) return;

    const currentTime = performance.now();
    let dt = currentTime - lastTime;
    lastTime = currentTime;

    // Clamp dt to prevent trail collapse during frame spikes
    // (e.g. hero media transitions, tab switches, heavy repaints)
    dt = Math.min(dt, 32); // cap at ~30fps equivalent

    const width = window.innerWidth;
    const height = window.innerHeight;

    lines.forEach(line => {
      line.points[0].copy(mouse).add(line.mouseOffset);

      for (let i = 1; i < line.points.length; i++) {
        if (isFinite(maxAge) && maxAge > 0) {
          const segmentDelay = maxAge / (line.points.length - 1);
          const alpha = Math.min(1, (dt * speedMultiplier) / segmentDelay);
          line.points[i].lerp(line.points[i - 1], alpha);
        } else {
          line.points[i].lerp(line.points[i - 1], 0.9);
        }
      }
      if (line.polyline.mesh.program.uniforms.uTime) {
        line.polyline.mesh.program.uniforms.uTime.value = currentTime * 0.001;
      }
      line.polyline.updateGeometry();
    });

    renderer.render({ scene });

    // Share ribbon points for external masking
    if (onPointsUpdate && lines.length > 0) {
      const screenPoints = lines[0].points.map(p => ({
        x: (p.x + 1) * 0.5 * width,
        y: (1 - (p.y + 1) * 0.5) * height
      }));
      onPointsUpdate(screenPoints, baseThickness);
    }
  }
  update();
}

const Ribbons = ({
  colors = ['#FC8EAC'],
  baseSpring = 0.03,
  baseFriction = 0.9,
  baseThickness = 30,
  offsetFactor = 0.05,
  maxAge = 500,
  pointCount = 50,
  speedMultiplier = 0.6,
  enableFade = false,
  enableShaderEffect = false,
  effectAmplitude = 2,
  backgroundColor = [0, 0, 0, 0],
  onCanvasReady = null,
  onPointsUpdate = null
}) => {
  useEffect(() => {
    // Initialize once - this is completely decoupled from React's lifecycle
    initRibbon({
      colors,
      baseSpring,
      baseFriction,
      baseThickness,
      offsetFactor,
      maxAge,
      pointCount,
      speedMultiplier,
      enableFade,
      enableShaderEffect,
      effectAmplitude,
      backgroundColor,
      onCanvasReady,
      onPointsUpdate,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Return nothing - the canvas is rendered directly to document.body
  return null;
};

export default Ribbons;
