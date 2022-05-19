import path from 'path'
import jsonPlugin from '@rollup/plugin-json'
import resolvePlugin from '@rollup/plugin-node-resolve'
import tsPlugin from 'rollup-plugin-typescript2'

const target = process.env.TARGET
const packageDir = path.resolve(__dirname, './packages', target)

const resolve = dir => path.resolve(packageDir, dir)

// 输入选项映射
const outputOptions = {
    'cjs': {
        file: resolve(`dist/${target}.cjs.js`),  // 文件输入路径
        format: 'cjs' // 文件格式
    },
    'esm': {
        file: resolve(`dist/${target}.esm.js`),
        format: 'es'
    },
    'global': {
        file: resolve(`dist/${target}.global.js`),
        format: 'iife' // 立即执行函数
    }
}


const pkg = require(resolve('package.json'))
const buildOptions = pkg.buildOptions

const createConfig = (format, output) => {
    output.name = buildOptions.name  // 全局打包时需要使用
    output.sourcemap = true

    return {
        input: resolve('src/index.ts'),
        output,
        plugins: [
            jsonPlugin(),
            resolvePlugin(),
            tsPlugin({
                tsconfig: path.resolve(__dirname, './tsconfig.json')
            })
        ]
    }
}
export default buildOptions.format.map(f => createConfig(f, outputOptions[f]))

