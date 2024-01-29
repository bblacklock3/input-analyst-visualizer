const arrayRange = (start: number, stop: number, step: number) => {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );
};

export const convertKeypresses = (
  data: any,
  timeResolution: number,
  window: number
) => {
  let timestamps: number[] = [];
  data.forEach((d: any) => {
    timestamps.push(new Date(d.timestamp).getTime());
  });
  timestamps.reverse();
  let t = arrayRange(
    timestamps[0],
    timestamps[timestamps.length - 2],
    timeResolution
  );
  let totalKeypresses: number[] = [];
  let keypresses = 0;
  for (let i = 0; i < t.length; i++) {
    keypresses += timestamps.filter((d: any) => {
      return d > t[i] && d < t[i + 1];
    }).length;
    totalKeypresses.push(keypresses);
  }
  let limitedKeypresses = [];
  for (let i = 0; i < t.length; i++) {
    limitedKeypresses.push(
      timestamps.filter((d: any) => {
        if (window) {
          return d > t[i + 1] - window && d < t[i + 1];
        }
      }).length
    );
  }
  return [t, limitedKeypresses];
};

export const activeTime = (
  keypresses: any,
  timeResolution: number,
  activeLimit: number
) => {
  let activeTime = 0;
  keypresses.map((d: any, i: number) => {
    if (d > 0) {
      activeTime += timeResolution;
    }
  });
  return activeTime;
};
