import { isObject } from "packages/shared/src"
import { track, trigger } from "./effect"
import { reactive, readonly } from "./reactive"

export const reactiveHandler = {
    get: createGetter(),
    set: createSetter()
}
export const shallowReactiveHandler = {
    get: createGetter(false, true),
    set: createSetter(true)
}
export const readonlyHandler = {
    get: createGetter(true, false),
    set (target, key) {
        console.warn(`set  ${key} failed`)
    }
}
export const shallowReadonlyHandler = {
    get: createGetter(true, true),
    set (target, key) {
        console.warn(`set ${key} failed`)
    }
}


function createGetter (isReadonly = false, shallow = false) {
    return function get (target, key, reciver) {
        const res = Reflect.get(target, key, reciver)
        if (shallow) {
            return res
        }
        if (isObject(res)) {
            return isReadonly ? readonly(res) : reactive(res)
        }
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}

function createSetter (shallow = false) {
    return function set (target, key, value, reciver) {
        const oldValue = Reflect.get(target, key, reciver)
        if (!shallow && isObject(value)) {
            value = reactive(value)
        }
        const res = Reflect.set(target, key, value, reciver)
        if (res && oldValue !== value) {
            const hadKey = Reflect.has(target, key)
            trigger(target, key, value, hadKey)
        }
        return res
    }
}