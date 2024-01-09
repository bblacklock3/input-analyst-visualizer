import React from "react";
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  ButtonGroup,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  CircularProgress,
  CircularProgressLabel,
  Center,
  VStack,
  Box,
} from "@chakra-ui/react";
import { lerpRGB } from "../utils/lerpRGB";
import { px, pxHalf } from "../utils/dynamicCSS";

interface IProps {
  value: number;
  maxValue: number;
  scale?: number;
  icon?: any;
}

const CustomCircularProgress = ({ value, maxValue, scale: s = 1 }: IProps) => {
  const progress = Math.round((value / maxValue) * 100);
  let dynamicColor = `#ffffff`;
  if (progress < 50) {
    dynamicColor = lerpRGB(
      "rgb(39, 244, 87)",
      "rgb(224, 236, 0)",
      (2 * value) / maxValue
    );
  } else {
    dynamicColor = lerpRGB(
      "rgb(224, 236, 0)",
      "rgb(236, 0, 0)",
      (2 * value) / maxValue - 1
    );
  }

  return (
    <Center>
      <CircularProgress
        size={px(300, s)}
        thickness={pxHalf(5, s)}
        trackColor={`#9dd5ff36`}
        color={dynamicColor}
        capIsRound={true}
        value={Math.round((value / maxValue) * 100)}
        transform={`rotate(-180deg)`}
      ></CircularProgress>
      <VStack gap={0} justifyItems={"center"} position={`absolute`}>
        <Text
          mt={px(-10, s)}
          color={dynamicColor}
          fontSize={px(60, s)}
          fontWeight={`extrabold`}
        >
          {value.toLocaleString()}
        </Text>
        <Box h={px(4, s)} w={`100%`} bg={`#ffffff`} borderRadius={2} />
        <Text color={`#ffffff`} fontSize={px(40, s)} fontWeight={`bold`}>
          {maxValue.toLocaleString()}
        </Text>
      </VStack>
    </Center>
  );
};

export default CustomCircularProgress;
