/* global describe it */

import chai from 'chai'
import split from '../src/split'

chai.should()

describe('split - URL query string parsing', () => {
  describe('#split - basic functionality', () => {
    it('should not throw error when parsing valid query string', done => {
      split('?a=1&b=2&c=qwerty')
      done()
    })

    it('should correctly parse query string into key-value pairs', done => {
      const obj = split('?a=1&b=2&c=qwerty')

      obj.should.to.deep.equal({
        a: '1',
        b: '2',
        c: 'qwerty'
      })

      done()
    })

    it('should handle different query string formats consistently', done => {
      const arr = [
        '?a=1&b=2&c=qwerty',
        'a=1&b=2&c=qwerty',
        'a = 1 & b=2 & c=qwerty  ',
        '?A=1&B=2&C=qwerty'
      ]

      arr.forEach(el => {
        arr.forEach(el2 => {
          split(el).should.to.deep.equal(split(el2))
        })
      })

      done()
    })
  })
})
