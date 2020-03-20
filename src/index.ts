/** 节流 */
export function throttle(this: any, fn: (...args: any[]) => any, wait: number) {
  let last: number;
  return (...args: any[]) => {
    const now = Date.now();
    if (!last || now - last > wait) {
      fn.call(this, ...args);
      last = now;
    }
  };
}

/** 防抖 */
export function debounce(this: any, fn: (...args: any[]) => any, wait: number) {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.call(this, ...args);
    }, wait);
  };
}

const RATE = Symbol("RATE");
const START = Symbol("START");
const END = Symbol("END");
interface IGift {
  [RATE]: number;
  [START]: number;
  [END]: number;
}
/** 抽奖函数 */
export function lottery<T extends Record<string, any>>(gifts: T[], key: string = "rate"): T | null {
  const arr: Array<IGift & T> = [];
  let total = 0;
  // 计算范围
  gifts.forEach(gift => {
    const newGift = Object.assign({ [START]: total, [END]: total, [RATE]: gift[key] }, gift);
    total += gift[key];
    newGift[END] = total;
    arr.push(newGift);
  });
  // 随机落在那个范围
  const random = Math.random() * total;
  for (const gift of arr) {
    if (gift[START] <= random && random < gift[END]) {
      return gift;
    }
  }
  return null;
}
