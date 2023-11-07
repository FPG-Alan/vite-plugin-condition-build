import { createFilter, FilterPattern } from "@rollup/pluginutils";
import { getComparisonOperator, slash } from "./utils";

const path = require("path");

type ConditionBuildOptions = {
  include?: FilterPattern;
  exclude?: FilterPattern;
};

function conditionBuild(options: ConditionBuildOptions = {}) {
  let serve: string;
  let commentReg: RegExp;

  const filter = createFilter(options.include, options.exclude);

  return {
    name: "condition-complie",
    // ensure we get vanilla version
    enforce: "pre",

    configResolved(resolvedConfig: any) {
      if (resolvedConfig.env.VITE_SERVE_KIND) {
        serve = resolvedConfig.env.VITE_SERVE_KIND;
        commentReg = /\/\/\s*#if\s*\((.*?)\)[\s\S]*?\/\/\s*#endif/g;
      }
    },
    transform(code: string, id: string) {
      if (!serve) return;
      if (!filter(id)) return;
      if (id.includes(slash(path.resolve("./src")))) {
        const matches = code.match(commentReg);
        if (matches) {
          const serveKindValues = matches
            ?.filter((match) => match.includes("SERVE_KIND"))
            .map((match) => match.match(/"(.*)"/)?.[1]);

          const modifiedCode = matches.reduce((acc, match, index) => {
            const operator = getComparisonOperator(match);
            const serveKindValue = serveKindValues[index];

            if (serveKindValue) {
              // aaa.*
              // aaa
              // aaa.bbb
              const serveKindWildcard = serveKindValue
                .replace(".", "\\.")
                .replace("\\.*", "(\\..*)?");
              const conditionRegex = new RegExp(`^${serveKindWildcard}$`);
              const meet = conditionRegex.test(serve);

              if ((meet && operator === "==") || (!meet && operator !== "==")) {
                return acc;
              } else {
                const startCommentIndex = acc.indexOf(match);
                const endCommentIndex = acc.indexOf(
                  "// #endif",
                  startCommentIndex
                );
                return (
                  acc.slice(0, startCommentIndex) +
                  acc.slice(endCommentIndex + 9)
                );
              }
            }
            return acc;
          }, code);

          return {
            code: modifiedCode,
            map: null,
          };
        }

        return {
          code,
          map: null,
        };
      }
    },
  };
}

export default conditionBuild;
