/* eslint-disable strict, no-useless-escape, no-cond-assign */
'use strict'
const MagicString = require('magic-string')
function escape(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}
module.exports = function rewriteImports(appendPath) {
    const patternImport = new RegExp(/import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;?$/, 'mg')
    const patternDImport = new RegExp(/import\((?:["'\s]*([\w*{}\n\r\t, ]+)\s*)?["'\s](.*([@\w_-]+))["'\s].*\);?$/, 'mg')
    return {
        name: 'rewriteImports',
        renderChunk(code) {
            const magicString = new MagicString(code)
            let hasReplacements = false
            let match
            let start
            let end
            let replacement
            // work against normal imports
            while (match = patternImport.exec(code)) {
                hasReplacements = true
                start = match.index
                end = start + match[0].length
                replacement = String(match[0].replace(match[2], appendPath + match[2]))
                magicString.overwrite(start, end, replacement)
            }
            // work against dynamic imports
            while (match = patternDImport.exec(code)) {
                hasReplacements = true
                start = match.index
                end = start + match[0].length
                replacement = String(match[0].replace(match[2], appendPath + match[2]))
                magicString.overwrite(start, end, replacement)
            }
            if (!hasReplacements) return null
            const result = { code: magicString.toString() }
            return result
        }
    }
}