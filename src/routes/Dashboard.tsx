import React from "react";
import { Box, Grid, VStack, HStack, Heading, Text } from "@chakra-ui/react";
import PollingCircularProgress from "../components/PollingCircularProgress";
import KeypressCard from "../components/cards/KeypressCard";
import {
  addMinutes,
  addHours,
  startOfDay,
  toStrNoTimezone,
  readableTime,
} from "../utils/timeConversions";

const Dashboard = () => {
  function timerStartOfDay() {
    return () => toStrNoTimezone(startOfDay(Date.now()));
  }

  function timerAddHours(hours: number) {
    return () => toStrNoTimezone(addHours(Date.now(), hours));
  }

  function timerAddMinutes(minutes: number) {
    return () => toStrNoTimezone(addMinutes(Date.now(), minutes));
  }

  return (
    <>
      <Text mb={1} color={`#ffffff`} fontSize={40} fontWeight={`bold`}>
        Clicking Activity
      </Text>
      <Grid
        mt={0}
        p={3}
        gap={6}
        bg={"#1a202c"}
        width={"780px"}
        height={"450px"}
        templateColumns={"repeat(4, 1fr)"}
        templateRows={"repeat(2, 1fr)"}
        templateAreas={`"a a b c"
                        "a a d e"`}
        borderRadius={"lg"}
      >
        <Box gridArea={"a"}>
          <PollingCircularProgress
            type={"click"}
            startTime={timerStartOfDay()}
            title={"Today"}
            dataStr={"/mouse-data/clicks"}
            limit={5000}
            scale={1.2}
          />
        </Box>
        <Box gridArea={"b"}>
          <PollingCircularProgress
            type={"click"}
            startTime={timerAddHours(-1)}
            title={"1 Hour"}
            dataStr={"/mouse-data/clicks"}
            limit={1250}
            scale={0.6}
          />
        </Box>
        <Box gridArea={"c"}>
          <PollingCircularProgress
            type={"click"}
            startTime={timerAddHours(-0.25)}
            title={"15 Min"}
            dataStr={"/mouse-data/clicks"}
            limit={500}
            scale={0.6}
          />
        </Box>
        <Box mt={-4} gridArea={"d"}>
          <PollingCircularProgress
            type={"click"}
            startTime={timerAddMinutes(-5)}
            title={"5 Min"}
            dataStr={"/mouse-data/clicks"}
            limit={200}
            scale={0.6}
          />
        </Box>
        <Box mt={-4} gridArea={"e"}>
          <PollingCircularProgress
            type={"click"}
            startTime={timerAddMinutes(-1)}
            title={"1 Min"}
            dataStr={"/mouse-data/clicks"}
            limit={100}
            scale={0.6}
          />
        </Box>
      </Grid>
      <Text mb={1} color={`#ffffff`} fontSize={40} fontWeight={`bold`}>
        Typing Activity
      </Text>
      <Grid
        mt={0}
        p={3}
        gap={6}
        bg={"#1a202c"}
        width={"780px"}
        height={"450px"}
        templateColumns={"repeat(4, 1fr)"}
        templateRows={"repeat(2, 1fr)"}
        templateAreas={`"a a b c"
                        "a a d e"`}
        borderRadius={"lg"}
      >
        <Box gridArea={"a"}>
          <PollingCircularProgress
            type={"keypress"}
            startTime={timerStartOfDay()}
            title={"Today"}
            dataStr={"/keyboard-data/keypresses"}
            limit={10000}
            scale={1.2}
          />
        </Box>
        <Box gridArea={"b"}>
          <PollingCircularProgress
            type={"keypress"}
            startTime={timerAddHours(-1)}
            title={"1 Hour"}
            dataStr={"/keyboard-data/keypresses"}
            limit={2500}
            scale={0.6}
          />
        </Box>
        <Box gridArea={"c"}>
          <PollingCircularProgress
            type={"keypress"}
            startTime={timerAddHours(-0.25)}
            title={"15 Min"}
            dataStr={"/keyboard-data/keypresses"}
            limit={1000}
            scale={0.6}
          />
        </Box>
        <Box mt={-4} gridArea={"d"}>
          <PollingCircularProgress
            type={"keypress"}
            startTime={timerAddMinutes(-5)}
            title={"5 Min"}
            dataStr={"/keyboard-data/keypresses"}
            limit={400}
            scale={0.6}
          />
        </Box>
        <Box mt={-4} gridArea={"e"}>
          <PollingCircularProgress
            type={"keypress"}
            startTime={timerAddMinutes(-1)}
            title={"1 Min"}
            dataStr={"/keyboard-data/keypresses"}
            limit={200}
            scale={0.6}
          />
        </Box>
      </Grid>
    </>
  );
};

export default Dashboard;
