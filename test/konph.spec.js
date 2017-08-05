/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import konph from '../src/konph'

chai.should()

function createConf(HOST, G, URL) {
  const config = konph({
    'is-daily': {
      defaultValue: true,
      fit: konph.helper.fit.bool
    },

    'is-dev': {
      defaultValue: true,
      fit: konph.helper.fit.bool
    },

    'rpc-timeout': {
      defaultValue: 5000,
      fit: v => {
        let timeout = parseInt(v)
        timeout = isNaN(timeout) ? 5000 : timeout
        return timeout
      }
    },

    'rpc-prefix': {
      defaultValue: null,

      fit: (v, ctx) => {
        if (v !== null && typeof v !== 'undefined') {
          let u = '' + v

          if (u.indexOf('://') === -1 && u.indexOf('//') !== 0) {
            // 没有shcema
            u = `//${u}`
          }

          if (u.lastIndexOf('/') !== u.length - 1) {
            log.warn('rpc-prefix建议以斜杠("/")结尾.')
          }

          return u
        }

        let host = HOST // window.location.host

        if (ctx['is-daily'] ||
          host.startsWith('local.konph.com') ||
          host.startsWith('127.0.0.') ||
          host.startsWith('daily.konph.com')) {
          // 本地环境和日常环境默认使用日常数据
          return '//daily.konph.com/'
        }

        return `//${host}/`
      }
    },

    'rpc-ver': {
      dafaultValue: '1.0.0',
      fit: (v, ctx) => {
        const vv = '' + v
        if (ctx['is-dev'] && /\d$/.test(vv)) {
          return vv + '.dev'
        }
        
        return vv
      }
    },

    'rpc-use-tunnel': {
      defaultValue: false,
      fit: konph.helper.fit.bool
    }
  }, {
    // mock配置
    global: G,
    url: URL
  })
  
  return config
}

describe('konph', _ => { 
  describe('#konph', _ => {
    it('basic usage.', done => {
      const cf = createConf('prod.konph.com', {
        'is-daily': true,
        'is-dev': false,
        'rpc-timeout': 3000,
        'rpc-prefix': 'prefix.konph.com/',
        'rpc-ver': '1.2.3',
        'rpc-use-tunnel': true
      }, '?is-dev=true&rpc-timeout=3001')
      
      cf['is-daily'].should.to.be.true
      cf['is-dev'].should.to.be.true
      cf['rpc-timeout'].should.to.be.equal(3001)
      cf['rpc-prefix'].should.to.be.equal('//prefix.konph.com/')
      cf['rpc-ver'].should.to.be.equal('1.2.3.dev')
      cf['rpc-use-tunnel'].should.to.be.equal(true)
      done()
    })
  })
})