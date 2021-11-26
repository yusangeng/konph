# konph

[![TypeScript](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.tslang.cn/) [![Build Status](https://travis-ci.org/yusangeng/konph.svg?branch=master)](https://travis-ci.org/yusangeng/konph) [![Coverage Status](https://coveralls.io/repos/github/yusangeng/konph/badge.svg?branch=master)](https://coveralls.io/github/yusangeng/konph?branch=master) [![Npm Package Info](https://badge.fury.io/js/konph.svg)](https://www.npmjs.com/package/konph) [![Downloads](https://img.shields.io/npm/dw/konph.svg?style=flat)](https://www.npmjs.com/package/konph)

## 综述

konph 是一个前端配置读写工具, 目标是解决前端网页的配置项读读写问题.

一般来说，一个网页的配置项可以来自:

- 全局变量(常见于 html 的 script 标签中)
- url 参数
- 硬编码

konph 综合了这些配置渠道, 给出了统一的配置接口.

## 安装

```shell
npm install konph
```

## 使用

### 基本使用

```js
import konph from "konph";

const config = konph({
  // Configuration item, the key is case-insensitive.
  "some-conf-item": {},
  "some-other-conf-item": {}
});

// ...

console.log(config["some-conf-item"]);
```

### 配置项默认值

def 字段表示默认值, 当全局变量和 url 参数中都读不到当前配置项输入值时, 默认值生效.

```js
import konph from "konph";

const config = konph({
  "some-conf-item": {
    // Default item value.
    def: "foobar"
  }
});

console.log(config["some-conf-item"]);
```

### 配置项后处理函数

后处理函数 fit 表示运行时读取到配置项的值之后, 对输入值的加工函数.

```js
import konph from "konph";

const config = konph({
  "some-conf-item": {
    // Postprocessor function, default value is also passed into postprocessor.
    fit: value => "Value: " + value
  }
});
```

### 配置项之间的依赖关系

```js
import konph from "konph";

配置项之间可以互相依赖, fit 函数通过 this 指针或者 context 入参, 可以访问到其他配置项. konph会自动处理依赖关系, 先读取被依赖的配置项. 但是 konph 不会做循环引用检查.

const config = konph({
  love: {
    def: "loves",
    /**
     * love依赖于tom和jerry.
     * 当fit使用箭头函数定义时, 因为箭头函数不支持绑定this, 所以采用另一种写法:
     * fit: (value, ctx) => `${ctx.tom} ${value} ${ctx.jerry}`
     */
    fit: function (value) {
      return `${this.tom} ${value} ${this.jerry}`;
    }
  },

  tom: {
    def: "Tom"
  },

  jerry: {
    def: "Jerry"
  }
});
```

### 私有配置项

所谓私有配置项, 指的是硬编码在代码中的配置项, 运行时不会被任何输入值覆盖, 可以理解为常量.

```js
import konph from "konph";

const config = konph({
  // Private item, which would not be overridden by url parameters or global variables.
  "some-private-item": konph.private("I'm a private config item.")
});
```

### 写配置

配置有两种写入途径:

- 写到 url 参数中.
- 写到特定全局变量(默认为 window.\_\_Konph)的字段中.

其中, url 参数的优先级高于全局变量.

#### 通过 url 参数写配置

```
http://foobar.com?some-item=1&some-other-item=2
```

#### 使用全局变量写配置

```html
<script>
  window.__Konph = {
    "some-item": 1,
    "some-other-item": 2
  };
</script>
```

#### 自定义全局变量名

html:

```html
<script>
  window.MyConfig = {
    "some-item": 1,
    "some-other-item": 2
  };
</script>
```

js:

```js
import konph from "konph";

const config = konph(
  {
    /*...*/
  },
  "MyConfig"
);
```

## 类型转换

由于 url 参数总是 string 类型, 如果想定义其他类型配置值, 需要在 fit 函数中转型.

konph 中预定义了以下类型转换 fit 函数:

### konph.helper.fit.boolean

'false'或'0'转换为 false, 其他值转换为!!value

### konph.helper.fit.number

对字符串会执行 parseFloat, 数字会直接返回, 其他值返回 NaN.

### konph.helper.fit.strings

- 如果输入为数组则直接返回.
- 如果输入为字符串, 则拆分为数组返回.目前支持两种拆分方式:
  - 第一种: `[el1,el2,el3]`
  - 第二种: `el1,el2,el3`
- 如果输入为其他类型, 则返回一个单元素数组 `[value]`.

注意, 拆分过程中会将每个元素两边的空格 trim 掉.

### 示例

假设我们想定义一个 boolean 类型, 可以如下编写代码:

```js
import konph from "konph";

const config = konph({
  foobar: {
    fit: konph.helper.fit.boolean
  }
});
```

## 在 Typescript 中使用 konph

konph 使用 typescript 开发, 通过载入与 npm 包一起发布的 d.ts 文件, 你可以获得一定程度上安全访问配置项的能力.

简而言之, konph 函数的返回值有哪些字段可以被访问, 取决于入参 KonphOptions<T>有哪些字段, 其中 T 是一个由实际 options 逆推得出的虚拟类型.

例如:

```ts
import konph from "konph";

const config = konph({
  foo: {
    def: 1
  },
  bar: {
    def: 2
  }
});

console.log(config.baz); // TSError!
```

同时, 为了简化配置, 我们没有使用类型系统校验字段的值, 只要是可以访问的字段, 其值的类型声明都是 any.
