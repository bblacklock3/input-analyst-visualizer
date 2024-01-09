/**
 * Returns the start of the day in milliseconds for the given Unix timestamp.
 * @param unixMs The Unix timestamp in milliseconds.
 * @returns The start of the day in milliseconds.
 */
export const startOfDay = (unixMs: number) => {
  return new Date(new Date(unixMs).setHours(0, 0, 0, 0)).getTime();
};

/**
 * Calculates the Unix timestamp representing the end of the day for a given Unix timestamp.
 * The time is set to 23:59:59.999.
 * @param unixMs - The Unix timestamp in milliseconds.
 * @returns The Unix timestamp representing the end of the day.
 */
export const endOfDay = (unixMs: number) => {
  return new Date(new Date(unixMs).setHours(23, 59, 59, 999)).getTime();
};

/**
 * Converts a Unix timestamp in milliseconds to a string representation without timezone information.
 * @param unixMs The Unix timestamp in milliseconds.
 * @returns The string representation of the timestamp without timezone information.
 */
export const toStrNoTimezone = (unixMs: number) => {
  const tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
  return new Date(unixMs - tzOffset).toISOString().slice(0, 23);
};

/**
 * Adds the specified number of minutes to the given Unix timestamp.
 * @param unixMs The Unix timestamp in milliseconds.
 * @param mins The number of minutes to add.
 * @returns The updated Unix timestamp after adding the minutes.
 */
export const addMinutes = (unixMs: number, mins: number) => {
  return unixMs + mins * 60 * 1000;
};

/**
 * Adds the specified number of hours to the given Unix timestamp.
 * @param unixMs The Unix timestamp in milliseconds.
 * @param hrs The number of hours to add.
 * @returns The updated Unix timestamp after adding the hours.
 */
export const addHours = (unixMs: number, hrs: number) => {
  return unixMs + hrs * 60 * 60 * 1000;
};

/**
 * Adds the specified number of days to the given Unix timestamp.
 * @param unixMs The Unix timestamp in milliseconds.
 * @param days The number of days to add.
 * @returns The updated Unix timestamp after adding the days.
 */
export const addDays = (unixMs: number, days: number) => {
  return unixMs + days * 24 * 60 * 60 * 1000;
};

/**
 * Creates an array of time values within a specified range.
 *
 * @param startUnixMs - The starting time in milliseconds.
 * @param stopUnixMs - The ending time in milliseconds.
 * @param step - The time interval between each value in milliseconds.
 * @returns An array of time values within the specified range.
 */
export const createTimeRange = (
  startUnixMs: number,
  stopUnixMs: number,
  step: number
) => {
  return Array.from(
    { length: (stopUnixMs - startUnixMs) / step + 1 },
    (value, index) => {
      const newTime = startUnixMs + index * step;
      return newTime > stopUnixMs ? stopUnixMs : newTime;
    }
  );
};

export const readableTime = (unixMs: number) => {
  return new Date(unixMs).toLocaleTimeString();
};
