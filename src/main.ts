import * as core from '@actions/core'
import generateCoverageReport, { getCoverage, ProgramOptions } from './coverage'

async function run(): Promise<void> {
  try {
    const tsConfigPath: string = core.getInput('tsConfigPath') ?? '.'
    const threshold: number = parseInt(core.getInput('threshold'))
    const strict: boolean = core.getInput('strict') === 'true' ? true : false
    const ignoreCatch: boolean =
      core.getInput('ignoreCatch') === 'true' ? true : false
    const ignoreUnread: boolean =
      core.getInput('ignoreUnread') === 'true' ? true : false
    const ignoreFiles: string[] = core.getInput('ignoreFiles').split('\n')
    const debug: boolean = core.getInput('debug') === 'true' ? true : false
    console.log(
      'Coverage',
      JSON.stringify(
        await getCoverage({ tsProjectFile: tsConfigPath, strict, debug })
      )
    )
    console.log(
      tsConfigPath,
      threshold,
      strict,
      ignoreCatch,
      ignoreUnread,
      ignoreFiles,
      debug
    )
    const options: ProgramOptions = {
      tsProjectFile: tsConfigPath,
      threshold,
      strict,
      debug,
      ignoreFiles,
      ignoreCatch,
      ignoreUnread,
      cache: false
    }
    const markdown = await generateCoverageReport(options)
    console.log(markdown)
    core.setOutput('markdown', markdown)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
