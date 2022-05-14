import * as core from '@actions/core'
import fs from 'fs';

import getOptions, {Options, ReplacementPattern, validateOptions} from './options'

const main = async () => {
  const options: Options = getOptions()

  if (!validateOptions(options)) {
    process.exit(1)
  }

  let pattern = /\${\w+}/gi;
  let matcher = /\${(?<var>\w+)}/i;

  switch (options.pattern) {
    case ReplacementPattern.SingleDollarBrackets:
      pattern = /\${\w+}/gi;
      matcher = /\${(?<var>\w+)}/i;
      break;
    case ReplacementPattern.DoubleDollarBrackets:
      pattern = /\${{\w+}}/gi;
      matcher = /\${{(?<var>\w+)}}/i;
      break;
    case ReplacementPattern.DoubleUnderscore:
      pattern = /__\w+__/gi;
      matcher = /__(?<var>\w+)__/i;
      break;
  }

  if (fs.existsSync(options.inputFile)) {
    const data = fs.readFileSync(options.inputFile, 'utf8');
    const res = data.replace(pattern, (c) => {
      const match = c.match(matcher);

      if (match === null) {
        core.warning(`[replace-env] error happened, invalid match for ${c}: ${match}`)
        return c;
      }

      let env = process.env[match[1]];

      if (typeof env === 'undefined') {
        if (options.failOnMissingEnv) {
          core.error(`[replace-env] Environment Variable ${match[1]} not found!`);
          throw new Error('[replace-env] Environment Variable ${match[1]} not found!');
        } else {
          core.warning(`[replace-env] Environment Variable ${match[1]} not found!`);
          env = c;
        }
      } else {
        core.info(`[replace-env] Replacing Environment Variable ${match[1]}.`);
      }

      return env;
    });

    let resultFile = options.inputFile;
    if (options.outputFile !== null) {
      resultFile = options.outputFile;
    }

    fs.writeFileSync(resultFile, res);
    core.info(`[replace-env] File ${resultFile} saved.`);
  } else {
    throw new Error('[replace-env] input_file is missing')
  }
}

try {
  main()
} catch (error) {
  core.setFailed(`${error}`)
}