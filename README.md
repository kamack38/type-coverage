# 📊 Typescript coverage report

## Example usage

Printing markdown report in summary tab

```yaml
- name: 📊 Generate typescript code coverage
  id: ts-cov
  uses: kamack38/type-coverage@main
  with:
    ignoreFiles: |
      dist/**
- name: 📝 Set action summary
  run: echo "${{ steps.ts-cov.outputs.markdown }}" >> $GITHUB_STEP_SUMMARY
```

To see the result go to the [actions](https://github.com/kamack38/type-coverage/actions) tab
