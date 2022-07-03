import { markdownTable } from 'markdown-table'
import {
  AnyInfo,
  FileTypeCheckResult,
  lint,
  LintOptions
} from 'type-coverage-core'

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

export type ProgramOptions = Options & {
  threshold: number
}

export const getCoverage = async (options?: Options): Promise<CoverageData> => {
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

const calculatePercentage = (correct: number, total: number): number => {
  if (total === 0) {
    return 100
  }

  return (correct * 100) / total
}

const calculatePercentageWithString = (
  correct: number,
  total: number
): string => {
  return `${calculatePercentage(correct, total).toFixed(2)}%`
}

const generateMarkdown = (
  { fileCounts, percentage, total, covered, uncovered }: CoverageData,
  threshold: number
): string => {
  console.log(threshold)
  const mdTable = [
    [
      ':white_check_mark:',
      `filenames (${fileCounts.size})`,
      `percent (${percentage.toFixed(2)}%)`,
      `total (${total})`,
      `covered (${covered})`,
      `uncovered (${uncovered})`
    ]
  ]

  for (const [filename, { totalCount, correctCount }] of fileCounts) {
    const status =
      Math.floor(calculatePercentage(correctCount, totalCount)) >= threshold
        ? ':heavy_check_mark:'
        : ':x:'

    mdTable.push([
      status,
      filename.toString(),
      calculatePercentageWithString(correctCount, totalCount),
      totalCount.toString(),
      correctCount.toString(),
      (totalCount - correctCount).toString()
    ])
  }
  const table = `### :bar_chart: Type coverage\n${markdownTable(mdTable)}
  \nThreshold: ${threshold}`
  return table
}

export default async function generateCoverageReport(
  options: ProgramOptions
): Promise<string> {
  const data = await getCoverage({
    tsProjectFile: options.tsProjectFile,
    strict: options.strict,
    debug: options.debug,
    ignoreFiles: options.ignoreFiles,
    ignoreCatch: options.ignoreCatch,
    ignoreUnread: options.ignoreUnread,
    cache: options.cache
  })

  return generateMarkdown(data, options.threshold)
}
