function sma(data: number[], window: number) {
  if (!data || data.length < window) {
    return [];
  }
  let index = window - 1;
  const length = data.length + 1;
  const movingAvg = [];
  while (++index < length) {
    const windowSlice = data.slice(index - window, index);
    const sum = windowSlice.reduce((prev, curr) => prev + curr, 0);
    movingAvg.push(sum / window);
  }
  return movingAvg;
}

export default sma;
