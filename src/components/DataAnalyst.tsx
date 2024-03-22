import React, { useEffect } from "react";
import TypingPlot from "../components/plots/TypingPlot";
import WeeklyTypingPlot from "../components/plots/WeeklyTypingPlot";
import { useState } from "react";
import {
  startOfDay,
  endOfDay,
  addDays,
  toStrNoTimezone,
  addHours,
} from "../utils/timeConversions";
import TypingSpeedPlot from "../components/plots/TypingSpeedPlot";
import {
  Heading,
  VStack,
  Stack,
  HStack,
  Text,
  Button,
  Icon,
} from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import "react-day-picker/dist/style.css";
import DataWindowPlot from "./plots/DataWindowPlot";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import KeypressCard from "./cards/DailySummary";
import DailySummary from "./cards/DailySummary";
import HoursCalendar from "./cards/HoursCalendar";
import WeeklySummaryPlot from "./plots/WeeklySummaryPlot";

const KeyboardAnalyst = () => {
  const oneMin = 60 * 1000;
  const fiveMin = 5 * oneMin;
  const tenMin = 10 * oneMin;
  const fifteenMin = 15 * oneMin;
  const oneHour = 60 * oneMin;
  const oneDay = 24 * oneHour;

  //const todayDate = startOfDay(Date.now());
  const todayDate = addHours(startOfDay(Date.now()), 3);

  const lastWeekDate = addDays(todayDate, -7);

  const todayStartStr = toStrNoTimezone(todayDate);
  const nowDateStr = toStrNoTimezone(Date.now());

  //const startTime = toStrNoTimezone(addDays(todayDate, -MINUS_DAYS));
  //const endTime = toStrNoTimezone(addDays(Date.now(), -MINUS_DAYS));

  const [windowSize, setWindowSize] = useState(oneDay.toString());
  const [time, setTime] = useState({
    start: todayDate,
    end: addDays(todayDate, 1),
  });
  const [dateArray, setDateArray] = useState<
    { startTime: number; endTime: number }[]
  >(createDateArray(todayDate));

  function createDateArray(startDate: number) {
    let newDateArray = [];
    for (let i = 0; i < 7; i++) {
      const start = addDays(startDate, -i);
      const end = addDays(start, 1);
      newDateArray.push({ startTime: start, endTime: end });
    }
    return newDateArray.reverse();
  }

  function incDay(days: number) {
    setTime((prevTime) => {
      return {
        start: addDays(prevTime.start, days),
        end: addDays(prevTime.end, days),
      };
    });
  }

  function incWeek(weeks: number) {
    const startDate = addDays(dateArray[6].startTime, weeks * 7);
    setDateArray(createDateArray(startDate));
  }

  const startTime = time.start;
  const endTime = time.end;
  const timeResolution = 1 * 60 * 1000; // 1 min

  return (
    <VStack>
      <HStack p={2} borderRadius={10} bg={"#1a202c"} textColor={"#ffffff"}>
        <Text fontSize={20} fontWeight={"bold"}>
          {new Date(time.start).toLocaleDateString("en-US")}
        </Text>
        <Button
          size="sm"
          onClick={() => {
            incDay(-1);
          }}
        >
          <Icon as={MdOutlineArrowBackIos}></Icon>
        </Button>
        <Button
          size="sm"
          onClick={() => {
            incDay(1);
          }}
        >
          <Icon as={MdOutlineArrowForwardIos}></Icon>
        </Button>
        <Text size="sm">Window Size:</Text>
        <RadioGroup onChange={setWindowSize} value={windowSize}>
          <Stack direction="row" fontSize={14} textColor={"#ffffff"}>
            <Radio value={oneMin.toString()}>1 min</Radio>
            <Radio value={fiveMin.toString()}>5 min</Radio>
            <Radio value={fifteenMin.toString()}>15 min</Radio>
            <Radio value={oneDay.toString()}>None</Radio>
          </Stack>
        </RadioGroup>
      </HStack>
      <DataWindowPlot
        startTime={startTime}
        endTime={endTime}
        timeResolution={timeResolution}
        averageWindow={parseInt(windowSize)}
      />
      <HStack p={2} borderRadius={10} bg={"#1a202c"} textColor={"#ffffff"}>
        <Text fontSize={20} fontWeight={"bold"}>
          {new Date(dateArray[0].startTime).toLocaleDateString("en-US")} -{" "}
          {new Date(dateArray[6].startTime).toLocaleDateString("en-US")}
        </Text>
        <Button
          variant={"outline"}
          size="sm"
          onClick={() => {
            incWeek(-1);
          }}
        >
          <Icon color={"white"} as={MdOutlineArrowBackIos}></Icon>
        </Button>
        <Button
          variant={"outline"}
          size="sm"
          onClick={() => {
            incWeek(1);
          }}
        >
          <Icon color={"white"} as={MdOutlineArrowForwardIos}></Icon>
        </Button>
      </HStack>
      <WeeklySummaryPlot
        dateArray={dateArray}
        timeResolution={timeResolution}
        inactiveTime={fiveMin}
      ></WeeklySummaryPlot>
    </VStack>
  );
};

export default KeyboardAnalyst;
