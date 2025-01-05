import React, { useContext, useEffect } from 'react'
import './Verify.css'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../content/StoreContext';
import axios from 'axios';
function Verify() {

    const [searchParams,setSearchparams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const navigate = useNavigate();
    const {Url} = useContext(StoreContext)

    const verifyPayment = async ()=> {
        const response = await axios.post(Url + "/api/order/verify" , {success,orderId});
        if(response.data.success){
            navigate("/myorders");
        }
        else{
            navigate("/");
        }
    }
    useEffect(()=>{
        verifyPayment();
    },[])
    
  return (
    <div className='verify'>
      <div className="spinner"></div>
    </div>
  )
}

export default Verify
