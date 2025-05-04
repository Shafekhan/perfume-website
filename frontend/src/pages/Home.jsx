import React from "react";
import HeroImg from "../components/Home/HeroImg";
import {
  Box,
  SimpleGrid,
  Stack,
  Image,
  Flex,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import firstImg from "../assets/1.jpg";
import thirdImg from "../assets/3.jpg";
import { Link } from "react-router-dom";
import Card from "../components/Home/Card";
import { useDispatch } from "react-redux";
import {
  getCartActionFn,
  postCartActionFn,
} from "../Redux/cartReducer/cartAction";

const BrandCard = ({ imgUrl, brand }) => {
  return (
    <>
      <Link to={`/products?brand=${brand}`}>
        <Box
          h={["200px", "300px"]}
          w={["auto", "auto"]}
          overflow={"hidden"}
          boxSizing="borderBox"
        >
          <Image
            src={imgUrl}
            borderRadius={10}
            w={"100%"}
            h={"100%"}
            objectFit={"cover"}
          />
        </Box>
      </Link>
    </>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const toast = useToast();

  const bestSellers = [
    {
      _id: "647a04dd55005266a0b7ad7f",
      title: "Asad",
      price: 1800,
      brand: "Rasasi",
      imgUrl:
        "https://fragstalk.in/wp-content/uploads/2022/07/Lattafa-Asad-Perfume-100ML-EDP.png",
    },
    {
      _id: "647a04dd55005266a0b7ad9a",
      title: "Oud & Roses",
      price: 3000,
      brand: "Ahmed Al Maghribi",
      imgUrl:
        "https://www.ahmedalmaghribi.co.in/wp-content/uploads/2021/10/Artboard-74-min.png",
    },
    {
      _id: "647a04dd55005266a0b7ad85",
      title: "Asad Bourbon",
      price: 1800,
      brand: "Lattafa",
      imgUrl:
        "https://fragstalk.in/wp-content/uploads/2025/02/Lattafa-Asad-Bourbon.png",
    },
    {
      _id: "647a04dd55005266a0b7ad97",
      title: "Wisal Dhahab",
      price: 2700,
      brand: "Ajmal",
      imgUrl:
        "https://fragstalk.in/wp-content/uploads/2024/09/Ajmal-Wisal-Dhahab-1.png",
    },
  ];
  const topBrands = [
    {
      imgUrl:
        "https://fragstalk.in/wp-content/uploads/2022/07/Qaed-al-fursan-lattafa-90ml-EDP.png?_gl=1*b9rjv9*_up*MQ..*_gs*MQ..&gclid=Cj0KCQjwlMfABhCWARIsADGXdy_kpSrY74WYdI1_3rE55d9fD-0_CvuZAIQXi8sX2buZtNvEmnuCJpYaAjNVEALw_wcB&gbraid=0AAAAADOQR7_iZ7fHHPc40YaQbBWayqN4m",
      brand: "Lattafa",
    },
    {
      imgUrl:
        "https://fragstalk.in/wp-content/uploads/2025/04/Ahmed-Al-Maghribi-Ahl.png",
      brand: "Ahmed Al Maghribi",
    },
    {
      imgUrl:
        "https://fragstalk.in/wp-content/uploads/2024/09/Ajmal-Wisal-Dhahab-perfume-1.png",
      brand: "Ajmal",
    },
    {
      imgUrl: "https://fragstalk.in/wp-content/uploads/2024/10/Rasasi-Hawas-Black.png",
      brand: "Rasasi",
    },
  ];

  const handleOnClickAddToCart = (cartId) => {
    dispatch(postCartActionFn({ product: cartId }))
      .then((res) => {
        if (res.type === "POST_CART_SUCCESS") {
          toast({
            title: `${res.payload.message}`,
            isClosable: true,
            duration: 3000,
            status: "success",
          });
          dispatch(getCartActionFn());
        } else {
          toast({
            title: `${res.payload}`,
            isClosable: true,
            duration: 3000,
            status: "error",
          });
        }
        console.log("cart success: ", res);
      })
      .catch((err) => {
        toast({
          title: `Something went wrong please try again!`,
          isClosable: true,
          duration: 3000,
          status: "error",
        });
      });
  };
  return (
    <Box boxSizing="border-box" px={["2%", "5%", "5%"]}>
      <HeroImg image={firstImg} />
      <br />
      <Text fontSize={"2xl"}>Top Brands</Text>
      <SimpleGrid
        columns={[2, 2, 2, 4]}
        w={["100%", "100%"]}
        m={"auto"}
        mb={15}
        mt={2}
        spacing={6}
      >
        {topBrands.map((item) => (
          <BrandCard key={item.brand} imgUrl={item.imgUrl} brand={item.brand} />
        ))}
      </SimpleGrid>
      <HeroImg image={thirdImg} />
      <Text my={15} fontSize={"2xl"}>
        Best Sellers
      </Text>
      <SimpleGrid
        columns={[1, 2, 2, 4]}
        w={"100%"}
        m={"auto"}
        mb={20}
        spacing={["15px", "25px", "40px"]}
      >
        {bestSellers.map((product, idx) => (
          <Card
            key={idx}
            {...product}
            handleOnClickAddToCart={handleOnClickAddToCart}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Home;
