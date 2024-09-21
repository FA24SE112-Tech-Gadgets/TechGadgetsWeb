import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp/SignUpPage";
import Verify from "./pages/SignUp/Verify";
import LogIn from "./components/auth/LoginPage";
import FavoritePage from "./pages/Favorite/FavoritePage";
import SearchPage from "./pages/Search/SearchPage";
import Order from "./pages/Seller/Order";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import SellerLayout from "./components/layout/SellerLayout";
import AdminLayout from "./components/layout/AdminLayout";
import Dashboardview from "./pages/Admin/Dashboardview";
import Main from "./pages/Admin/Main";
import AuthRoute from "./components/auth/AuthRoute";
import RoleBaseRoute from "./components/auth/RoleBaseRoute";
import Iphone from "./pages/Gadgets/Phone/Iphone";
import Mac from "./pages/Gadgets/Laptop/Mac";


function App() {
  return (
   
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path='/signin' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/verify' element={<Verify />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/gadget/iphone' element={<Iphone />} />
          <Route path='/gadget/mac' element={<Mac/>}/>
          <Route path='/favorite' element= {
            <AuthRoute>
              <RoleBaseRoute accessibleRoles={["Buyer"]}>
                <FavoritePage/>
              </RoleBaseRoute>
            </AuthRoute>

          } />
        </Route>

        {/* Seller Route */}
        <Route element={<SellerLayout />}>
          <Route path='/seller' element= {
            <AuthRoute>
              <RoleBaseRoute accessibleRoles={["Buyer"]}>
                <Order/>
              </RoleBaseRoute>
            </AuthRoute>

          } />
        </Route>

        {/* Admin Route */}
        <Route element={<AdminLayout />}>
          <Route path='/dashboard' element={
            <div className="flex overflow-scroll">
              <div className="basis-[100%] border overflow-scroll h-[100vh]">
                <Dashboardview />
                <Main />
              </div>
            </div>

          } />
        </Route>
      </Routes>
   
  );
}

export default App;
