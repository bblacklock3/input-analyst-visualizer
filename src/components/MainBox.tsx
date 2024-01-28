import { Box } from "@chakra-ui/react";

interface IProps {
  children?: React.ReactNode;
}

const MainBox = ({ children }: IProps) => {
  const main = "#05070b";
  return (
    <Box p={5} bg={main} height={"100%"} minH={"100vh"}>
      {children}
    </Box>
  );
};

export default MainBox;
