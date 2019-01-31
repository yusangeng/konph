/**
 * 前端配置读取工具.
 * 
 * @author Y3G
 */

import Reader from './Reader'
import helper from './helper'
import { g, KVMap, KonphOptions, KonphGlobal, KonphPrivateItem, kv } from './common'

type KonphInitData = {
  url: string,
  global: KonphGlobal
}

type FKonph = (options: KonphOptions, name: string | KonphInitData) => KVMap

function getSearch () : string {
  try {
    return g.location.search
  } catch (err) {
    // TODO: 兼容node命令行参数
    return ''
  }
}

/**
 * 读取配置数据.
 *
 * @param {KonphOptions} options 读取设置, 键为感兴趣的配置字段名(不区分大小写, 两边的空格会被trim掉),
 *   值为相应的读取配置, 支持fit, deps, defaultValue, 具体见README.
 * @param {string|KonphInitData} name 全局配置变量名, 默认为`__Konph`,
 *   如果传入一个对象, 则不读取全局变量和url参数,
 *   而是直接读传入对象的url和global字段, 用来在非浏览器环境中测试.
 * @returns {KVMap} 配置读取结果, 格式为键值对.
 * @function
 */
function konph (options: KonphOptions = kv(),
  name: string | KonphInitData = '__Konph') : KVMap {
  let globalConf
  let url

  if (typeof name === 'string') {
    globalConf = g[name] || {}
    url = getSearch()
  } else {
    globalConf = name.global || {}
    url = name.url || ''
  }

  const reader = new Reader(globalConf, url, options)

  return Object.keys(options).map(key => key.trim().toLowerCase()).map(key => {
    return { key, value: reader.item(key) }
  }).reduce((prev, el) => {
    prev[el.key] = el.value
    return prev
  }, {} as KVMap)
}

function prv (value: any) : KonphPrivateItem {
  return {
    __konph_private_item__: true,
    value: value
  }
}

type FPrivate = (value: any) => KonphPrivateItem

type Konph = {
  (options: KonphOptions, name: string | KonphInitData): KVMap,
  helper: KVMap
  private: FPrivate
}

const k: Konph = (() => {
  const k: any = konph

  k.helper = helper
  k.private = prv

  return k
})()

export default k

