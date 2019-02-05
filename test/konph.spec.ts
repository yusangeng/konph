/* global describe it */

import chai from 'chai'
import konph from '../src/konph'
import { KVMap } from '../src/types'

chai.should()

function createConf (HOST: string, G: KVMap, URL: string) : KVMap {
  const config = konph({
    'is-private': konph.private(123),
    'is-daily': {
      def: true,
      fit: konph.helper.fit.bool
    },

    'is-dev': {
      def: true,
      fit: konph.helper.fit.bool
    },

    'rpc-timeout': {
      def: 5000,
      fit: (v: string) => {
        let timeout = parseInt(v)
        timeout = isNaN(timeout) ? 5000 : timeout
        return timeout
      }
    },

    'rpc-prefix': {
      def: '',

      fit: (v: string, ctx: KVMap) => {
        if (v !== null && typeof v !== 'undefined') {
          let u = '' + v

          if (u.indexOf('://') === -1 && u.indexOf('//') !== 0) {
            // 没有shcema
            u = `//${u}`
          }

          if (u.lastIndexOf('/') !== u.length - 1) {
            console.warn('rpc-prefix建议以斜杠("/")结尾.')
          }

          return u
        }

        let host: any = HOST // window.location.host

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
      def: '1.0.0',
      fit: (v: string, ctx: KVMap) => {
        const vv = '' + v
        if (ctx['is-dev'] && /\d$/.test(vv)) {
          return vv + '.dev'
        }

        return vv
      }
    },

    'rpc-use-tunnel': {
      def: false,
      fit: konph.helper.fit.bool
    }
  }, {
    // mock配置
    global: G,
    url: URL
  } as any)

  return config as KVMap
}

describe('konph', () => {
  describe('#konph', () => {
    it('basic usage.', done => {
      const cf = createConf('prod.konph.com', {
        'is-daily': true,
        'is-dev': false,
        'rpc-timeout': 3000,
        'rpc-prefix': 'prefix.konph.com/',
        'rpc-ver': '1.2.3',
        'rpc-use-tunnel': true
      }, '?is-dev=true&rpc-timeout=3001')

      /* eslint no-unused-expressions: 0 */
      cf['is-private'].should.to.be.eq(123)
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
