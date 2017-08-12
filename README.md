# konph | A Front-end configuration tool.

[![Build Status](https://travis-ci.org/yusangeng/konph.svg?branch=master)](https://travis-ci.org/yusangeng/konph) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

[![Npm Info](https://nodei.co/npm/konph.png?compact=true)](https://www.npmjs.com/package/konph)

## 综述

konph是一个简易轻量的Web前端配置读取工具, 用来在网页中读取前端全局配置项.

konph将url参数、js全局变量、以及默认值按照优先级从高到低统一起来, 同名配置项, 高优先级配置值会覆盖低优先级配置值.

## 安装

``` shell
npm install konph -save
```
### 网页引用

index.js:
``` html
<!DOCTYPE html>
<html>
  <head>
    <script src="path/to/konph.js"></script>
    <script>
    window.__Konph = {
      foo: 1,
      bar: 2
    }
    </script>
    <script src="./index.js"></script>
  </head>
</html>
```

index.js:
``` js
var conf = Konph({...})
```

## 使用

### 读取配置

``` js
import conf from 'konph'

const config = conf({
  // 要读取的配置字段名, 不分大小写
  'some-conf-item': {
    // 读取设置, 后面会详细介绍
  },
  'some-other-conf-item': {}
})
```

### 读取配置时设置默认值

``` js
import conf from 'konph'

const config = conf({
  'some-conf-item': {
    // 如果实际some-conf-item没有配置, 或者配置值是undefined, 则会用def代替
    def: 'foobar'
  }
})
```

### 读取配置时设置后处理函数

``` js
import conf from 'konph'

const config = conf({
  'some-conf-item': {
    // some-conf-item的配置值(**包括默认值**)会先经过fit函数处理, 再输出给返回值
    fit: value => 'Value: ' + value
  }
})
```

### 后处理函数中依赖其他配置项

``` js
import conf from 'konph'

const config = conf({
  love: {
    def: 'loves',
    /**
     * love依赖于tom和jerry.
     * 当fit使用箭头函数定义时, 因为箭头函数不支持绑定this, 所以采用另一种写法:
     * fit: (value, ctx) => `${ctx.tom} ${value} ${ctx.jerry}`
     */
    fit: function(value) {
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

### 私有配置

``` js
import conf from 'konph'

const config = conf({
  // 私有配置, 不会被全局变量或者url参数覆盖
  'some-private-item': konph.private('I\'m a private config item.')
})
```


### 写配置

配置有两种写入途径: 

* 写到url参数中.
* 写到特定全局变量(默认为window.__Konph)的字段中.

其中, url参数的优先级高于全局变量.

### url参数

```
http://foobar.com?some-item=1&some-other-item=2
```

### 全局变量

``` html
<script>
window.__Konph = {
  'some-item': 1,
  'some-other-item': 2
}
</script>
```

### 自定义全局变量名

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
import conf from 'konph'

const config = conf({/*...*/}, 'MyConfig')
```

## Tips

### 类型转换

由于url参数总是string类型, 如果想定义其他类型配置值, 需要在fit函数中转型.

konph中预定义了以下类型转换fit函数:

#### conf.helper.fit.boolean(value) 转换为布尔类型

'true'或'0'转换为false, 其他值转换为!!value

#### conf.helper.fit.number(value) 转换为数字类型

对字符串会执行parseFloat, 数字会直接返回, 其他值返回NaN.

#### conf.helper.fit.array(value) 转换为数组

* 如果输入为数组则直接返回.
* 如果输入为字符串, 则拆分为数组返回.目前支持两种拆分方式: 
  * 第一种: `[el1,el2,el3]`
  * 第二种: `el1,el2,el3`
  注意, 拆分过程中会将每个元素两边的空格trim掉.
* 如果输入为其他类型, 则返回[value]

#### 例子: 

假设我们想定义一个boolean类型, 可以如下编写代码: 

``` js
import conf from 'konph'

const config = conf({
  foobar: {
    fit: conf.helper.fit.boolean
  }
})
```
