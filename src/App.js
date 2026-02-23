import "./App.css";
import Home from "./components/Home";
import Footer from "./components/Layouts/Footer";
import Header from "./components/Layouts/Header";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import ProductDetail from "./components/product/ProductDetail";
import ProductSearch from "./components/product/ProductSearch";
import Register from "./components/user/Register";
import Login from "./components/user/Login";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Cart from './components/cart/Cart';
import { loadUser } from "./actions/userActions";
import Profile from './components/user/Profile';
import ProtectedRoute from './components/route/ProtectedRoute';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import ResetPassword from './components/user/ResetPassword';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Dispatch thunk correctly
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <HelmetProvider>
      <Router>
        <div className="App">
          <Header />

          <ToastContainer position="bottom-center" limit={1} />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search/:keyword" element={<ProductSearch />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
             <Route path='/myprofile' element={<ProtectedRoute><Profile/></ProtectedRoute> } />
             <Route path='/myprofile/update' element={<ProtectedRoute><UpdateProfile/></ProtectedRoute> } /> 
             <Route path='/myprofile/update/password' element={<ProtectedRoute><UpdatePassword/></ProtectedRoute> } />
             <Route path='/password/forgot' element={<ForgotPassword/> } />
             <Route path='/password/reset/:token' element={<ResetPassword/> } />
             <Route path='/cart' element={<Cart/> } />
          </Routes>

          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
