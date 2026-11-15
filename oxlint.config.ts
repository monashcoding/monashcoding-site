import { macLintConfig } from "@monashcoding/lint";
import { defineConfig } from "oxlint";

export default defineConfig(
  macLintConfig({
    // scripts/ holds the committee sync, which is bundled and installed by hand on its
    // own server, so it is left as it is.
    ignorePatterns: ["scripts/**", "public/**"],
    // Rules the existing code does not pass yet. Switch each back to "error" once its
    // count reaches zero.
    rules: {
      "anti-slop/require-safety-comment-for-type-assertion": "warn",
      "anti-slop/no-shape-in-symbol-names": "warn",
      "anti-slop/no-known-value-widening": "warn",
      "anti-slop/no-runtime-typeof": "warn",
      "anti-slop/no-chained-type-assertions": "warn",
      "anti-slop/no-unsafe-dictionary-type": "warn",
      "anti-slop/no-array-filter-map": "warn",
    },
  }),
);
