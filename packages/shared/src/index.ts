export const isObject = obj => typeof obj === 'object' && obj !== null
export const isFunction = fn => typeof fn === 'function'
export const isNumber = n => !Number.isNaN(Number(n))
export const tick = fn => Promise.resolve().then(fn)