/* global describe it */
import chai from 'chai'
import helper from '../src/helper'

chai.should()

describe('helper.fit', () => {
  const fit = helper.fit

  describe('#boolean', () => {
    it('should NOT throw error.', done => {
      fit.boolean(void 0)
      fit.boolean(null)
      done()
    })

    it('should be true.', done => {
      fit.boolean(1).should.to.be.equal(true)
      fit.boolean('true').should.to.be.equal(true)
      fit.boolean({}).should.to.be.equal(true)
      done()
    })

    it('should be false.', done => {
      fit.boolean(0).should.to.be.equal(false)
      fit.boolean('false').should.to.be.equal(false)
      fit.boolean('0').should.to.be.equal(false)
      fit.boolean(void 0).should.to.be.equal(false)
      fit.boolean(null).should.to.be.equal(false)
      done()
    })
  })

  describe('#number', () => {
    it('should NOT throw error.', done => {
      fit.number(void 0)
      fit.number(null)
      done()
    })

    it('should be -1.123.', done => {
      const n = -1.123

      fit.number(n).should.to.be.equal(n)
      fit.number('-1.123').should.to.be.equal(n)
      done()
    })

    it('should be NaN.', done => {
      isNaN(fit.number(void 0)).should.to.be.equal(true)
      isNaN(fit.number(null)).should.to.be.equal(true)
      isNaN(fit.number({})).should.to.be.equal(true)
      isNaN(fit.number('abc')).should.to.be.equal(true)
      done()
    })
  })

  describe('#strings', () => {
    it('should NOT throw error.', done => {
      fit.array(void 0)
      fit.array(null)
      done()
    })

    it('should be []', done => {
      fit.array(void 0).should.to.deep.equal([])
      fit.array([]).should.to.deep.equal([])
      fit.array('').should.to.deep.equal([])
      fit.array('[]').should.to.deep.equal([])
      fit.array('[,]').should.to.deep.equal([])
      fit.array(',').should.to.deep.equal([])
      done()
    })

    it(`should be  ['1', '2', '3']`, done => {
      const arr = ['1', '2', '3']
      fit.array(arr).should.to.deep.equal(arr)
      fit.array('1,2,3').should.to.deep.equal(arr)
      fit.array('1, 2, 3').should.to.deep.equal(arr)
      fit.array('[1, 2, 3]').should.to.deep.equal(arr)
      fit.array('[1, 2, 3, ]').should.to.deep.equal(arr)
      done()
    })

    it(`should be  ['1']`, done => {
      const arr = ['1']
      fit.array(arr).should.to.deep.equal(arr)
      fit.array('1').should.to.deep.equal(arr)
      done()
    })
  })
})
