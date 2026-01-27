"use client";

import React, { useRef, useCallback } from "react";

interface ClickSparkProps {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: string;
  extraScale?: number;
  children?: React.ReactNode;
}

interface Spark {
  id: number;
  x: number;
  y: number;
  angle: number;
}

export default function ClickSpark({
  sparkColor = "#FFE330",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  children,
}: ClickSparkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sparkIdRef = useRef(0);

  const createSpark = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create sparks
      for (let i = 0; i < sparkCount; i++) {
        const spark = document.createElement("div");
        const angle = (360 / sparkCount) * i;
        const id = sparkIdRef.current++;

        spark.style.cssText = `
          position: absolute;
          left: ${x}px;
          top: ${y}px;
          width: ${sparkSize}px;
          height: ${sparkSize}px;
          background: ${sparkColor};
          border-radius: 50%;
          pointer-events: none;
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
          z-index: 9999;
        `;

        container.appendChild(spark);

        // Animate spark
        const radian = (angle * Math.PI) / 180;
        const distance = sparkRadius * extraScale;
        const endX = x + Math.cos(radian) * distance;
        const endY = y + Math.sin(radian) * distance;

        spark.animate(
          [
            {
              transform: "translate(-50%, -50%) scale(1)",
              opacity: 1,
              left: `${x}px`,
              top: `${y}px`,
            },
            {
              transform: "translate(-50%, -50%) scale(0)",
              opacity: 0,
              left: `${endX}px`,
              top: `${endY}px`,
            },
          ],
          {
            duration,
            easing,
            fill: "forwards",
          }
        ).onfinish = () => {
          spark.remove();
        };
      }
    },
    [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale]
  );

  return (
    <div
      ref={containerRef}
      onClick={createSpark}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100%",
      }}
    >
      {children}
    </div>
  );
}
