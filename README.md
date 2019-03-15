# konph

[![TypeScript](https://img.shields.io/badge/lang-typescript-blue.svg)](https://www.tslang.cn/) [![Build Status](https://travis-ci.org/yusangeng/konph.svg?branch=master)](https://travis-ci.org/yusangeng/konph) [![Coverage Status](https://coveralls.io/repos/github/yusangeng/konph/badge.svg?branch=master)](https://coveralls.io/github/yusangeng/konph?branch=master) [![Npm Package Info](https://badge.fury.io/js/konph.svg)](https://www.npmjs.com/package/konph) [![Downloads](https://img.shields.io/npm/dw/konph.svg?style=flat)](https://www.npmjs.com/package/konph)

## Abstract

Konph is an easy-to-use front-end configuration reader, which is used to read global configuration in web page.

Konph unifies url parameters, js global variables, and hard-coded default values by priority from high to low. With the same key, the high priority configuration value overrides the low priority configuration value.

## Install

``` shell
npm install konph -save
```

## Usage

### Basic

``` js
import konph from 'konph'

const config = konph({
  // Configuration item, the key is case-insensitive.
  'some-conf-item': {},
  'some-other-conf-item': {}
})
```

### Default value

``` js
import konph from 'konph'

const config = konph({
  'some-conf-item': {
    // Default item value.
    def: 'foobar'
  }
})
```

### Postprocessor

``` js
import konph from 'konph'

const config = konph({
  'some-conf-item': {
    // Postprocessor function, default value is also passed into postprocessor.
    fit: value => 'Value: ' + value
  }
})
```

### Dependence of Postprocessor

``` js
import konph from 'konph'

const config = konph({
  love: {
    def: 'loves',
    /**
     * love依赖于tom和jerry.
     * 当fit使用箭头函数定义时, 因为箭头函数不支持绑定this, 所以采用另一种写法:
     * fit: (value, ctx) => `${ctx.tom} ${value} ${ctx.jerry}`
     */
    fit: function (value) {
      return `${this.tom} ${value} ${this.jerry}`
    }
  },

  'tom': {
    def: 'Tom'
  },

  'jerry': {
    def: 'Jerry'
  }
})
```

### Private Item

``` js
import konph from 'konph'

const config = konph({
  // Private item, which would not be overridden by url parameters or global variables.
  'some-private-item': konph.private('I\'m a private config item.')
})
```

### Writing Configuration

配置有两种写入途径: 

* 写到url参数中.
* 写到特定全局变量(默认为window.__Konph)的字段中.

其中, url参数的优先级高于全局变量.

#### Using URL Parameter

```
http://foobar.com?some-item=1&some-other-item=2
```

#### Using Global Variable

``` html
<script>
window.__Konph = {
  'some-item': 1,
  'some-other-item': 2
}
</script>
```

#### Using Custom Global Variable Name

html:
``` html
<script>
window.MyConfig = {
  'some-item': 1,
  'some-other-item': 2
}
</script>
```

js:
``` js
import konph from 'konph'

const config = konph({/*...*/}, 'MyConfig')
```

## Tips

### Type Conversion

由于url参数总是string类型, 如果想定义其他类型配置值, 需要在fit函数中转型.

konph中预定义了以下类型转换fit函数:

#### konph.helper.fit.boolean

'false'或'0'转换为false, 其他值转换为!!value

#### konph.helper.fit.number

对字符串会执行parseFloat, 数字会直接返回, 其他值返回NaN.

#### konph.helper.fit.array

* 如果输入为数组则直接返回.
* 如果输入为字符串, 则拆分为数组返回.目前支持两种拆分方式: 
  * 第一种: `[el1,el2,el3]`
  * 第二种: `el1,el2,el3`
  注意, 拆分过程中会将每个元素两边的空格trim掉.
* 如果输入为其他类型, 则返回[value]

#### Example 

假设我们想定义一个boolean类型, 可以如下编写代码: 

``` js
import konph from 'konph'

const config = konph({
  foobar: {
    fit: konph.helper.fit.boolean
  }
})
```

## Typescript

konph使用typescript开发, 通过载入与npm包一起发布的d.ts文件, 你可以获得一定程度上安全访问配置项的能力.

简而言之, konph函数的返回值有哪些字段可以被访问, 取决于入参KonphOptions<T>有哪些字段, 其中T是一个由实际options逆推得出的虚拟类型.

例如:

``` ts
import konph from 'konph'

const config = konph({
  foo: {
    def: 1
  },
  bar: {
    def: 2
  }
})

console.log(config.baz) // TSError!
```

同时, 为了简化配置, 我们没有使用类型系统校验字段的值, 只要是可以访问的字段, 其值的类型声明都是any.
