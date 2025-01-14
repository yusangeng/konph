/**
 * 前端配置读取工具.
 *
 * @author yusangeng@outlook.com
 */

import Reader from "./Reader";
import helper from "./helper";
import {
  HasOnlyStringKey,
  KonphInitData,
  KonphPrivateItem,
  KonphOptions,
  KonphResult,
  FKonph
} from "./types";

const DEFAULT_GLOBAL_NAME = "__Konph";

function getSearch(): string {
  try {
    return (globalThis as any).location.search;
  } catch (err) {
    // TODO: 兼容node命令行参数
    return "";
  }
}

/**
 * 读取配置数据.
 *
 * @param {KonphOptions<T>} options 读取设置, 键为感兴趣的配置字段名(不区分大小写, 两边的空格会被trim掉),
 *   值为相应的读取配置, 支持fit, deps, defaultValue, 具体见README.
 * @param {string|KonphInitData<T>} name 全局配置变量名, 默认为`__Konph`,
 *   如果传入一个对象, 则不读取全局变量和url参数,
 *   而是直接读传入对象的url和global字段, 用来在非浏览器环境中测试.
 * @returns {KonphResult<T>} 配置读取结果, 格式为键值对.
 * @function
 */
function getKonph<T extends HasOnlyStringKey<T>>(
  options: KonphOptions<T>,
  name?: string | KonphInitData<T>
): KonphResult<T> {
  let globalConf;
  let url;
  const g: any = globalThis;

  if (!name || (typeof name === "string" && !g[name])) {
    name = DEFAULT_GLOBAL_NAME;
  }

  if (typeof name === "string") {
    globalConf = g[name] ?? {};
    url = getSearch();
  } else {
    globalConf = name.global ?? {};
    url = name.url ?? "";
  }

  // 环境变量会被全局变量覆盖
  if (typeof process !== "undefined") {
    const { env = {} } = process;
    globalConf = { ...env, ...globalConf };
  }

  const reader = new Reader(globalConf, url, options);

  const ret = Object.keys(options)
    .map(key => key.trim().toLowerCase())
    .map(key => {
      return { key, value: reader.item(key as keyof T) };
    })
    .reduce((prev, el) => {
      // fixme
      (prev as any)[el.key] = el.value;
      return prev;
    }, {} as KonphResult<T>);

  return ret;
}

const prv = <T>(value: T): KonphPrivateItem<T> => {
  return {
    __konph_private_item__: true,
    value
  };
};

const konph: FKonph = (() => {
  const k: any = getKonph;

  k.helper = helper;
  k.private = prv;

  return k;
})();

export default konph;
