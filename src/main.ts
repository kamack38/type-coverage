import * as core from '@actions/core'
import generateCoverageReport, { getCoverage, ProgramOptions } from './coverage'

async function run(): Promise<void> {
  try {
    const srcDir: string = core.getInput('sourceDirectory')
    const threshold: number = parseInt(core.getInput('threshold'))
    const strict: boolean = core.getInput('strict') === 'true' ? true : false
    const ignoreCatch: boolean =
      core.getInput('ignoreCatch') === 'true' ? true : false
    const ignoreUnread: boolean =
      core.getInput('ignoreUnread') === 'true' ? true : false
    const debug: boolean = core.getInput('debug') === 'true' ? true : false
    console.log(
      'Coverage',
      JSON.stringify(
        await getCoverage({ tsProjectFile: srcDir, strict, debug })
      )
    )
    const options: ProgramOptions = {
      tsProjectFile: srcDir,
      threshold,
      strict,
      debug,
      ignoreFiles: undefined,
      ignoreCatch,
      ignoreUnread,
      cache: false
    }
    console.log(await generateCoverageReport(options))
    core.setOutput('coverage', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
