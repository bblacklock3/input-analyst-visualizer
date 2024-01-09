import { useState } from "react";
import { Box, HStack, Icon, Text, useColorModeValue } from "@chakra-ui/react";

interface IProps {
  text: string;
  active: string;
  icon?: any;
}

const NavButton = ({ text, icon, active }: IProps) => {
  const [hover, setHover] = useState<boolean>(false);
  const isActive = active === text;
  let color = "#ffffff";
  if (isActive) {
    color = "#61b9fd";
  } else if (hover) {
    color = "#b0d4f0";
  }

  return (
    <HStack
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      cursor={!isActive && hover ? "pointer" : "default"}
      textColor={color}
      fontSize={"xl"}
      position={"relative"}
    >
      {icon && <Icon as={icon} boxSize={6} />}
      <Text>{text}</Text>
      {(isActive || hover) && (
        <Box
          position={"absolute"}
          mt={"54px"}
          h={"2px"}
          w={"100%"}
          bg={color}
          borderRadius={2}
        />
      )}
    </HStack>
  );
};
export default NavButton;
