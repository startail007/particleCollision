export const setShadow = function (ctx, offsetX, offsetY, blur, color) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = offsetX;
  ctx.shadowOffsetY = offsetY;
};
export const clearShadow = function (ctx) {
  setShadow(ctx, 0, 0, 0, "rgba(0, 0, 0, 0)");
};
export const numberCrop = function (value, min, max) {
  if (value <= min) {
    return min;
  }
  if (value >= max) {
    return max;
  }
  return value;
};
export const debounce = function (func, delay = 250) {
  let timeout = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};
export const randomSeedList = new Array(200);
for (let i = 0, len = randomSeedList.length; i < len; i++) {
  randomSeedList[i] = 1 - 2 * Math.random();
}
export const isPhone = function () {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
