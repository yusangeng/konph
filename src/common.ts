/**
 * 公共代码.
 * 
 * @author Y3G
 */

export type KVMap = {
  [key: string]: any
}

export type KVMapOf<V> = {
  [key: string]: V
}

export type KonphGlobal = KVMap

export type KonphItem = {
  def?: any,
  defaultValue?: any,
  fit?: (src: any, ...otherArgs: Array<any>) => any,
  deps?: Array<string>
}

export type KonphPrivateItem = {
  __konph_private_item__: boolean,
  value: any
}

export type KonphOptions = KVMapOf<KonphItem | KonphPrivateItem>

export function kv () {
  return Object.create(null)
}

export let g: any

if (typeof window !== "undefined") {
  g = window
} else if (typeof global !== "undefined") {
  g = global
} else if (typeof self !== "undefined") {
  g = self
} else {
  g = {}
}
