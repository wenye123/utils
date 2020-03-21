import * as utils from "../src/index";
import { assert } from "chai";

function timeout(ms: number) {
  return new Promise((r, j) => {
    setTimeout(r, ms);
  });
}

describe("utils", function() {
  it("throttle", async function() {
    let count = 0;
    const fn = utils.throttle(() => {
      count++;
    }, 15);
    fn();
    assert.strictEqual(count, 1);
    fn();
    assert.strictEqual(count, 1);
    await timeout(20);
    fn();
    assert.strictEqual(count, 2);
  });

  it("debounce", async function() {
    let count = 0;
    const fn = utils.debounce(() => {
      count++;
    }, 15);
    fn();
    fn();
    assert.strictEqual(count, 0);
    await timeout(20);
    assert.strictEqual(count, 1);
  });

  it("lottery", function() {
    const awards = [
      { type: 1, rate: 0 },
      { type: 2, rate: 10 },
      { type: 3, rate: 10 },
    ];
    const obj = { 1: 0, 2: 0, 3: 0 };
    // 抽奖10000次 误差不超过500
    for (let i = 0; i < 10000; i++) {
      const ret = utils.lottery(awards);
      if (ret) obj[ret.type as 2]++;
    }
    assert.strictEqual(obj[1], 0);
    assert.isTrue(Math.abs(obj[2] - obj[3]) < 500);
  });

  describe("formatCsvField", function() {
    it("undefined", function() {
      const str = utils.formatCsvField(undefined);
      assert.strictEqual(str, "");
    });
    it("null", function() {
      const str = utils.formatCsvField(null);
      assert.strictEqual(str, "");
    });
    it("普通字符串", function() {
      const str = utils.formatCsvField("wenye");
      assert.strictEqual(str, "wenye");
    });
    it("普通数字", function() {
      const str = utils.formatCsvField(11);
      assert.strictEqual(str, "11");
    });
    it("布尔值", function() {
      const str = utils.formatCsvField(true);
      assert.strictEqual(str, "true");
    });
    it("对象", function() {
      const str = utils.formatCsvField({ name: "wenye" });
      assert.strictEqual(str, `"{""name"":""wenye""}"`);
    });
    it("数组", function() {
      const str = utils.formatCsvField([1, "wenye"]);
      assert.strictEqual(str, `"1,wenye"`);
    });
    it("带有分隔符", function() {
      const str = utils.formatCsvField("wen,ye");
      assert.strictEqual(str, `"wen,ye"`);
    });
    it("带有换行符", function() {
      const str = utils.formatCsvField("wen\n\rye");
      assert.strictEqual(str, `"wenye"`);
    });
    it("带有双引号", function() {
      const str = utils.formatCsvField(`wen"ye`);
      assert.strictEqual(str, `"wen""ye"`);
    });
  });
});
