import { execa } from 'execa'
import fs from 'fs'
import path from 'path'
// 单个打包
async function build (target) {
    // -c 使用配置文件
    await execa('rollup', ['-c', '--environment', `TARGET:${target}`], {
        stdio: 'inherit' // 子进程打包信息共享给父进程
    })
}
// 批量打包
function runBatch () {
    const packagesPath = path.resolve('packages')
    // 读取所有的包,
    const pkgPaths = fs.readdirSync(packagesPath)
        .filter(p => fs.statSync(path.resolve(packagesPath, p)).isDirectory())
    const p = pkgPaths.map(target => build(target))
    Promise.all(p).then(() => {
        console.log('打包完成')
    })
}

runBatch()