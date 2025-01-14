/**
 * 配置管理工具的类型定义模块.
 * 
 * 包含配置管理工具所需的所有类型定义，
 * 包括配置项、全局变量、缓存、初始化数据等。
 *
 * @packageDocumentation
 * @author yusangeng@outlook.com
 */

/**
 * 空函数类型，用于占位
 * @private
 */
type FNoop = (...args: any[]) => void;

/**
 * 确保类型T的所有键都是字符串类型
 */
export type HasOnlyStringKey<T> = {
  [K in keyof T]: K extends string ? T[K] : never;
};

/**
 * 全局配置变量的类型定义
 */
export type KonphGlobal<T> = {
  [K in keyof T]?: T[K];
};

/**
 * 配置值缓存的类型定义
 */
export type KonphCache<T> = {
  [K in keyof T]?: T[K] | FNoop;
};

/**
 * 初始化数据的类型定义
 * 
 * @property url - URL参数字符串
 * @property global - 全局配置对象
 */
export type KonphInitData<T> = {
  url: string;
  global: KonphGlobal<T>;
};

/**
 * 配置项的类型定义
 * 
 * @property def - 默认值（新写法）
 * @property defaultValue - 默认值（旧写法）
 * @property fit - 值转换函数
 * @property deps - 依赖的其他配置项
 */
export type KonphItem<V> = {
  def?: V;
  defaultValue?: V;
  fit?: (src: any, ...otherArgs: Array<any>) => V;
  deps?: Array<string>;
};

/**
 * 私有配置项的类型定义
 * 
 * @property __konph_private_item__ - 标识为私有配置项
 * @property value - 配置项的值
 */
export type KonphPrivateItem<V> = {
  __konph_private_item__: boolean; // 不要改成symbol!
  value: V;
};

/**
 * 简单值配置项的类型定义
 */
export type KonphValueItem<V> = V;

/**
 * 配置选项的类型定义
 */
export type KonphOptions<T extends HasOnlyStringKey<T>> = {
  [K in keyof T]:
  | KonphItem<T[K]>
  | KonphPrivateItem<T[K]>
  | KonphValueItem<T[K]>;
};

/**
 * 配置读取结果的类型定义
 */
export type KonphResult<T> = {
  [K in keyof T]: T[K];
};

/**
 * 创建私有配置项的函数类型
 */
export type FPrivate = <V>(value: V) => KonphPrivateItem<V>;

/**
 * 配置管理器的工厂函数类型
 * 
 * @property helper - 辅助工具
 * @property private - 创建私有配置项的方法
 */
export type FKonph = {
  <T extends HasOnlyStringKey<T>>(
    options: KonphOptions<T>,
    name?: string | KonphInitData<T>
  ): KonphResult<T>;
  helper: {
    fit: {
      number: (value: any) => number;
      string: (value: any) => string;
      bool: (value: any) => boolean;
      strings: (value: any) => string[];
    };
  };
  private: FPrivate;
};
