/**
 * 帮助函数
 * @author yusangeng
 */

import isString from 'lodash/isString'
import isNumber from 'lodash/isNumber'
import isBoolean from 'lodash/isBoolean'
import isArray from 'lodash/isArray'
import isUndefined from 'lodash/isUndefined'

/**
 * 用来转换数据类型的helper
 *
 * 用来简化配置中fit函数的书写, 比如:
 * ``` js
 * {
 *   foobar: {
 *     def: true,
 *     fit: Konph.helper.fit.boolean // 将任何值转换为布尔值
 *   }
 * }
 * ```
 *
 * @interface fit
 */
const fit = {
  /**
   * 转换为布尔值
   *
   * 字符串`false`和`0`会转换为false, 其他值转换为!!value.
   *
   * @param {any} value 输入值
   * @returns {boolean} 转换结果
   *
   * @memberof fit
   * @static
   */
  boolean (value) {
    if (value === 'false' || value === '0') {
      return false
    }

    return !!value
  },

  /**
   * 转换为数字类型
   *
   * 如果是数字则直接返回, 如果是布尔值或可parseFloat的字符串会转换为number, 其余转换为NaN.
   *
   * @param {any} value 输入值
   * @returns {number} 转换结果
   *
   * @memberof fit
   * @static
   */
  number (value) {
    if (isString(value)) {
      try {
        return parseFloat(value)
      } catch (e) {
        console.warn(`${value} is NOT a number.`)
        return NaN
      }
    }

    if (isNumber(value)) {
      return value
    }
    
    if (isBoolean(value)) {
      return value + 0
    }

    return NaN
  },

  /**
   * 转换为数组
   *
   * 如果是数组直接返回, 如果是字符串, 执行以下操作:
   *   * 首先trim.
   *   * 去掉开头的`[`和结尾的`]`.
   *   * 用`,`分割.
   *   * 对分割的每一项trim.
   *   * 删除为空字符串的项.
   *   * 将得到的数组返回.
   *
   * 如果是undefined, 返回空数组, 如果是其他值, 则包装成一个数组返回.
   *
   * @param {any} value 输入值
   * @returns {Array} 转换结果
   *
   * @memberof fit
   * @static
   */
  array (value) {
    if (isArray(value)) {
      return value
    }

    if (isUndefined(value)) {
      return []
    }

    if (isString(value)) {
      let v = value.trim().replace(/^\[/, '').replace(/\]$/, '').trim()
      const ret = v.split(',').map(el => el.trim()).filter(el => el !== '')
      return ret
    }

    return [value]
  }
}

// 兼容老版本
fit.bool = fit.boolean

export default {fit}
