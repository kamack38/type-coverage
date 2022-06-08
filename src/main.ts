import * as core from '@actions/core'
import getCoverage from './coverage'

async function run(): Promise<void> {
  try {
    const srcDir: string = core.getInput('source-root')
    console.log(
      'Coverage',
      JSON.stringify(await getCoverage({ tsProjectFile: srcDir }))
    )

    core.setOutput('coverage', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
