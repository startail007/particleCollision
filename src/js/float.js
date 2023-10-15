export class Float {
  static mix(val0, val1, rate) {
    return val0 * (1 - rate) + val1 * rate;
  }
  static toRate(val0, val1, val) {
    return (val - val0) / (val1 - val0);
  }
  static clamp(min, max, val) {
    if (val <= min) return min;
    if (val >= max) return max;
    return val;
  }
}
