import { Text, VStack } from "@chakra-ui/react";
import CustomCircularProgress from "./CustomCircularProgress";
import useSimplePolling from "../hooks/useSimplePolling";
import { DB_URL } from "../utils/constants";
import { px, pxHalf } from "../utils/dynamicCSS";

interface IProps {
  title: string;
  value: number;
  limit: number;
  scale: number;
  icon?: any;
}

const CircularProgressWidget = (props: IProps) => {
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
        value={props.value}
        maxValue={props.limit}
        scale={props.scale}
      />
    </VStack>
  );
};

export default CircularProgressWidget;
