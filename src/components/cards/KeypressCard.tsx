import { Text, VStack } from "@chakra-ui/react";
import CustomCircularProgress from "../CustomCircularProgress";
import useSimplePolling from "../../hooks/useSimplePolling";
import { DB_URL } from "../../utils/constants";
import { convertKeypresses } from "../../utils/keyboardMetrics";
import { useEffect, useState } from "react";

interface IProps {
  startTime: string;
  endTime: string;
  timeWindow: number;
}

const KeypressCard = (props: IProps) => {
  const startDatetime = props.startTime;
  const endDatetime = props.endTime;
  const timeResolution = 60 * 1000; // 1 min
  const smaWindow = 1;
  const totalPixelWidth = 1200;

  const [activeTime, setActiveTime] = useState(0);

  function handleKeypressData() {
    const startStr = `start_date=${startDatetime}`;
    const endStr = `end_date=${endDatetime}`;

    fetch(`${DB_URL}data/keyboard-data/?${startStr}&${endStr}`)
      .then((res) => res.json())
      .then((data: any) => {
        const [t, limitedKeypresses] = convertKeypresses(
          data,
          timeResolution,
          props.timeWindow
        );
      });
  }
  useEffect(() => {
    handleKeypressData();
  }, [props.startTime, props.endTime, props.timeWindow]);

  return (
    <VStack>
      <Text color={`#ffffff`} fontSize={30} fontWeight={`bold`} mb={-4}>
        Daily Keypresses
      </Text>
    </VStack>
  );
};

export default KeypressCard;
