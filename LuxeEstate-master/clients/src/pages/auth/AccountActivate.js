import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast";
import axios from "axios";
import {useAuth} from "../../context/auth"
export default function AccountActivate(){
   const [auth,setAuth]=useAuth();
   const navigate = useNavigate();
   const {token}=useParams();
   useEffect(()=>{
     if (token) requestActivation();
   },[token])
   const requestActivation= async()=>{
      try{
         const{data}=await axios.post(`/register`,{token});
         if(data?.error){
            toast.error(data.error)
         }
         else{
            //saving in context
            localStorage.setItem("auth",JSON.stringify(data));
            setAuth(data);
            toast.success('Successfully logged in. Welcome to RealEstate');
            navigate("/");
         }
      }
      catch(err){
         console.log(err);
         toast.error('Something Went Wrong');
      }
   }
   return <div className="display-1 display-flex justify-content-center align-items-center vh-100"
   style={{marginTop:'5%'}}>Please wait...</div>
}
