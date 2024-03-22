import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import CustomCircularProgress from "../CustomCircularProgress";
import useSimplePolling from "../../hooks/useSimplePolling";
import { DB_URL } from "../../utils/constants";
import {
  getActiveTime,
  arrayRange,
  countEvents,
} from "../../utils/keyboardMetrics";
import { useEffect, useState } from "react";
import { toStrNoTimezone } from "../../utils/timeConversions";

interface IProps {
  startTime: number;
  endTime: number;
  timeResolution: number;
  inactiveTime: number;
}

const DailySummary = ({
  startTime,
  endTime,
  timeResolution,
  inactiveTime,
}: IProps) => {
  const [activeTime, setActiveTime] = useState({
    total: 0,
    keyboard: 0,
    mouse: 0,
  });

  async function getDataCount(timeArray: number[]) {
    const startStr = `start_date=${toStrNoTimezone(startTime)}`;
    const endStr = `end_date=${toStrNoTimezone(endTime)}`;

    const keypresses = await fetch(
      `${DB_URL}data/keyboard-data/?${startStr}&${endStr}`
    )
      .then((res) => {
        return res.ok ? res.json() : [];
      })
      .then((data: any) => {
        return countEvents(timeArray, data, inactiveTime);
      });
    const clicks = await fetch(
      `${DB_URL}data/mouse-data/?${startStr}&${endStr}`
    )
      .then((res) => {
        return res.ok ? res.json() : [];
      })
      .then((data: any) => {
        return countEvents(timeArray, data, inactiveTime);
      });
    setActiveTime(() => {
      const total = getActiveTime(
        timeArray,
        clicks,
        keypresses,
        timeResolution
      );
      const keyboard = getActiveTime(
        timeArray,
        keypresses,
        keypresses,
        timeResolution
      );
      const mouse = getActiveTime(timeArray, clicks, clicks, timeResolution);
      return { total, keyboard, mouse };
    });
  }

  useEffect(() => {
    const timeArray = arrayRange(startTime, endTime, timeResolution);
    getDataCount(timeArray);
  }, [startTime, endTime, inactiveTime]);

  return (
    <Box>
      <Text fontSize={20} fontWeight={"bold"}>
        Total: {activeTime.total} hrs
      </Text>
      <Text fontSize={20} fontWeight={"bold"}>
        Keyboard: {activeTime.keyboard} hrs
      </Text>
      <Text fontSize={20} fontWeight={"bold"}>
        Mouse: {activeTime.mouse} hrs
      </Text>
    </Box>
  );
};

export default DailySummary;
