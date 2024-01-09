import React, { useEffect } from "react";
import TypingPlot from "../components/plots/TypingPlot";
import WeeklyTypingPlot from "../components/plots/WeeklyTypingPlot";
import { startOfDay, endOfDay, addDays, toStrNoTimezone } from "../utils/timeConversions";

const KeyboardAnalyst = () => {
  const minTimeScale = 60;
  const tenMinTimeScale = 60 * 10;
  const startTime = startOfDay(Date.now());
  const endTime = Date.now();

  const todayDate = startOfDay(Date.now());
  const lastWeekDate = addDays(todayDate, -7);

  const todateDateStr = toStrNoTimezone(todayDate);
  const lastWeekDateStr = toStrNoTimezone(lastWeekDate);
  console.log(todateDateStr, lastWeekDateStr);

  return (
    <WeeklyTypingPlot
      startTime={lastWeekDateStr}
      endTime={todateDateStr}
      timescale={tenMinTimeScale}
    />
  );
};

export default KeyboardAnalyst;
