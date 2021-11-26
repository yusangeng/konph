# konph

[![TypeScript](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.tslang.cn/) [![Build Status](https://travis-ci.org/yusangeng/konph.svg?branch=master)](https://travis-ci.org/yusangeng/konph) [![Coverage Status](https://coveralls.io/repos/github/yusangeng/konph/badge.svg?branch=master)](https://coveralls.io/repos/github/yusangeng/konph/badge.svg?branch=master) [![Npm Package Info](https://badge.fury.io/js/konph.svg)](https://www.npmjs.com/package/konph) [![Downloads](https://img.shields.io/npm/dw/konph.svg?style=flat)](https://www.npmjs.com/package/konph)

## 综述

konph 是一个前端配置管理工具, 用来解决前端项目的配置项读写问题.

## 设计思想

konph 的设计思想来自于两个简单的理念:

1. 一个软件的配置文件应该尽量集中, 但是各个模块读取配置文件时, 应该尽量只关心属于自己的部分.
2. 不同的配置输入方式, 应该被整合在一套机制下, 并有明确的优先级, 否则配置容易混乱.

为了满足这两个诉求, 我开发了 konph 这个小工具, 通过 typescipt 的类型推断, 实现了各个模块访问其他模块的配置时报错, 并给出了配置输入方式的优先级, 以及覆盖规则.

一般来说，一个网页的配置项可以来自:

- 编码阶段: 硬编码
- 构建阶段: 环境变量
- 分发阶段: 全局变量(常见于 html 的 script 标签中)
- 运行阶段:
  - url 参数
  - 命令行参数(node.js 应用, 暂不支持)

konph 综合了这些配置渠道, 给出了统一的配置接口. 根据常识, 我们认为越晚出现的配置输入, 优先级应该越高, 越应该覆盖前面的输入. 所以, 目前 konph 的输入优先级为:

```
url 参数 > 全局变量 > 环境变量 > 硬编码
```

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

注意, 如果尝试读取 config 初始化时入参没有包含的配置项, tsc 会在构建期报错, 如果强行构建, 则 konph 会在运行期抛出异常.

### 配置项默认值

def 字段表示默认值, 当环境变量、全局变量，以及 url 参数中都读不到当前配置项输入值时, 默认值生效.

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

配置输入数据有四种写入途径:

- 写到 url 参数中.
- 写到特定全局变量(默认为 window.\_\_Konph)的字段中.
- 写到环境变量中.
- 写到私有配置项中.

四种写法优先级从高到低, 高优先级输入会覆盖低优先级输入.

#### 通过 url 参数写配置

url 参数会被 konph 读取作为配置输入, url 中的字符串到实际使用的数据类型转换, 请详见下文"类型转换"一节.

url 参数写配置示例:

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

注意:

如果你使用全局变量写法, konph 预期的行为是在 html 中使用 script 标签写, 从而实现在"分发期"输入配置数据. 不推荐代码中直接写全局变量\_\_Konph 的值, 这会导致优先级混乱.

如果你希望在代码中添加配置输入, 请使用默认值或私有配置项.

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

#### 通过环境变量写配置

konph 会读取 `process.env` 的值作为输入. 这个值在网页中通常是由 webpack 的 DefinePlugin 决定的.

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
