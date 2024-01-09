export function px(n: number, scale: number) {
  const sign = Math.sign(n);
  const scaled = Math.round(n * scale);
  if (Math.abs(scaled) < 1) {
    return `${sign}px`;
  } else {
    return `${scaled}px`;
  }
}

export function pxHalf(n: number, scale: number) {
  const sign = Math.sign(n);
  const scaled = Math.round(n * ((scale - 1) / 2 + 1));
  if (Math.abs(scaled) < 1) {
    return `${sign}px`;
  } else {
    return `${scaled}px`;
  }
}
