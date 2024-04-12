import {useDebugValue, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import{useAuth} from '../context/auth';
import {Link, useLocation} from "react-router-dom";
export default function Login(){
//context
const[auth,setAuth]=useAuth();
const [email,setEmail]=useState("");
const[password,setPassword]=useState("");
const [loading,setLoading] =useState(false);
//HOOKS
const navigate=useNavigate();
const location=useLocation();

const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
        setLoading(true);
        const { data } = await axios.post(`/login`, { email, password });
        console.log(data);
    if(data?.error){
        toast.error(data.error);
        setLoading(false);
    }
    else{
        setAuth(data);
        localStorage.setItem('auth',JSON.stringify(data));
        toast.success('Login successful');
        setLoading(false);
//When a user is not logged in and tries to like a property, they are redirected to the login page.
// Instead of always redirecting to the dashboard after login, the speaker suggests using the useNavigate hook 
//to pass the current location state when navigating to the login page.
// The useLocation hook is introduced to retrieve the current location in the login component.
// In the login component, after a successful login, the speaker suggests checking if there is a location state.
// If present, redirect the user to that location; otherwise, redirect them to the dashboard.
// The speaker demonstrates the implementation in the handleLike and handleUnlike functions, ensuring that 
//users are redirected back to the page they were on before logging in.

        location?.state!== null
        ?navigate(location.state)
        :navigate("/dashboard");
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
     LOGIN</h1>
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
                {loading ?'Waiting...':"Login"}
                </button>
            </form>
            <Link className="text-danger" to="/auth/forgot-password">Forgot password</Link>
            </div>
        </div>
     </div>
</div>
    )
}
