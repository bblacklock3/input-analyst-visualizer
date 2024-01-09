import { Text, VStack } from "@chakra-ui/react";
import CustomCircularProgress from "../CustomCircularProgress";
import useSimplePolling from "../../hooks/useSimplePolling";
import { DB_URL } from "../../utils/constants";

interface IProps {
  icon?: any;
}

const KeypressCard = (props: IProps) => {
  const { fetchedData: keypresses } = useSimplePolling(
    0,
    processKeypreses,
    "keypresses",
    DB_URL + "data/keyboard-data/keypresses/",
    1000
  );

  function processKeypreses(data: any) {
    return data.total;
  }

  return (
    <VStack>
      <Text color={`#ffffff`} fontSize={30} fontWeight={`bold`} mb={-4}>
        Daily Keypresses
      </Text>
      <CustomCircularProgress value={keypresses} maxValue={10000} scale={1} />
    </VStack>
  );
};

export default KeypressCard;
