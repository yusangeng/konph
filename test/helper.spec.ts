/* global describe it */
import chai from "chai";
import helper from "../src/helper";

chai.should();

describe("helper.fit - boolean type conversion", () => {
  const fit = helper.fit;

  describe("#boolean - input validation", () => {
    it("should not throw error when input is undefined or null", done => {
      fit.boolean(void 0);
      fit.boolean(null);
      done();
    });

    it("should return true when input is truthy value", done => {
      fit.boolean(1).should.to.be.equal(true);
      fit.boolean("true").should.to.be.equal(true);
      fit.boolean({}).should.to.be.equal(true);
      done();
    });

    it("should return false when input is falsy value", done => {
      fit.boolean(0).should.to.be.equal(false);
      fit.boolean("false").should.to.be.equal(false);
      fit.boolean("0").should.to.be.equal(false);
      fit.boolean(void 0).should.to.be.equal(false);
      fit.boolean(null).should.to.be.equal(false);
      done();
    });
  });

  describe("helper.fit - number type conversion", () => {
    describe("#number - input validation", () => {
      it("should not throw error when input is undefined or null", done => {
        fit.number(void 0);
        fit.number(null);
        done();
      });

      describe("#number - boolean conversion", () => {
        it("should return 1 for true and 0 for false", done => {
          fit.number(true).should.be.eq(1);
          fit.number(false).should.be.eq(0);
          fit.number("true").should.be.eq(1);
          fit.number("false").should.be.eq(0);

          done();
        });

        it("should return exact number value when input is number or numeric string", done => {
          const n = -1.123;

          fit.number(n).should.to.be.equal(n);
          fit.number("-1.123").should.to.be.equal(n);
          done();
        });

        it("should return NaN when input is invalid number", done => {
          isNaN(fit.number(void 0)).should.to.be.equal(true);
          isNaN(fit.number(null)).should.to.be.equal(true);
          isNaN(fit.number({})).should.to.be.equal(true);
          isNaN(fit.number("abc")).should.to.be.equal(true);
          done();
        });
      });

      describe("helper.fit - string array conversion", () => {
        describe("#strings - input validation", () => {
          it("should not throw error when input is undefined or null", done => {
            fit.array(void 0);
            fit.array(null);
            done();
          });

          describe("#strings - empty array handling", () => {
            it("should return empty array when input is empty or invalid", done => {
              fit.strings(void 0).should.to.deep.equal([]);
              fit.strings([]).should.to.deep.equal([]);
              fit.strings("").should.to.deep.equal([]);
              fit.strings("[]").should.to.deep.equal([]);
              fit.strings("[,]").should.to.deep.equal([]);
              fit.strings(",").should.to.deep.equal([]);
              done();
            });

            describe("#strings - valid array conversion", () => {
              it("should return array of strings when input is valid array or string", done => {
                const arr = ["1", "2", "3"];
                fit.strings(arr).should.to.deep.equal(arr);
                fit.strings("1,2,3").should.to.deep.equal(arr);
                fit.strings("1, 2, 3").should.to.deep.equal(arr);
                fit.strings("[1, 2, 3]").should.to.deep.equal(arr);
                fit.strings("[1, 2, 3, ]").should.to.deep.equal(arr);
                done();
              });

              it("should return single element array when input has one value", done => {
                const arr = ["1"];
                fit.strings(arr).should.to.deep.equal(arr);
                fit.strings("1").should.to.deep.equal(arr);
                done();
              });
            });
          });
        });
      });
    });
  });
});
