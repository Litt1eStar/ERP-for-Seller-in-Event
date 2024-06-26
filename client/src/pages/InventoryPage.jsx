import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InventoryProductCard from "../component/InventoryProductCard";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom'
import toast from "react-hot-toast";

const InventoryPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const [open, setOpen] = React.useState(false);

  const [name, setName] = useState("");
  const [margin, setMargin] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [products, setProducts] = useState([]);

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const clearInput = () => {
    setName("");
    setMargin("");
    setPrice("");
    setAmount("");
  };

  const handleCreateProduct = async () => {
    try {
      if (name === "" || margin === "" || price === "" || amount === "")
        throw new Error("Please Complete All Fields");

      const body = {
        name,
        margin: Number(margin),
        price: Number(price),
        amount: Number(amount),
      };
      const res = await fetch(`${API_URL}/api/v1/product/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(res.error);
      toast.success("Created New Product");
      clearInput();
      await fetchProductData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchProductData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/product/getAll`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser}`,
        },
      });
      if (!res.ok) throw new Error(res.error);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchFilterProductData = async (dataType) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/product/filteredData/${dataType}`, {
        headers: {
          "Authorization": `Bearer ${authUser}`
        }
      });
      if (!res.ok) throw new Error('There is no data');
      const data = await res.json();
      setProducts(data);
      toast.success(`Product Data Filtered by ${dataType}`);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <>
      <Stack direction={"row"} height={"100vh"}>
        {/* Product Container */}
        <Stack width={"70%"} height={"100%"} sx={{ overflowY: "auto" }}>
          <Stack
            height={"100%"}
            border={"1px solid"}
            pt={3}
            gap={2}
            sx={{ flexGrow: 1 }}
          >
            {products?.map((product) => (
              <InventoryProductCard
                key={product._id}
                product={product}
                fetchProductData={fetchProductData}
                open={open}
                setOpen={setOpen}
                sx={{ flexShrink: 0 }} // Ensures items do not shrink
              />
            ))}
          </Stack>
        </Stack>

        {/* Input Container */}
        <Stack width={"30%"} alignItems={"center"} gap={1} pt={2}>
          <Typography variant="h5" fontSize={isSmallScreen ? 20 : 30}>Create New Product</Typography>
          <TextField
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ width: "60%" }}
          />
          <TextField
            placeholder="Margin"
            value={margin}
            onChange={(e) => setMargin(e.target.value)}
            sx={{ width: "60%" }}
          />
          <TextField
            placeholder="Sell Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            sx={{ width: "60%" }}
          />
          <TextField
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            sx={{ width: "60%" }}
          />
          <Button
            sx={{ width: "20%", height: 40 }}
            onClick={handleCreateProduct}
          >
            Create
          </Button>
          
          {/* Filtering Choice */}
          <Stack justifyContent={'flex-start'} alignItems={'center'}>
            <Button color="inherit" onClick={() => fetchFilterProductData('margin')}>Order by Margin</Button>
            <Button color="inherit" onClick={() => fetchFilterProductData('price')}>Order by Sell Price</Button>
            <Button color="inherit" onClick={() => fetchFilterProductData('estProfit')}>Order by Estimate Profit</Button>
            <Button variant="contained" onClick={() => navigate('/')}>Go to Home Page</Button>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};

export default InventoryPage;
