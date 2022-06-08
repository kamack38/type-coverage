import * as core from '@actions/core'
import {
  AnyInfo,
  FileTypeCheckResult,
  lint,
  LintOptions
} from 'type-coverage-core'
import { wait } from './wait'

type FileCount = Map<
  string,
  Pick<FileTypeCheckResult, 'correctCount' | 'totalCount'>
>

export type CoverageData = {
  fileCounts: FileCount
  anys: AnyInfo[]
  percentage: number
  total: number
  covered: number
  uncovered: number
}

export type Options = Partial<
  Pick<LintOptions, 'strict' | 'debug' | 'ignoreFiles' | 'ignoreCatch'> & {
    cache: LintOptions['enableCache']
    ignoreUnread: LintOptions['ignoreUnreadAnys']
    tsProjectFile: string
  }
>
const getCoverage = async (options?: Options): Promise<CoverageData> => {
  const {
    tsProjectFile = '.',
    strict,
    debug,
    ignoreFiles,
    ignoreCatch,
    cache: enableCache,
    ignoreUnread: ignoreUnreadAnys
  } = options || {}

  const { anys, fileCounts, totalCount, correctCount } = await lint(
    tsProjectFile,
    {
      strict,
      debug,
      ignoreFiles,
      ignoreCatch,
      enableCache,
      ignoreUnreadAnys,
      fileCounts: true
    }
  )
  const percentage = totalCount === 0 ? 100 : (correctCount * 100) / totalCount

  return {
    fileCounts,
    anys,
    percentage,
    total: totalCount,
    covered: correctCount,
    uncovered: totalCount - correctCount
  }
}

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    const srcDir: string = core.getInput('source-root')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    console.log(
      'Coverage',
      JSON.stringify(await getCoverage({ tsProjectFile: srcDir }))
    )

    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
