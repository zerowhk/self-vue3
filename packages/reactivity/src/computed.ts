import { isFunction } from "packages/shared/src"
import { effect, track, trigger } from "./effect"

// computed 特性 effect => lazy(不会立即执行)  有缓存，多次访问不会重新调用
export function computed(getterOrOptions) {
    let getter, setter
    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions
        setter = () => {
            console.warn('computed is not allowed set value')
        }
    } else {
        getter = getterOrOptions.get
        setter = getterOrOptions.set
    }
    return new computedRefImpl(getter, setter)
}

class computedRefImpl {
    private _value
    private _effect // effect函数
    private _dirty = true // 是否需要重新计算
    constructor(getter, private setter) {
        this._effect = effect(getter, {
            lazy: true,
            scheduler: () => {
                if (!this._dirty) {
                    this._dirty = true
                    trigger(this, 'value')
                }
            }
        })
    }

    get value () {
        if (this._dirty) {
            track(this, 'value')
            this._value = this._effect()
            this._dirty = false
        }
        return this._value
    }

    set value (newValue) {
        this.setter(newValue)
    }
}