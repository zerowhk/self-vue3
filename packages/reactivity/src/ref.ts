import { isObject } from 'packages/shared/src'
import { reactive } from './reactive'
import { track, trigger } from './effect'

export const ref = (rawValue) => {
  return createRef(rawValue, false)
}

export const shallowRef = (rawValue) => {
  return createRef(rawValue, false)
}
//
const convertToReactive = (target) =>
  isObject(target) ? reactive(target) : target

class RefImpl {
    private _value
    private __v_isRef = true // 标识这是一个ref实例
    constructor(rawValue, private shallow) {
        this._value = this.shallow ? rawValue : convertToReactive(rawValue)
    }

    get value() {
        track(this, 'value')
        return this._value
    }

    set value(newValue) {
        if (this._value !== newValue) {
            this._value = this.shallow ? newValue : convertToReactive(newValue)
            trigger(this, 'value', newValue)
        }
    }
}

function createRef(rawValue, shallow = false) {
  return new RefImpl(rawValue, shallow)
}

export const toRef = (target, key) => {
  return new ObjectRefImpl(target, key)
}

class ObjectRefImpl {
  public __v_isRef = true // 标识这是一个ref实例
  constructor(public target, public key) {}

  get value() {
    return this.target[this.key]
  }

  set value(newValue) {
    this.target[this.key] = newValue
  }
}

export const toRefs = (target) => {
  const ret = new target.constructor()
  for (let key in target) {
    ret[key] = toRef(target, key)
  }
  return ret
}
