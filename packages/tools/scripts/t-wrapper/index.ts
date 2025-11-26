#!/usr/bin/env node

import { ScriptConfig } from "../common/default-config";
import { wrapTranslations } from "./wrapper";
import { CLI_OPTIONS, CLI_HELP } from "./utils/constants";

// CLI 실행 부분
if (require.main === module) {
  const args = process.argv.slice(2);
  const config: Partial<ScriptConfig> = {};

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case CLI_OPTIONS.PATTERN:
      case CLI_OPTIONS.PATTERN_SHORT:
        config.sourcePattern = args[++i];
        break;
      case CLI_OPTIONS.HELP:
      case CLI_OPTIONS.HELP_SHORT:
        console.log(`
${CLI_HELP.USAGE}

${CLI_HELP.OPTIONS}

${CLI_HELP.EXAMPLES}
        `);
        process.exit(0);
        break;
    }
  }

  wrapTranslations(config)
    .then((result) => {
      const timeInSeconds = (result.totalTime / 1000).toFixed(2);
      console.log(
        `✅ Processed ${result.processedFiles.length} file(s) in ${timeInSeconds}s`
      );
    })
    .catch(console.error);
}
