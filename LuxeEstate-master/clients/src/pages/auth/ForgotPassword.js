import {useDebugValue, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import{useAuth} from '../../context/auth';
import {Link} from "react-router-dom";
export default function Login(){
//context
const[auth,setAuth]=useAuth();
const [email,setEmail]=useState("");
const[password,setPassword]=useState("");
const [loading,setLoading] =useState(false);
//HOOKS
const navigate=useNavigate();

const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
        setLoading(true);
        const { data } = await axios.post(`/forgot-password`, { email});
    if(data?.error){
        toast.error(data.error);
        setLoading(false);
    }
    else{
        toast.success('Please check your email for password reset link');
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
     FORGOT PASSWORD</h1>
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
             <button disabled={loading}
             className="btn btn-primary col-12 mb-4">
                {loading ?'Waiting...':"Submit"}
                </button>
            </form>
            <Link className="text-danger" to="/login">
                Back to Login</Link>
            </div>
        </div>
     </div>
</div>
    )
}