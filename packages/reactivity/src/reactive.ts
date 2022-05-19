import { isObject } from 'packages/shared/src'
import {
    reactiveHandler,
    shallowReactiveHandler,
    readonlyHandler,
    shallowReadonlyHandler
} from './baseHandler'

export const reactive = (target) => {
    return createReactiveObject(target, false, reactiveHandler)
}

export const shallowReactive = (target) => {
    return createReactiveObject(target, false, shallowReactiveHandler)
}

export const readonly = (target) => {
    return createReactiveObject(target, true, readonlyHandler)
}

export const shallowReadonly = (target) => {
    return createReactiveObject(target, true, shallowReadonlyHandler)
}

// 存储已经代理过的对象
const reactiveMap = new WeakMap()
const readonlyMap = new WeakMap()

// 创建响应式对象
function createReactiveObject (target, isReadonly, handler) {
    if (!isObject(target)) {
        return target
    }
    const map = isReadonly ? readonlyMap : reactiveMap
    if (map.has(target)) {
        return map.get(target)
    }
    return new Proxy(target, handler)
}