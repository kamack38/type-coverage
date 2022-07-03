"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoverage = void 0;
const markdown_table_1 = require("markdown-table");
const type_coverage_core_1 = require("type-coverage-core");
const getCoverage = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { tsProjectFile = '.', strict, debug, ignoreFiles, ignoreCatch, cache: enableCache, ignoreUnread: ignoreUnreadAnys } = options || {};
    const { anys, fileCounts, totalCount, correctCount } = yield (0, type_coverage_core_1.lint)(tsProjectFile, {
        strict,
        debug,
        ignoreFiles,
        ignoreCatch,
        enableCache,
        ignoreUnreadAnys,
        fileCounts: true
    });
    const percentage = totalCount === 0 ? 100 : (correctCount * 100) / totalCount;
    return {
        fileCounts,
        anys,
        percentage,
        total: totalCount,
        covered: correctCount,
        uncovered: totalCount - correctCount
    };
});
exports.getCoverage = getCoverage;
const calculatePercentage = (correct, total) => {
    if (total === 0) {
        return 100;
    }
    return (correct * 100) / total;
};
const calculatePercentageWithString = (correct, total) => {
    return `${calculatePercentage(correct, total).toFixed(2)}%`;
};
const generateMarkdown = ({ fileCounts, percentage, total, covered, uncovered }, threshold) => {
    console.log(threshold);
    const mdTable = [
        [
            ':white_check_mark:',
            `filenames (${fileCounts.size})`,
            `percent (${percentage.toFixed(2)}%)`,
            `total (${total})`,
            `covered (${covered})`,
            `uncovered (${uncovered})`
        ]
    ];
    for (const [filename, { totalCount, correctCount }] of fileCounts) {
        const status = Math.floor(calculatePercentage(correctCount, totalCount)) >= threshold
            ? ':heavy_check_mark:'
            : ':x:';
        mdTable.push([
            status,
            filename.toString(),
            calculatePercentageWithString(correctCount, totalCount),
            totalCount.toString(),
            correctCount.toString(),
            (totalCount - correctCount).toString()
        ]);
    }
    const table = `### :bar_chart: Type coverage\n${(0, markdown_table_1.markdownTable)(mdTable)}
  \n🔶 Threshold: ${threshold}%`;
    return table;
};
function generateCoverageReport(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield (0, exports.getCoverage)({
            tsProjectFile: options.tsProjectFile,
            strict: options.strict,
            debug: options.debug,
            ignoreFiles: options.ignoreFiles,
            ignoreCatch: options.ignoreCatch,
            ignoreUnread: options.ignoreUnread,
            cache: options.cache
        });
        return generateMarkdown(data, options.threshold);
    });
}
exports.default = generateCoverageReport;
