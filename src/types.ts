/**
 * 公共代码.
 *
 * @author yusangeng@outlook.com
 */

type FNoop = () => void;

export type KVMap<V = any> = {
  [key: string]: V;
};

export type HasOnlyStringKey<T> = {
  [K in keyof T]: T[K];
} & {
  [otherKey: number]: never;
};

export type KonphGlobal<T> = {
  [K in keyof T]?: T[K];
};

export type KonphCache<T> = {
  [K in keyof T]?: T[K] | FNoop;
};

export type KonphInitData<T> = {
  url: string;
  global: KonphGlobal<T>;
};

export type KonphItem<V> = {
  def?: V;
  defaultValue?: V;
  fit?: (src: any, ...otherArgs: Array<any>) => V;
  deps?: Array<string>;
};

export type KonphPrivateItem<V> = {
  __konph_private_item__: boolean;
  value: V;
};

export type KonphOptions<T extends HasOnlyStringKey<T>> = {
  [K in keyof T]: KonphItem<T[K]> | KonphPrivateItem<T[K]>;
};

export type KonphResult<T> = {
  [K in keyof T]: T[K];
};

export type FPrivate = <V>(value: V) => KonphPrivateItem<V>;

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
      array: (value: any) => any[];
    };
  };
  private: FPrivate;
};
