import {BrowserRouter, Routes, Route} from "react-router-dom";
import { AuthProvider } from "./context/auth";
import Main from "./components/nav/Main";
import {Toaster} from 'react-hot-toast';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountActivate from "./pages/auth/AccountActivate";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AccessAccount from "./pages/auth/AccessAccount";
import Dashboard from "./pages/auth/user/Dashboard";
import AdCreate from "./pages/auth/user/ad/AdCreate";
import PrivateRoute from "./components/routes/PrivateRoute";
import SellHouse from "./pages/auth/user/ad/SellHouse";
import SellLand from "./pages/auth/user/ad/SellLand";
import RentHouse from "./pages/auth/user/ad/RentHouse";
import RentLand from "./pages/auth/user/ad/RentLand";
import AdView from "./pages/AdView";
import Footer from "./components/nav/Footer";
import Profile from "./pages/auth/user/Profile";
import Settings from "./pages/auth/user/Settings";
import AdEdit from "./pages/auth/user/AdEdit";
import Wishlist from "./pages/auth/user/Wishlist";
import Enquiries from "./pages/auth/user/Enquiries";
import Agents from "./pages/Agents";
import Agent from "./pages/Agent";
import Buy from "./pages/Buy";
import Rent from "./pages/Rent";
import Search from "./pages/Search";
import { SearchProvider } from "./context/search";

function App() {
  return (
<BrowserRouter>
<AuthProvider>
<SearchProvider>
<Main/>
<Toaster/>
 <Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/Login" element={<Login/>}/>
  <Route path="/Register" element={<Register/>}/>
  <Route path="/auth/account-activate/:token"
   element={<AccountActivate/>}/>
   <Route path="/auth/forgot-password"
   element={<ForgotPassword/>}/>
    <Route path="/auth/access-account/:token"
   element={<AccessAccount/>}/>
    <Route path="/dashboard"
   element={<Dashboard />} />
     <Route path="/ad/create"
   element={<AdCreate/>} />
     <Route path="/" element={<PrivateRoute/>}>
      <Route path="dashboard" element={<Dashboard/>}/>
      <Route path="/ad/create" element={<AdCreate/>}/>
      <Route path="/ad/create/sell/house" element={<SellHouse/>}/>
      <Route path="/ad/create/sell/land" element={<SellLand/>}/>
      <Route path="/ad/create/rent/house" element={<RentHouse/>}/>
      <Route path="/ad/create/rent/land" element={<RentLand/>}/>
      <Route path="user/profile" element={<Profile/>}/>
      <Route path="user/settings" element={<Settings />} />
      <Route path="user/ad/:slug" element={<AdEdit />} />
      <Route path="ad/:slug" element={<AdView/>}/>
      <Route path="wishlist" element={<Wishlist />} />
      <Route path="user/enquiries" element={<Enquiries/>}/>
      <Route path="/agents" element={<Agents/>}/>
      <Route path="/agent/:username" element={<Agent/>}/>
      <Route path="/buy" element={<Buy/>}/>
      <Route path="/rent" element={<Rent/>}/>
      <Route path="/search" element={<Search/>}/>
    </Route>
   </Routes>
   </SearchProvider>
   <Footer/>
  </AuthProvider>
</BrowserRouter>
  );
} 

export default App;
