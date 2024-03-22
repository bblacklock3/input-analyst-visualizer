import { NavLink } from "react-router-dom";
import {
  Box,
  Text,
  Divider,
  HStack,
  Icon,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@chakra-ui/react";
import NavButton from "./NavButton";
import { SiAlwaysdata } from "react-icons/si";
import { FaChevronRight } from "react-icons/fa";
import { MdSpeed } from "react-icons/md";
import { BsMouse3Fill } from "react-icons/bs";
import { FaKeyboard } from "react-icons/fa";
import { FaGear } from "react-icons/fa6";
import { FaDatabase } from "react-icons/fa";
import { useEffect, useLayoutEffect, useState } from "react";

const NavBar = () => {
  const [active, setActive] = useState<string>("Dashboard");
  useLayoutEffect(() => {
    const path = window.location.pathname;
    if (path === "/") {
      setActive("Dashboard");
    } else if (path === "/database") {
      setActive("Database");
    } else if (path === "/keyboard") {
      setActive("Keyboard");
    } else if (path === "/settings") {
      setActive("Settings");
    }
  }, []);
  return (
    <>
      <HStack spacing={8}>
        <HStack>
          <Icon as={SiAlwaysdata} boxSize={10} color={"#ffffff"} mr={-1} />
          <Box mr={2}>
            <Text color={"#ffffff"} fontSize={"xl"} fontWeight={"bold"} mb={-3}>
              Input
            </Text>
            <Text color={"#61b9fd"} fontSize={"xl"} fontWeight={"extrabold"}>
              Analyst
            </Text>
          </Box>
        </HStack>
        <NavLink to="/" onClick={() => setActive("Dashboard")}>
          <NavButton text="Dashboard" icon={MdSpeed} active={active} />
        </NavLink>
        <NavLink to="/database" onClick={() => setActive("Database")}>
          <NavButton text="Database" icon={FaDatabase} active={active} />
        </NavLink>
        <NavLink to="/keyboard" onClick={() => setActive("Keyboard")}>
          <NavButton text="Keyboard" icon={FaKeyboard} active={active} />
        </NavLink>
        <Box ml={"auto"} mr={3}>
          <NavLink to="/settings" onClick={() => setActive("Settings")}>
            <NavButton text="Settings" icon={FaGear} active={active} />
          </NavLink>
        </Box>
      </HStack>
      <Divider mt={1} mb={3} />
    </>
  );
};

export default NavBar;
