/**
 * URL参数解析模块.
 * 
 * 负责将URL查询字符串解析为键值对格式，
 * 用于从URL参数中读取配置。
 * 
 * @example
 * // 使用示例
 * const urlParams = split('?apiUrl=https://api.example.com&timeout=5000');
 * // 返回 { apiurl: 'https://api.example.com', timeout: '5000' }
 *
 * @packageDocumentation
 * @author yusangeng@outlook.com
 */

import { KonphGlobal } from "./types";

/**
 * 将url参数分割为键值对.
 *
 * @param {string} url search部分, 可以通过window.location.search取得.
 * @returns {KonphGlobal<T>} url参数表.
 * @private
 */
export default function split<T extends Record<string, string>>(
  searchStr: string
): KonphGlobal<T> {
  if (!searchStr || searchStr === "?") {
    return {} as KonphGlobal<T>;
  }

  try {
    const segments = searchStr.replace(/^\?/, "").split("&");

    return segments
      .map(el => {
        const pair = el.split("=", 2);
        let [key, value] = pair;

        if (pair.length < 2 || !key.length) {
          return void 0;
        }

        key = key.trim().toLowerCase(); // 不分大小写
        value = decodeURIComponent(value || "").trim(); // value忽略两端空格

        return { key, value };
      })
      .reduce((prev, el) => {
        if (el) {
          prev[el.key as keyof T] = el.value as any;
        }

        return prev;
      }, {} as KonphGlobal<T>);

  } catch (error) {
    console.warn("Error parsing URL parameters:", error);
    return {} as KonphGlobal<T>;
  }
}
