import React from "react";
import { Box, Grid, VStack, HStack, Heading, Text } from "@chakra-ui/react";
import CircularProgressWidget from "../components/CircularProgressWidget";
import KeypressCard from "../components/cards/DailySummary";
import {
  addMinutes,
  addHours,
  startOfDay,
  toStrNoTimezone,
  readableTime,
} from "../utils/timeConversions";
import useSimplePolling from "../hooks/useSimplePolling";

const Dashboard = () => {
  const processFn = (data: any) => {
    return data;
  };

  let { fetchedData: recentData } = useSimplePolling(
    processFn,
    "http://localhost:8000/data/recent",
    200
  );

  if (!recentData) {
    recentData = {
      clicks: [0, 0, 0, 0, 0],
      keypresses: [0, 0, 0, 0, 0],
    };
  }

  return (
    <>
      <Text mb={1} color={`#ffffff`} fontSize={40} fontWeight={`bold`}>
        Clicking Activity
      </Text>
      <Grid
        mt={0}
        p={5}
        gap={6}
        bg={"#1a202c"}
        width={"800px"}
        height={"475px"}
        borderRadius={"3xl"}
        templateColumns={"repeat(4, 1fr)"}
        templateRows={"repeat(2, 1fr)"}
        templateAreas={`"a a b c"
                        "a a d e"`}
      >
        <Box gridArea={"a"}>
          <CircularProgressWidget
            title={"Today"}
            value={recentData.clicks[4]}
            limit={5000}
            scale={1.2}
          />
        </Box>
        <Box gridArea={"b"}>
          <CircularProgressWidget
            title={"1 Hour"}
            value={recentData.clicks[3]}
            limit={1250}
            scale={0.6}
          />
        </Box>
        <Box gridArea={"c"}>
          <CircularProgressWidget
            title={"15 Min"}
            value={recentData.clicks[2]}
            limit={500}
            scale={0.6}
          />
        </Box>
        <Box mt={-4} gridArea={"d"}>
          <CircularProgressWidget
            title={"5 Min"}
            value={recentData.clicks[1]}
            limit={200}
            scale={0.6}
          />
        </Box>
        <Box mt={-4} gridArea={"e"}>
          <CircularProgressWidget
            title={"1 Min"}
            value={recentData.clicks[0]}
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
        p={5}
        gap={6}
        bg={"#1a202c"}
        width={"800px"}
        height={"475px"}
        borderRadius={"3xl"}
        templateColumns={"repeat(4, 1fr)"}
        templateRows={"repeat(2, 1fr)"}
        templateAreas={`"a a b c"
                        "a a d e"`}
      >
        <Box gridArea={"a"}>
          <CircularProgressWidget
            title={"Today"}
            value={recentData.keypresses[4]}
            limit={10000}
            scale={1.2}
          />
        </Box>
        <Box gridArea={"b"}>
          <CircularProgressWidget
            title={"1 Hour"}
            value={recentData.keypresses[3]}
            limit={2500}
            scale={0.6}
          />
        </Box>
        <Box gridArea={"c"}>
          <CircularProgressWidget
            title={"15 Min"}
            value={recentData.keypresses[2]}
            limit={1000}
            scale={0.6}
          />
        </Box>
        <Box mt={-4} gridArea={"d"}>
          <CircularProgressWidget
            title={"5 Min"}
            value={recentData.keypresses[1]}
            limit={400}
            scale={0.6}
          />
        </Box>
        <Box mt={-4} gridArea={"e"}>
          <CircularProgressWidget
            title={"1 Min"}
            value={recentData.keypresses[0]}
            limit={200}
            scale={0.6}
          />
        </Box>
      </Grid>
    </>
  );
};

export default Dashboard;
