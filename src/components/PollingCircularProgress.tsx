import { Text, VStack } from "@chakra-ui/react";
import CustomCircularProgress from "./CustomCircularProgress";
import useSimplePolling from "../hooks/useSimplePolling";
import { DB_URL } from "../utils/constants";
import { px, pxHalf } from "../utils/dynamicCSS";

interface IProps {
  type: string;
  startTime: () => string;
  title: string;
  dataStr: string;
  limit: number;
  scale: number;
  icon?: any;
}

const PollingCircularProgress = (props: IProps) => {
  function processInput(data: any) {
    try {
      if (props.type === "keypress") {
        return data.total;
      } else if (props.type === "click") {
        return data.right_click + data.left_click;
      }
    } catch (err) {
      console.log(err);
      return 0;
    }
  }

  const { fetchedData: clicks } = useSimplePolling(
    0,
    processInput,
    "input",
    DB_URL + "data" + props.dataStr + "/?start_date=" + props.startTime(),
    1000
  );

  return (
    <VStack>
      <Text
        color={`#ffffff`}
        fontSize={pxHalf(30, props.scale)}
        fontWeight={`bold`}
        mb={px(-16, props.scale)}
      >
        {props.title}
      </Text>
      <CustomCircularProgress
        value={clicks}
        maxValue={props.limit}
        scale={props.scale}
      />
    </VStack>
  );
};

export default PollingCircularProgress;
