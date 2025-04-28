import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { postOrderActionFn } from "../Redux/orderReducer/orderAction";
import OrderConfirmed from "../components/OrderConfirmed";
import { getCartActionFn } from "../Redux/cartReducer/cartAction";
import { getAddressActionFn } from "../Redux/addressReducer/addressAction";

let methods = [
  {
    method: "online",
    content: "Online Payment (Razorpay)",
  },
  {
    method: "cod",
    content: "Cash On Delivery",
  },
];

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Payment = () => {
  const [pmethod, setPmethod] = useState("cod");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, isLoading } = useSelector((state) => state.cartReducer);
  const { address } = useSelector((state) => state.addressReducer);

  useEffect(() => {
    dispatch(getAddressActionFn());
    if (!isLoading && cart?.cart?.length === 0) {
      navigate("/");
      console.log("navigate to homepage...");
    }
  }, [isLoading]);

  useEffect(() => {
    if (pmethod === "online") {
      handleRazorpayPayment();
    }
  }, [pmethod]);

  const handleOnClickOrderRequest = () => {
    const orderObject = {
      deliveryAt: cart.deliveryDate,
      address: address._id,
    };
    console.log("order Object: ", orderObject);
    dispatch(postOrderActionFn(orderObject))
      .then((res) => {
        if (res.type === "POST_ORDER_SUCCESS") {
          toast({
            title: `${res.payload.message}`,
            isClosable: true,
            duration: 4000,
            status: "success",
            position: "top",
          });
          dispatch(getCartActionFn());
          setOrderSuccess(true);
        } else {
          toast({
            title: `Something went wrong please try again`,
            isClosable: true,
            duration: 4000,
            status: "error",
            position: "top",
          });
        }
      })
      .catch(() => {
        toast({
          title: `Something went wrong please try again`,
          isClosable: true,
          duration: 4000,
          status: "error",
          position: "top",
        });
      });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      toast({
        title: "Failed to load Razorpay SDK",
        status: "error",
        isClosable: true,
      });
      return;
    }

    // ✅ Correct way to get token
    const userData = JSON.parse(localStorage.getItem("user"));
    const token = userData?.token;

    if (!token) {
      toast({
        title: "Authentication error. Please login again.",
        status: "error",
        isClosable: true,
      });
      navigate("/login");
      return;
    }

    const amount = getTotalPrice(cart) * 100; // Razorpay expects amount in paise

    try {
      const result = await fetch(
        `${import.meta.env.VITE_BASE_URL}/payment/razorpay/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Correct
          },
          body: JSON.stringify({ amount }),
        }
      );

      if (result.status !== 200) {
        const errorData = await result.json();
        throw new Error(errorData.message || "Failed to create Razorpay order");
      }

      const data = await result.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Perfume Shop",
        description: "Test Transaction",
        image: "/logo.png",
        order_id: data.id,
        handler: function (response) {
          console.log("Payment Success", response);
          handleOnClickOrderRequest();
        },
        prefill: {
          name: "User",
          email: "user@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err.message);
      toast({
        title: err.message || "Payment initiation failed",
        status: "error",
        isClosable: true,
      });
    }
  };

  return (
    <Box p={{ base: "2%", md: "5%", lg: "15%" }}>
      {!isLoading && !orderSuccess ? (
        <Box
          display={{ base: "block", md: "flex", xl: "flex" }}
          m="auto"
          rounded={"5px"}
          border={"1px solid lightgray"}
        >
          <Box
            w={{ base: "100%", md: "30%", xl: "30%" }}
            display={{ base: "flex", md: "block", xl: "block" }}
          >
            {methods.map((el) => (
              <RadioGroup key={el.method} onChange={setPmethod} value={pmethod}>
                <Flex
                  key={el.method}
                  onClick={() => setPmethod(el.method)}
                  h="70px"
                  bg={pmethod === el.method ? "gray" : ""}
                  alignItems={"center"}
                  cursor={"pointer"}
                  borderBottom="1px solid lightgrey"
                >
                  <Radio ml="15px" value={el.method}>
                    {el.content}
                  </Radio>
                </Flex>
              </RadioGroup>
            ))}
          </Box>
          <Spacer />
          <Box w={{ base: "100%", md: "65%", xl: "65%" }}>
            {pmethod === "cod" && (
              <Box boxSizing="border-box" p="20px" mt="15px">
                <Heading mt="15px" size={"md"} color={"green"}>
                  Payable amount ₹{getTotalPrice(cart)}
                </Heading>
                <Button
                  onClick={handleOnClickOrderRequest}
                  _hover={{ colorScheme: "red" }}
                  mt={"50px"}
                  colorScheme="blue"
                  rounded={"none"}
                  w="100%"
                >
                  PLACE ORDER
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <OrderConfirmed />
      )}
    </Box>
  );
};

export default Payment;

function getTotalPrice(cart) {
  let newPrice = cart?.cart?.reduce((acc, curr) => {
    return acc + curr.qty * curr.product.price;
  }, 0);
  return newPrice;
}
