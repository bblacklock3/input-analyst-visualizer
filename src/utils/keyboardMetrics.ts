export const arrayRange = (start: number, stop: number, step: number) => {
  return Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  );
};

export const countEvents = (
  timeArray: number[],
  data: any,
  averageWindow: number
) => {
  if (data === undefined) return arrayRange(0, timeArray.length, 1);
  let timestamps: number[] = [];
  data.forEach((d: any) => {
    timestamps.push(new Date(d.timestamp).getTime());
  });
  let countedEvents: number[] = [];
  for (let i = 0; i < timeArray.length; i++) {
    countedEvents.push(
      timestamps.filter((timestamp: any, tsIdx: number) => {
        const lowerBound = timeArray[i] - averageWindow;
        const upperBound = timeArray[i];
        return timestamp > lowerBound && timestamp < upperBound;
      }).length
    );
  }
  return countedEvents;
};

export const getActiveTime = (
  timeArray: number[],
  mouseData: any,
  keyboardData: any,
  timeResolution: number
) => {
  let activeTime = 0;
  timeArray.map((ts: any, i: number) => {
    if (mouseData[i] > 0 || keyboardData[i] > 0) {
      activeTime += timeResolution;
    }
  });
  return Math.round((activeTime / (1000 * 60 * 60)) * 100) / 100;
};
