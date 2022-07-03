# 📊 Typescript coverage report

## Example usage

Printing markdown report in summary tab

```yaml
- name: 🎡 Print type coverage
  id: ts-cov
  uses: kamack38/type-coverage@main
  with:
    ignoreFiles: |
      dist/**
- name: 📝 Set action summary
  run: echo "${{ steps.ts-cov.outputs.markdown }}" >> $GITHUB_STEP_SUMMARY
```
