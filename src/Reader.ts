/**
 * 配置值读取器.
 *
 * @author Y3G
 */

import isUndefined from 'lodash/isUndefined'
import isFunction from 'lodash/isFunction'
import split from './split'
import { KVMap, KonphOptions, KonphGlobal, KonphItem, KonphPrivateItem, kv } from './common'

const { isArray } = Array
const {  keys, defineProperty } = Object
function noop () {}

/**
 * 配置值读取器.
 *
 * @class Reader
 * @private
 */
export default class Reader {
  globalConf_: KonphGlobal
  urlConf_: KVMap
  options_: KonphOptions
  cache_: KVMap
  fitContext_: KVMap

  /**
   * 构造函数.
   *
   * @param {KonphGlobal} globalConf 全局配置变量.
   * @param {string} url url字符串.
   * @param {KonphOptions} options 配置项读取设置.
   *
   * @memberof Reader
   */
  constructor (globalConf: KonphGlobal, url: string, options: KonphOptions) {
    this.globalConf_ = globalConf
    this.urlConf_ = split(url)
    this.options_ = options

    const cache = this.cache_ = kv()
    const fitContext = this.fitContext_ = kv()

    keys(options).forEach(key => {
      const kk = key.trim().toLowerCase()

      cache[kk] = noop
      defineProperty(fitContext, kk, {
        get: () => this.item(kk)
      })
    })
  }

  /**
   * 读取配置项.
   *
   * @param {string} key 配置项名称(不区分大小写)，两边的空格会被trim掉.
   * @returns {any} 配置项的值.
   *
   * @memberof Reader
   * @instance
   */
  item (key: string) : any {
    const kk = key.trim().toLowerCase()
    const cacheValue = this.cache_[kk]

    if (cacheValue !== noop) {
      // 命中缓存
      return cacheValue
    }

    // 当前项的配置
    const item = this.options_[kk]

    if (!item) {
      throw new Error(`Bad key: ${kk}.`)
    }

    if ((item as KonphPrivateItem).__konph_private_item__) {
      // 私有配置
      return (item as KonphPrivateItem).value
    }

    const { def, defaultValue, fit, deps } = item as KonphItem

    // url参数的优先级最高
    let value = this.urlConf_[kk]

    if (isUndefined(value)) {
      // 全局变量优先级次之
      value = this.globalConf_[kk]
    }

    if (isUndefined(value)) {
      // 默认值优先级最低
      value = isUndefined(def) ? defaultValue : def // defaultValue是def的老写法
    }

    if (isFunction(fit)) {
      // 由于url参数总是字符串, 所以如果必要的话, 这里需要使用一个fit函数转型
      // 如果需要对配置值做一些特殊处理, 也可在fit执行

      // 兼容老版本
      // 老版本不能自动分析依赖, 需要使用deps字段声明依赖
      let depValues = []

      if (isArray(deps) && deps.length) {
        // 要计算当前配置项的值，首先读取它依赖的配置项
        depValues = deps.map(dep => this.item(dep))
      }

      if (depValues.length) {
        // 老写法
        // 如果填写了deps, 同时fit函数是箭头函数, 则依赖分析不可用
        value = fit.call(this.fitContext_, value, ...depValues)
      } else {
        // 新写法
        // 由于fit函数有通常是箭头函数, bind this无效，所以要使用第二个参数传递fitContext
        value = fit.call(this.fitContext_, value, this.fitContext_)
      }
    }

    this.cache_[kk] = value

    return value
  }
}
