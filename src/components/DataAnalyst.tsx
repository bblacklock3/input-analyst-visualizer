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

  //const startTime = toStrNoTimezone(addDays(todayDate, -MINUS_DAYS));
  //const endTime = toStrNoTimezone(addDays(Date.now(), -MINUS_DAYS));

  const [windowSize, setWindowSize] = React.useState("");
  const [time, setTime] = React.useState({
    start: todayDate,
    end: addDays(todayDate, 1),
  });

  function incTime(days: number) {
    setTime((prevTime) => {
      return {
        start: addDays(prevTime.start, days),
        end: addDays(prevTime.end, days),
      };
    });
  }
  console.log(windowSize);

  return (
    <VStack>
      <HStack p={2} borderRadius={10} bg={"#1a202c"} textColor={"#ffffff"}>
        <Text size="sm" fontWeight={"bold"}>
          {new Date(time.start).toLocaleDateString("en-US")}
        </Text>
        <Button
          size="sm"
          onClick={() => {
            incTime(-1);
          }}
        >
          <Icon as={MdOutlineArrowBackIos}></Icon>
        </Button>
        <Button
          size="sm"
          onClick={() => {
            incTime(1);
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
        startTime={toStrNoTimezone(time.start)}
        endTime={toStrNoTimezone(time.end)}
        timeWindow={parseInt(windowSize)}
      />
      <HStack
        p={2}
        borderRadius={10}
        bg={"#1a202c"}
        textColor={"#ffffff"}
      ></HStack>
    </VStack>
  );
};

export default KeyboardAnalyst;
