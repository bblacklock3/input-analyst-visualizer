import { Box } from "@chakra-ui/react";

interface IProps {
  children?: React.ReactNode;
}

const MainBox = ({ children }: IProps) => {
  return (
    <Box p={5} bg={"#05070b"} height={"100%"} minH={"100vh"}>
      {children}
    </Box>
  );
};

export default MainBox;
