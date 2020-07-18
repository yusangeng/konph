/**
 * url参数分割.
 *
 * @author yusangeng@outlook.com
 */

import { KonphGlobal, KVMap } from "./types";

/**
 * 将url参数分割为键值对.
 *
 * @param {string} url search部分, 可以通过window.location.search取得.
 * @returns {KVMap} url参数表.
 * @private
 */
export default function split<T extends KVMap>(
  searchStr: string
): KonphGlobal<T> {
  const segments = searchStr.replace(/^\?/, "").split("&");

  return segments
    .map(el => {
      let [key, value] = el.split("=", 2);

      key = key.trim().toLowerCase(); // 不分大小写

      if (!key.length) {
        return void 0;
      }

      value = decodeURIComponent(value || "").trim(); // value忽略两端空格

      return { key, value };
    })
    .reduce((prev, el) => {
      if (el) {
        prev[el.key] = el.value;
      }

      return prev;
    }, {} as KonphGlobal<T>);
}
