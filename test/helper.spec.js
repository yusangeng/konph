/* global describe it */

import 'babel-polyfill'
import chai from 'chai'
import helper from '../src/helper'

chai.should()

describe('helper.fit', _ => {
  const fit = helper.fit

  describe('#boolean', _ => {
    it('should NOT throw error.', done => {
      fit.boolean()
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
      fit.boolean().should.to.be.equal(false)
      fit.boolean(null).should.to.be.equal(false)
      done()
    })
  })
  
  describe('#number', _ => {
    it('should NOT throw error.', done => {
      fit.number()
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
      isNaN(fit.number()).should.to.be.equal(true)
      isNaN(fit.number(null)).should.to.be.equal(true)
      isNaN(fit.number({})).should.to.be.equal(true)
      isNaN(fit.number('abc')).should.to.be.equal(true)
      done()
    })
  })
  
  describe('#array', _ => {
    it('should NOT throw error.', done => {
      fit.array()
      fit.array(null)
      done()
    })
    
    it('should be []', done => {
      fit.array().should.to.deep.equal([])
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