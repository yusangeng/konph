/**
 * 前端配置读取工具
 * @author yusangeng
 */

import isString from 'lodash/isString'
import Reader from './Reader'
import helper from './helper'
import g from './g'

function getSearch () {
  try {
    return g.location.search
  } catch (err) {
    return '' // TODO: 兼容node命令行参数
  }
}

/**
 * 读取配置数据
 *
 * @param {Object} options 读取设置, 键为感兴趣的配置字段名, 值为相应的读取配置, 支持fit, deps, defaultValue, 具体见README
 * @param {string|Object} name 全局配置变量名, 默认为`__Konph`, 如果传入一个对象, 则不读取全局变量和url参数,
 *   而是直接读传入对象的url和global字段, 用来在非浏览器环境中测试
 * @returns {Object} 配置读取结果, 格式为键值对
 * @export
 */
export default function konph (options, name = '__Konph') {
  const opt = options || {}
  const nameIsStr = isString(name)
  const globalConf = (nameIsStr ? g[name] : name.global) || {}
  const url = (nameIsStr ? getHref() : name.url) || ''
  
  const reader = new Reader(globalConf, url, opt)
  
  return Object.keys(opt).map(key => key.trim().toLowerCase()).map(key => {
    return {
      key: key,
      value: reader.item(key)
    }
  }).reduce((prev, el) => {
    prev[el.key] = el.value
    return prev
  }, {})
}

konph.helper = helper
