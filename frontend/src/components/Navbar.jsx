import React, { useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import logo from "../assets/perfumate.png";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogoutActionFn } from "../Redux/authReducer/authAction";
import { getCartActionFn } from "../Redux/cartReducer/cartAction";

const Navbar = () => {
  const dispatch = useDispatch();
  const { onOpen } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const userData = useSelector((state) => state.authReducer);
  const cartData = useSelector((state) => state.cartReducer.cart);

  useEffect(() => {
    dispatch(getCartActionFn());
  }, [userData?.isAuth]);

  const handleLogout = () => {
    dispatch(userLogoutActionFn());
  };

  return (
    <Flex
      w="100%"
      h="70px"
      px={["2%", "5%", "5%"]}
      bg="blue.800"
      alignItems="center"
      justifyContent="space-between"
      position="sticky"
      top="0"
      zIndex="3"
    >
      <Link to="/">
        <Image w={["60px", "90px", "90px"]} src={logo} alt="PERFUMATE" />
      </Link>

      <Flex alignItems="center" gap="1rem">
        {userData?.user?.role === "admin" && (
          <Link to="/admindashboard">
            <Text display={["none", "block"]} color="white">
              Dashboard
            </Text>
          </Link>
        )}
        <Link to="/products">
          <Text display={["none", "block"]} color="white">
            Products
          </Text>
        </Link>
        <Link to="/cart">
          <Text display={["none", "block"]} color="white">
            {`Cart(${cartData?.cart?.length || 0})`}
          </Text>
        </Link>

        <Box display={["none", "block"]}>
          <Menu>
            <MenuButton as={Button} colorScheme="blue">
              {userData?.isAuth ? "Profile" : <Link to="/login">Login</Link>}
            </MenuButton>
            {userData?.isAuth && (
              <MenuList>
                <MenuGroup title="Profile">
                  <MenuItem>My Account</MenuItem>
                  <Link to="/orders">
                    <MenuItem>My Orders</MenuItem>
                  </Link>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Danger">
                  <MenuItem onClick={handleLogout} color="red">
                    Logout
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            )}
          </Menu>
        </Box>

        <Button
          onClick={toggleColorMode}
          display={["none", "block"]}
          p="0"
          colorScheme="blue"
        >
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>

        {/* Hamburger for Mobile */}
        <Box display={["block", "none"]}>
          <Menu>
            <MenuButton as={Button} colorScheme="blue">
              <HamburgerIcon />
            </MenuButton>
            <MenuList>
              <MenuGroup title="Move to">
                {userData?.user?.role === "admin" && (
                  <Link to="/admindashboard">
                    <MenuItem>Dashboard</MenuItem>
                  </Link>
                )}
                <Link to="/products">
                  <MenuItem>Products</MenuItem>
                </Link>
                <Link to="/cart">
                  <MenuItem>Cart({`${cartData?.cart?.length || 0}`})</MenuItem>
                </Link>
                <Link to="/orders">
                  <MenuItem>My Orders</MenuItem>
                </Link>
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Profile">
                {userData?.isAuth ? (
                  <MenuItem onClick={handleLogout} color="red">
                    Logout
                  </MenuItem>
                ) : (
                  <>
                    <Link to="/login">
                      <MenuItem>Login</MenuItem>
                    </Link>
                    <Link to="/signup">
                      <MenuItem>Signup</MenuItem>
                    </Link>
                  </>
                )}
              </MenuGroup>
              <MenuDivider />
              <MenuGroup title="Theme">
                <MenuItem onClick={toggleColorMode}>
                  {colorMode === "dark" ? "Light" : "Dark"} Theme
                </MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
