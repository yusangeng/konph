/**
 * 配置管理工具的辅助函数模块.
 * 
 * 提供常用的值转换函数，用于配置项的值处理。
 * 可以通过konph.helper.git访问这些工具函数。
 *
 * @packageDocumentation
 * @author yusangeng@outlook.com
 */

import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";
import isUndefined from "lodash/isUndefined";

const { isArray } = Array;

/**
 * 帮助函数, 可以通过Konph.helper访问.
 *
 * @namespace
 */
const helper = {
  /**
   * 常用fit函数.
   *
   * @example
   * fit提供的方法常用来简化配置中fit函数的书写, 比如:
   *
   * {
   *   foobar: {
   *     def: true,
   *     fit: konph.helper.fit.boolean // 将任何值转换为布尔值
   *   }
   * }
   *
   * @namespace
   */
  fit: {
    /**
     * 转换为布尔值.
     *
     * 字符串`false`和`0`会转换为false, 其他值转换为!!value.
     *
     * @param {any} value 输入值.
     * @returns {boolean} 转换结果.
     */
    boolean(value: any): boolean {
      if (value === "false" || value === "0") {
        return false;
      }

      return !!value;
    },

    // 兼容老版本
    bool(value: any): boolean {
      return helper.fit.boolean(value);
    },

    /**
     * 转换为数字类型.
     *
     * 如果是数字则直接返回, 如果是布尔值或可parseFloat的字符串会转换为number, 其余转换为NaN.
     *
     * @param {any} value 输入值.
     * @returns {number} 转换结果.
     */
    number(value: any): number {
      if (typeof value === "string") {
        if (value === "true") {
          return 1;
        } else if (value === "false") {
          return 0;
        }

        const n = parseFloat(value);

        if (isNaN(n)) {
          console.warn(`${value} is NOT a number.`);
          return NaN;
        }

        return n;
      }

      if (isNumber(value)) {
        return value;
      }

      if (isBoolean(value)) {
        return value ? 1 : 0;
      }

      return NaN;
    },

    /**
     * 转换为字符串列表.
     *
     * 如果是数组直接返回, 如果是字符串, 执行以下操作:
     *   1. 首先trim.
     *   2. 去掉开头的`[`和结尾的`]`.
     *   3. 用`,`分割.
     *   4. 对分割的每一项trim.
     *   5. 删除为空字符串的项.
     *   6. 将得到的数组返回.
     *
     * 如果是undefined, 返回空数组, 如果是其他值, 则包装成一个数组返回.
     *
     * @param {any} value 输入值.
     * @returns {Array} 转换结果.
     */
    strings(value: any): string[] {
      if (isArray(value)) {
        return value.map(el => "" + el);
      }

      if (isUndefined(value)) {
        return [];
      }

      if (typeof value === "string") {
        const v = value.trim().replace(/^\[/, "").replace(/\]$/, "").trim();
        const ret = v
          .split(",")
          .map(el => el.trim())
          .filter(el => el !== "");
        return ret;
      }

      return [value];
    },

    // 兼容老版本
    array(value: any): any[] {
      return helper.fit.strings(value);
    }
  }
};

export default helper;
