import { start } from "repl";

function lerp(start: number, end: number, val: number) {
  return Math.round(start + (end - start) * val);
}

export const lerpRGB = (startColor: string, endColor: string, val: number) => {
  const c1 = startColor.match(/\d+/g)?.map(Number);
  const c2 = endColor.match(/\d+/g)?.map(Number);
  if (!c1 || !c2) return "rgb(255, 255, 255)";
  const color = [
    lerp(c1[0], c2[0], val),
    lerp(c1[1], c2[1], val),
    lerp(c1[2], c2[2], val),
  ];
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};
