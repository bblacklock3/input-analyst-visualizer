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
import { Heading, VStack, Stack, HStack, Text } from "@chakra-ui/react";
import { Radio, RadioGroup } from "@chakra-ui/react";
import {
  initializeIcons,
  createTheme,
  ThemeProvider,
  DatePicker,
  PrimaryButton,
} from "@fluentui/react";
import DataWindowPlot from "./plots/DataWindowPlot";

const theme = createTheme({
  palette: {
    themePrimary: "#169c7c",
    themeLighterAlt: "#f2fbf9",
    themeLighter: "#ceefe7",
    themeLight: "#a7e1d4",
    themeTertiary: "#5fc3ac",
    themeSecondary: "#29a78a",
    themeDarkAlt: "#148c70",
    themeDark: "#11765e",
    themeDarker: "#0c5746",
    neutralLighterAlt: "#323232",
    neutralLighter: "#3a3a3a",
    neutralLight: "#484848",
    neutralQuaternaryAlt: "#505050",
    neutralQuaternary: "#575757",
    neutralTertiaryAlt: "#747474",
    neutralTertiary: "#ececec",
    neutralSecondary: "#efefef",
    neutralPrimaryAlt: "#f2f2f2",
    neutralPrimary: "#e3e3e3",
    neutralDark: "#f9f9f9",
    black: "#fcfcfc",
    white: "#292929",
  },
});

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

  //const startTime = toStrNoTimezone(addDays(todayDate, -MINUS_DAYS));
  //const endTime = toStrNoTimezone(addDays(Date.now(), -MINUS_DAYS));

  const [windowSize, setWindowSize] = React.useState("");
  const [startTime, setStartTime] = React.useState(
    toStrNoTimezone(addDays(todayDate, -MINUS_DAYS))
  );
  const [endTime, setEndTime] = React.useState(
    toStrNoTimezone(addDays(Date.now(), -MINUS_DAYS))
  );

  function handleSetStartDate(date: any) {
    const start = startOfDay(date.getTime());
    const end = addDays(start, 1);
    setStartTime(toStrNoTimezone(start));
    setEndTime(toStrNoTimezone(end));
  }

  return (
    <VStack>
      <HStack p={2} borderRadius={10} bg={"#1a202c"} textColor={"#ffffff"}>
        <Text size="sm">Start Date:</Text>
        <ThemeProvider applyTo="body" theme={theme}>
          <DatePicker
            placeholder="Select a date"
            value={new Date()}
            onSelectDate={handleSetStartDate}
          />
        </ThemeProvider>
        <Text size="sm">Window Size:</Text>
        <RadioGroup onChange={setWindowSize} value={windowSize}>
          <Stack direction="row" fontSize={14} textColor={"#ffffff"}>
            <Radio value={oneMin.toString()}>1 min</Radio>
            <Radio value={fiveMin.toString()}>5 min</Radio>
            <Radio value={fifteenMin.toString()}>15 min</Radio>
            <Radio value={""}>None</Radio>
          </Stack>
        </RadioGroup>
      </HStack>
      <DataWindowPlot
        startTime={startTime}
        endTime={endTime}
        timeWindow={parseInt(windowSize)}
      />
    </VStack>
  );
};

export default KeyboardAnalyst;
