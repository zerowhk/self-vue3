import { isNumber } from "packages/shared/src"

export function effect(fn, options:any = {}) {
    const effect = createReactiveEffect(fn, options)
    // 首次立即执行一次
    if (!options.lazy) {
        effect()
    }
    return effect
}

let uid = 0 // effect id一直递增
let activeEffect
const activeEffectStack = []
function createReactiveEffect(fn, options) {
    const effect = function () {
        console.log('effect 执行了')
        if (!activeEffectStack.includes(effect)) {
            try {
                activeEffect = effect
                activeEffectStack.push(effect)
                return fn()
            } finally {
                activeEffectStack.pop()
                activeEffect = activeEffectStack[activeEffectStack.length - 1]
            }
        }
    }
    effect.id = uid++ // 唯一标识
    effect._isEffect = true // 标识为effect函数
    effect.raw = fn // 原函数
    effect.options = options // effect配置项
    return effect
}

// 存储effect依赖
const targetMap = new WeakMap()
export function track(target, key) {
    if (!activeEffect) {
        return
    }
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, depsMap = new Map)
    }
    let depMap = depsMap.get(key)
    if (!depMap) {
        depsMap.set(key, depMap = new Set)
    }
    depMap.add(activeEffect) // 添加当前依赖
}

export function trigger(target, key, newValue?, hadKey?) {
    // 最终需要执行的依赖, Set用来去重
    const effects = new Set
    function addEffects (deps) {
        deps && deps.forEach(dep => effects.add(dep))
    }
    let depsMap = targetMap.get(target)
    // 数组
    if (Array.isArray(target)) {
        // 新增属性，会改变length，把length相关的属性加进去
        if (!hadKey) {
            addEffects(depsMap.get('length'))
        }
        // 缩短length长度
        if (key === 'length') {
            for (let key of depsMap.keys()) {
                if (isNumber(key) && key > newValue) {
                    addEffects(depsMap.get(key))
                }
            }
            addEffects(depsMap.get('length'))
        }
    } else {
        const depMap = depsMap && depsMap.get(key)
        addEffects(depMap)
    }
    // 目前无法支持直接给数组索引赋值
    effects.forEach((effect: any) => {
        const scheduler = effect.options.scheduler
        scheduler ? scheduler(effect) : effect()
    })
}