import { execa } from 'execa'

async function build (target) {
    // -c 使用配置文件,--environment配置环境变量，TARGET环境变量名
    await execa('rollup', ['-cw', '--environment', `TARGET:${target}`], {
        stdio: 'inherit' // 子进程打包信息共享给父进程
    })
}

build('reactivity')