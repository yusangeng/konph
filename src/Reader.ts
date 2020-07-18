/**
 * 配置值读取器.
 *
 * @author yusangeng@outlook.com
 */

import isUndefined from "lodash/isUndefined";
import isFunction from "lodash/isFunction";
import noop from "lodash/noop";
import split from "./split";
import {
  HasOnlyStringKey,
  KonphOptions,
  KonphGlobal,
  KonphCache,
  KonphItem,
  KonphPrivateItem
} from "./types";

const { isArray } = Array;
const { keys, defineProperty } = Object;

/**
 * 配置值读取器.
 *
 * @class Reader
 * @private
 */
export default class Reader<T extends HasOnlyStringKey<T>> {
  private globalConf_: KonphGlobal<T>;
  private urlConf_: KonphGlobal<T>;
  private options_: KonphOptions<T>;
  private cache_: KonphCache<T>;
  private fitContext_: KonphGlobal<T>;

  /**
   * 构造函数.
   *
   * @param {KonphGlobal} globalConf 全局配置变量.
   * @param {string} url url字符串.
   * @param {KonphOptions} options 配置项读取设置.
   *
   * @memberof Reader
   */
  constructor(
    globalConf: KonphGlobal<T>,
    url: string,
    options: KonphOptions<T>
  ) {
    this.globalConf_ = globalConf;
    this.urlConf_ = split<T>(url);
    this.options_ = options;

    const cache: KonphCache<T> = (this.cache_ = {});
    const fitContext = (this.fitContext_ = {});

    keys(options).forEach(key => {
      const kk = key.toLowerCase().trim();

      (cache as any)[kk] = noop;
      defineProperty(fitContext, kk, {
        get: () => this.item(kk as keyof T)
      });
    });
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
  item<K extends keyof T>(key: K): T[K] {
    const kk = (typeof key === "string" ? key.toLowerCase().trim() : key) as K;
    const cacheValue = this.cache_[kk];

    if (cacheValue !== noop) {
      // 命中缓存
      return cacheValue as T[K];
    }

    // 当前项的配置
    const item = this.options_[kk];

    if (!item) {
      throw new Error(`Bad key: ${kk}.`);
    }

    if ((item as KonphPrivateItem<T[K]>).__konph_private_item__) {
      // 私有配置
      return (item as KonphPrivateItem<T[K]>).value;
    }

    const { def, defaultValue, fit, deps } = item as KonphItem<T[K]>;

    // url参数的优先级最高
    let value = this.urlConf_[kk];

    if (isUndefined(value)) {
      // 全局变量优先级次之
      value = this.globalConf_[kk];
    }

    if (isUndefined(value)) {
      // 默认值优先级最低
      value = isUndefined(def) ? defaultValue : def; // defaultValue是def的老写法
    }

    if (isFunction(fit)) {
      // 由于url参数总是字符串, 所以如果必要的话, 这里需要使用一个fit函数转型
      // 如果需要对配置值做一些特殊处理, 也可在fit执行

      // 兼容老版本
      // 老版本不能自动分析依赖, 需要使用deps字段声明依赖
      let depValues: Array<T[keyof T]> = [];

      if (isArray(deps) && deps.length) {
        // 要计算当前配置项的值，首先读取它依赖的配置项
        depValues = deps.map(dep => this.item(dep as keyof T));
      }

      if (depValues.length) {
        // 老写法
        // 如果填写了deps, 同时fit函数是箭头函数, 则依赖分析不可用
        value = fit.call(this.fitContext_, value, ...depValues);
      } else {
        // 新写法
        // 由于fit函数有通常是箭头函数, bind this无效，所以要使用第二个参数传递fitContext
        value = fit.call(this.fitContext_, value, this.fitContext_);
      }
    }

    this.cache_[kk] = value;

    return value!;
  }
}
