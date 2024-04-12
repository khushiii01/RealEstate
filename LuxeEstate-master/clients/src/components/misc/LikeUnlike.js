import {useAuth} from '../../context/auth';
import {FcLike, FcLikePlaceholder} from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
export default function LikeUnlike({ad}){

    const [auth,setAuth]=useAuth();
    const navigate=useNavigate();

    const handleLike=async()=>{
      try{
      if(auth.user===null){
        navigate('/login',{
        state:`/ad/${ad.slug}`,
        });
        return; //so that no other code is executed
      }
      const{data}=await axios.post('/wishlist',{adId:ad._id});
      console.log("handle like=>",data);
      //If the user is authenticated, it makes a POST request to the
      // server endpoint /wishlist with the adId parameter set to ad.id.

    //   { this is how the new data would look like
    //     "id": "user123",
    //     "username": "john_doe",
    //     "email": "john@example.com",
    //     "wishlist": [
    //       "ad123",
    //       "ad456",
    //       "ad789"
    //     ],
    //     "otherProperties": "..."
    //   }
    //Update User Data in Component State:
      setAuth({...auth,user:data});
      const fromLS=JSON.parse(localStorage.getItem("auth"));
      fromLS.user=data;
      //Update User Data in localStorage:
      localStorage.setItem('auth',JSON.stringify(fromLS));
      toast.success('Added to Wishlist')
      }catch(err){
        console.log(err);
      } 
    }


    const handleUnLike=async()=>{
        try{
            if(auth.user===null){
                navigate('/login',{
                state:`/ad/${ad.slug}`,
                });
          return;
        }
        const{data}=await axios.delete(`/wishlist/${ad._id}`);
        console.log("handle unlike=>",data);
        //this will be received as ad-id in the backend and then it will be deleted
        setAuth({...auth,user:data});
        const fromLS=JSON.parse(localStorage.getItem("auth"));
        fromLS.user=data;
        localStorage.setItem('auth',JSON.stringify(fromLS));
        toast.success('Removed from Wishlist')
        }catch(err){
          console.log(err);
        } 
      }
  
    return <>
    {auth.user?.Wishlist?.includes(ad?._id)?
        <span> 
       <FcLike onClick={handleUnLike} className='h2 mt-3'/>
       {/* //what if we use arrow function here, wht would be the difference? */}
        </span>
    :<span>
        <FcLikePlaceholder onClick={handleLike} className='h2 mt-3 pointer'/>
    </span>}
    </>;
}