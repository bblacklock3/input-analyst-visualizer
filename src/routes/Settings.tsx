import {
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  HStack,
  Text,
} from "@chakra-ui/react";

const Settings = () => {
  return (
    <HStack spacing={10}>
      <FormControl id="daily_clicking_limit" w={200} textColor={"#ffffff"}>
        <FormLabel fontWeight={"bold"}>Daily Clicking Limit</FormLabel>
        <HStack>
          <Input
            w={"90px"}
            type="number"
            placeholder="0"
            _placeholder={{ color: "white" }}
          />
          <Text ml={3} color={"#ffffff"} fontSize={"xl"} fontWeight={"bold"}>
            5,000
          </Text>
        </HStack>
      </FormControl>
      <FormControl id="daily_typing_limit" w={200} textColor={"#ffffff"}>
        <FormLabel fontWeight={"bold"}>Daily Typing Limit</FormLabel>
        <HStack>
          <Input
            type="number"
            placeholder="0"
            _placeholder={{ color: "white" }}
          />
          <Text ml={3} color={"#ffffff"} fontSize={"xl"} fontWeight={"bold"}>
            10,000
          </Text>
        </HStack>
      </FormControl>
    </HStack>
  );
};
export default Settings;
