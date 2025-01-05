import React, { useState, useEffect } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../assets/assets";

function Orders() {
  const Url = import.meta.env.VITE_BACKEND_URL;

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${Url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders.");
    }
  };

  const statusHandler = async(event,orderId) =>{
    const response = await axios.post(Url + "/api/order/status",{
      orderId,
      status : event.target.value
    })
    if(response.data.success){
      await fetchAllOrders()
    }
    
  }
  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Parcel Icon" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, itemIndex) => (
                    <span key={itemIndex}>
                      {item.name} x {item.quantity}
                      {itemIndex !== order.items.length - 1 && ", "}
                    </span>
                  ))}
                </p>
                <p className="order-item-name">{order.address.firstName + " " + order.address.lastName}</p>
                <div  className="order-item-address">
                  <p>{"street No. " +order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " 
                    + order.address.country + ", " + order.address.zipcode } </p>
                </div>
                <p className="order-item-phone">{"ph : "+  order.address.phone} </p>
              </div>
              <p>Items : {order.items.length}</p>
              <b>${order.amount}</b>
              <select onChange={(event)=> statusHandler(event,order._id)} value={order.status} >
                <option value="Food Processing">Food Processing</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
}

export default Orders;
