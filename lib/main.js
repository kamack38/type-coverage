"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const core = __importStar(require("@actions/core"));
const coverage_1 = __importStar(require("./coverage"));
function run() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tsConfigPath = (_a = core.getInput('tsConfigPath')) !== null && _a !== void 0 ? _a : '.';
            const threshold = parseInt(core.getInput('threshold'));
            const strict = core.getInput('strict') === 'true' ? true : false;
            const ignoreCatch = core.getInput('ignoreCatch') === 'true' ? true : false;
            const ignoreUnread = core.getInput('ignoreUnread') === 'true' ? true : false;
            const ignoreFiles = core
                .getInput('ignoreFiles')
                .split('\n')
                .filter(el => el !== null && el !== '');
            const debug = core.getInput('debug') === 'true' ? true : false;
            console.log('ignoreFiles', JSON.stringify(ignoreFiles));
            console.log('Coverage', JSON.stringify(yield (0, coverage_1.getCoverage)({ tsProjectFile: tsConfigPath, strict, debug })));
            const options = {
                tsProjectFile: tsConfigPath,
                threshold,
                strict,
                debug,
                ignoreFiles,
                ignoreCatch,
                ignoreUnread,
                cache: false
            };
            const markdown = yield (0, coverage_1.default)(options);
            core.setOutput('markdown', markdown);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
run();
