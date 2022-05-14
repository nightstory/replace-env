import * as core from '@actions/core'

export interface Options {
  readonly inputFile: string
  readonly outputFile: string | null
  readonly failOnMissingEnv: boolean
  readonly pattern: ReplacementPattern
}

export enum ReplacementPattern {
  SingleDollarBrackets, DoubleDollarBrackets, DoubleUnderscore
}

const patternMap: { [key: string]: ReplacementPattern } = {
  'single_dollar_brackets': ReplacementPattern.SingleDollarBrackets,
  'double_dollar_brackets': ReplacementPattern.DoubleDollarBrackets,
  'double_underscore': ReplacementPattern.DoubleUnderscore,
}

const defaultPattern = 'single_dollar_brackets'

const findOption: (inputKey: string, envKey: string | null) => (string | null) =
  (inputKey, envKey) => {
    const input = core.getInput(inputKey)

    if (input.length === 0) {
      if (envKey !== null) {
        return process.env[envKey] ?? null
      } else {
        return null
      }
    } else {
      return input
    }
  }

const requireOption: (inputKey: string, envKey: string | null) => string =
  (inputKey, envKey) => {
    const result = findOption(inputKey, envKey)
    if (!result) {
      core.setFailed(`input ${inputKey} (or env ${envKey}) is required but was missing`)
      process.exit(1)
    }
    return result!
  }

const getFlag: (inputKey: string, envKey: string | null, def: boolean) => boolean =
  (inputKey, envKey, def) => {
    const result = findOption(inputKey, envKey)
    return result ? result === 'true' : def
  }

const getOptions: () => Options = () => ({
  inputFile: requireOption('input_file', null),
  outputFile: findOption('output_file', null),
  failOnMissingEnv: getFlag('fail_on_missing_env', null, false),
  pattern: patternMap[findOption('pattern', null) ?? defaultPattern]!,
})

export const validateOptions: (options: Options) => boolean =
  (o) => {
    let result = true

    if ([o.inputFile].some(v => v.length === 0)) {
      core.setFailed(`input_file must not be empty`)
      result = false
    }

    if (o.outputFile !== null && o.outputFile.length === 0) {
      core.setFailed(`output_file must not be empty`)
      result = false
    }

    return result
  }

export default getOptions