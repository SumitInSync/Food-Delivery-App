import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token,setToken] = useState("");
  const Url = import.meta.env.VITE_BACKEND_URL;
  const [food_list,setFoodList] =useState([]);



  const addToCart = async(itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if(token){
      await axios.post(Url + "/api/cart/add",{itemId},{headers : {token}})
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));

    if(token){
      await axios.post(Url + "/api/cart/remove",{itemId},{headers : {token}})
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const foodItem = food_list.find((food) => food._id === item);
        if (foodItem) {
          totalAmount += foodItem.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };
  

  const fetchFoodList = async() => {
    const response = await axios.get(Url + "/api/food/list");
    setFoodList(response.data.data);
  }

  const loadCartData = async(token)=>{
    const response = await axios.post(Url + "/api/cart/get",{},{headers : {token}})
    setCartItems(response.data.cartData);
  }

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if(localStorage.getItem("token")){
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();

  },[])
  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    token,
    setToken,
    Url
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
