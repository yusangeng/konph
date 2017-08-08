/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import split from '../src/split'

chai.should()

describe('split', _ => {
  describe('#split', _ => {
    it('should NOT throw error.', done => {
      split('?a=1&b=2&c=qwerty')
      done()
    })

    it('should output right data.', done => {
      const obj = split('?a=1&b=2&c=qwerty')

      obj.should.to.deep.equal({
        a: '1',
        b: '2',
        c: 'qwerty'
      })

      done()
    })

    it('should be equal.', done => {
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
