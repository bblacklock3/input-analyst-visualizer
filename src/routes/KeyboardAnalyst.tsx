import React, { useEffect } from "react";
import TypingPlot from "../components/plots/TypingPlot";
import WeeklyTypingPlot from "../components/plots/WeeklyTypingPlot";
import {
  startOfDay,
  endOfDay,
  addDays,
  toStrNoTimezone,
} from "../utils/timeConversions";
import TypingSpeedPlot from "../components/plots/TypingSpeedPlot";
import { Heading, VStack } from "@chakra-ui/react";

const MINUS_DAYS = 0;

const KeyboardAnalyst = () => {
  const oneMin = 60 * 1000;
  const fiveMin = 5 * oneMin;
  const tenMin = 10 * oneMin;
  const fifteenMin = 15 * oneMin;
  const oneHour = 60 * oneMin;
  const oneDay = 24 * oneHour;

  const todayDate = startOfDay(Date.now());
  const lastWeekDate = addDays(todayDate, -7);

  const todayStartStr = toStrNoTimezone(todayDate);
  const nowDateStr = toStrNoTimezone(Date.now());

  const startTime = toStrNoTimezone(addDays(todayDate, -MINUS_DAYS));
  const endTime = toStrNoTimezone(addDays(Date.now(), -MINUS_DAYS));

  return (
    <VStack>
      <Heading color={"white"} size="md">
        Daily Total
      </Heading>
      <TypingPlot startTime={startTime} endTime={endTime} />
      <Heading color={"white"} size="md">
        1 Hour Window
      </Heading>
      <TypingPlot startTime={startTime} endTime={endTime} timeLimit={oneHour} />
      <Heading color={"white"} size="md">
        30 Minute Window
      </Heading>
      <TypingPlot
        startTime={startTime}
        endTime={endTime}
        timeLimit={2 * fifteenMin}
      />
      <Heading color={"white"} size="md">
        15 Minute Window
      </Heading>
      <TypingPlot
        startTime={startTime}
        endTime={endTime}
        timeLimit={fifteenMin}
      />
      <Heading color={"white"} size="md">
        5 Minute Window
      </Heading>
      <TypingPlot startTime={startTime} endTime={endTime} timeLimit={fiveMin} />
      <Heading color={"white"} size="md">
        1 Minute Window
      </Heading>
      <TypingPlot startTime={startTime} endTime={endTime} timeLimit={oneMin} />
    </VStack>
  );
};

export default KeyboardAnalyst;
