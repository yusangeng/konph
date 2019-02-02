/**
 * 公共代码.
 * 
 * @author Y3G
 */

export type KVMap<T = any> = {
  [key: string]: T
}

export type KonphGlobal<T> = {
  [K in keyof T]?: any
}

export type KonphInitData<T> = {
  url: string,
  global: KonphGlobal<T>
}

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

export type KonphOptions<T> = {
  [K in keyof T]: KonphItem | KonphPrivateItem
}

export type KonphResult<T> = {
  [K in keyof T]: any 
}

export type FPrivate = (value: any) => KonphPrivateItem

export type Konph = {
  <T>(options: KonphOptions<T>, name?: string | KonphInitData<T>): KonphResult<T>,
  helper: KVMap
  private: FPrivate
}
