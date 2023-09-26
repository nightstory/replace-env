# Replace environment variables in files in a GitHub Action

## Inputs

- `input_file`
    - Path to file with the placeholders to replace. If directory, will replace all files in the directory.
- `output_file`
    - Path to output file. If `input_file` is directory, will be a directory too.
    - Optional, defaults to `input_file`
- `pattern`
    - Which placeholders to replace.
    - Options:
      - `single_dollar_brackets` -> `${VARIABLE}`
      - `double_dollar_brackets` -> `${{VARIABLE}}`
      - `double_underscore` -> `__VARIABLE__`
    - Optional, defaults to `single_dollar_brackets`
- `fail_on_missing_env`
    - If true, will fail if a key required in the input file is missing in the environment.
    - default: `false`

## Example usage

The `input_file`:

```json
{
  "foo": "${FOO_BAR_123}"
}
```

⚠️ no spaces around the key.

The workflow:

```yaml
name: whatever

env:
  FOO_BAR_123: 'literally whatever'
```

The result:

```json
{
  "foo": "literally whatever"
}
```

## License

Licensed under MIT license.<br/>
Please also see [licenses.txt](lib/licenses.txt)