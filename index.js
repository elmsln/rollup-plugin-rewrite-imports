/* eslint-disable strict, no-useless-escape, no-cond-assign */
// @ts-check
'use strict'
const MagicString = require('magic-string')
const fs = require('fs')
const path = require('path')
function escape(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}
// Figures out where the correct relative path should
// based on the output directory and the appendPath
function rollupOutputDir(opts, appendPath) {
    let dir = ''
    if (opts.file) {
        dir = path.dirname(opts.file)
    }
    else if (opts.dir) {
        dir = path.dirname(opts.dir)
    }
    return path.relative(dir, appendPath)
}
module.exports = function rewriteImports(appendPath) {
    const patternImport = new RegExp(/import(?:["'\s]*([\w*${}\n\r\t, ]+)from\s*)?["'\s]["'\s](.*[@\w_-]+)["'\s].*;$/, 'mg')
    const patternDImport = new RegExp(/import\((?:["'\s]*([\w*{}\n\r\t, ]+)\s*)?["'\s](.*([@\w_-]+))["'\s].*\);$/, 'mg')
    return {
        name: 'rewriteImports',
        renderChunk(code, info, opts) {
            // get the location of the output directory
            const magicString = new MagicString(code)
            let hasReplacements = false
            let match
            let start
            let end
            let replacement
            function replaceImport() {
                // see if it exists above
                if (fs.existsSync(path.join(process.cwd(), rollupOutputDir(opts, appendPath), match[2]))) {
                    // if it does then replace the import with the supplied path
                    hasReplacements = true
                    start = match.index
                    end = start + match[0].length
                    replacement = String(match[0].replace(match[2], appendPath + match[2]))
                    magicString.overwrite(start, end, replacement)
                }
            }
            // work against normal imports
            while (match = patternImport.exec(code)) {
                replaceImport()
            }
            // work against dynamic imports
            while (match = patternDImport.exec(code)) {
                replaceImport()
            }
            if (!hasReplacements) return null
            const result = { code: magicString.toString() }
            return result
        }
    }
}