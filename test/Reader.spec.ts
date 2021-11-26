/* global describe it */

import chai from "chai";
import Reader from "../src/Reader";
import helper from "../src/helper";

chai.should();

type KVMap = Record<string, any>;

describe("Reader", () => {
  describe("#constructor", () => {
    it("should NOT throw error.", done => {
      void new Reader({}, "", {});
      done();
    });
  });

  describe("#item", () => {
    it("basic usage.", done => {
      const rd = new Reader(
        {
          a: 1,
          b: true
        },
        "?a=3&b=0",
        {
          a: {
            def: 0,
            fit: helper.fit.number
          },

          b: {
            fit: helper.fit.boolean
          }
        }
      );

      rd.item("a").should.to.be.equal(3);
      rd.item("b").should.to.be.equal(false);

      done();
    });

    it("def.", done => {
      const rd = new Reader({}, "", {
        a: {
          def: 0,
          fit: helper.fit.number
        },

        b: {
          defaultValue: false,
          fit: helper.fit.boolean
        }
      });

      rd.item("a").should.to.be.equal(0);
      rd.item("b").should.to.be.equal(false);

      done();
    });

    it("primitive item.", done => {
      const rd = new Reader(
        {
          a: 1,
          b: true
        },
        "?a=2&b=0",
        {
          a: 3,
          b: {
            fit: helper.fit.boolean
          }
        }
      );

      rd.item("a").should.to.be.equal(3);

      done();
    });

    it("bad key.", done => {
      const rd = new Reader(
        {
          a: 1,
          b: true
        },
        "?a=3&b=0",
        {
          a: {
            def: 0,
            fit: helper.fit.number
          },

          b: {
            fit: helper.fit.boolean
          }
        }
      );

      (() => rd.item("c" as any)).should.throw();

      done();
    });

    it("deps old.", done => {
      const rd = new Reader(
        {
          a: 1,
          b: true,
          c: 4
        },
        "?a=3&b=0",
        {
          a: {
            def: 0,
            deps: ["c"],
            fit: (value: any, c: number) => {
              console.log(`@@@@ value=${value}, c=${c}`);
              let ret = helper.fit.number(value);
              ret = ret + c;
              return ret;
            }
          },

          b: {
            fit: helper.fit.boolean
          },

          c: {
            fit: helper.fit.number
          }
        }
      );

      rd.item("a").should.to.be.equal(7);
      rd.item("b").should.to.be.equal(false);

      done();
    });

    it("deps via this.", done => {
      const rd = new Reader(
        {
          a: 1,
          b: true,
          c: 4
        },
        "?a=3&b=0",
        {
          a: {
            def: 0,
            fit: function (value: any) {
              const t = this as any;
              console.log(`@@@@ value=${value}, c=${t.c}`);

              let ret = helper.fit.number(value);
              ret = ret + t.c;
              return ret;
            }
          },

          b: {
            fit: helper.fit.boolean
          },

          c: {
            fit: helper.fit.number
          }
        }
      );

      rd.item("a").should.to.be.equal(7);
      rd.item("b").should.to.be.equal(false);

      done();
    });

    it("deps via fitContext.", done => {
      const rd = new Reader(
        {
          a: 1,
          b: true,
          c: 4
        },
        "?a=3&b=0",
        {
          a: {
            def: 0,
            fit: (value: any, ctx: KVMap) => {
              console.log(`@@@@ value=${value}, c=${ctx.c}`);

              let ret = helper.fit.number(value);
              ret = ret + ctx.c;
              return ret;
            }
          },

          b: {
            fit: helper.fit.boolean
          },

          c: {
            fit: helper.fit.number
          }
        }
      );

      rd.item("a").should.to.be.equal(7);
      rd.item("b").should.to.be.equal(false);

      done();
    });
  });
});
