import {useDebugValue, useState} from "react";
import axios from "axios";
import {API} from "../config";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
export default function Register(){

const [email,setEmail]=useState("");
const[password,setPassword]=useState("");
const [loading,setLoading] =useState(false);
//HOOKS
const navigate=useNavigate();

const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
        setLoading(true);
        const { data } = await axios.post(`${API}/pre-register`, { email, password });
    if(data?.error){
        toast.error(data.error);
        setLoading(false);
    }
    else{
        toast.success('Please check your email to activate account');
        setLoading(false);
        navigate("/");
    }
        console.log(data);
    //  console.table({email,password});
    }
    catch(err){
        console.log(err);
        toast.error('Something went wrong.Try again');
        setLoading(false);
    }
};
 return (
<div>
    <h1 className="display-1 bg-primary text-light p-5">
     REGISTER</h1>
     <div className="container">
        <div className="row">
            <div className="col-lg-4 offset-lg-4">
            <form onSubmit={handleSubmit}>
             <input type="text" placeholder="Enter your email address" className="form-control mb-4"
             required
             autoFocus
             value={email}
             onChange={e=>setEmail(e.target.value)}
             autoComplete="username"
             />
             <input type="password" placeholder="Enter your password" className="form-control mb-4"
             required
             autoFocus
             value={password}
             onChange={e=>setPassword(e.target.value)}
             autoComplete="current-password"
             />
             <button disabled={loading}
             className="btn btn-primary col-12 mb-4">
                {loading ?'Waiting...':"Register"}
                </button>
            </form>
            </div>
        </div>
     </div>
</div>
    )
}