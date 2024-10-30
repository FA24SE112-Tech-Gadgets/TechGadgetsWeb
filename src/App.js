import React, { Fragment } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import SignUp from "./pages/SignUp/SignUpPage";
import Verify from "./pages/SignUp/Verify";
import LogIn from "./pages/SignIn/LoginPage";
import FavoritePage from "./pages/Favorite/FavoritePage";
import ProfilePage from "./pages/Profile/ProfilePage";
import SearchPage from "./pages/Search/SearchPage";
import Order from "./pages/Seller/Order";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import SellerLayout from "./components/layout/SellerLayout";
import ManagerLayout from "./components/layout/ManagerLayout";
import Dashboardview from "./pages/Manager/Dashboardview";
import Main from "./pages/Manager/Main";
import AuthRoute from "./components/auth/AuthRoute";
import RoleBaseRoute from "./components/auth/RoleBaseRoute";
import DetailGadgetPage from "./pages/DetailGadget/DetailGadgetPage";
import SpecificationUnitPage from "./pages/Manager/SpecificationUnit/SpecificationUnitPage";
import CategoryPage from "./pages/Manager/Category/CategoryPage";
import BrandPage from "./pages/Manager/Brand/brand";
import SellerApplication from "./pages/Seller/SellerApplication";
import HistorySellerApplication from "./pages/Seller/HistorySellerApplication";
import SellerApplicationLayout from "./components/layout/SellerApplicationLayout";
import ManageSellerApplicationPage from "./pages/Manager/SellerApplication/ManageSellerApplication";
import ForgotPassword from "./pages/ForgotPWD/ForgotPWDPage";
import SellerProfilePage from "./pages/Seller/SellerProfile";
import SellerHeader from "./pages/Seller/SellerHeader";
import BrandGadgetPage from "./pages/Gadgets/Gadget";
import CategoryGadgetPage from "./pages/Gadgets/GadgetPage";
import CartPage from "./pages/Cart/cart";


function App() {
  return (

    <Routes>
      {/* Public Routes */}
      <Route element={<AuthLayout />}>
        <Route path='/signin' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/forgot-pwd' element={<ForgotPassword />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path='/' element={<Home />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/gadget/detail/:name' element={<DetailGadgetPage />} />
        <Route path='/favorite' element={
          <AuthRoute>
            <RoleBaseRoute accessibleRoles={["Customer"]}>
              <FavoritePage />
            </RoleBaseRoute>
          </AuthRoute>

        } />


        {/* <Route path="/gadgets/:category/:categoryId/:brand/:brandId" element={<BrandGadgetPage />} /> */}

        <Route path="/gadgets/:category/:brand" element={<BrandGadgetPage />} />
        <Route path="/gadgets/:category/" element={<CategoryGadgetPage />} />
        <Route path='/profile' element={
          <AuthRoute>
            <RoleBaseRoute accessibleRoles={["Customer"]}>
              <ProfilePage />
            </RoleBaseRoute>
          </AuthRoute>

        } />
          <Route path='/cart' element={
          <AuthRoute>
            <RoleBaseRoute accessibleRoles={["Customer"]}>
              <CartPage />
            </RoleBaseRoute>
          </AuthRoute>

        } />
      </Route>

      {/* Seller Route */}
      <Route element={<SellerLayout />}>
        <Route path='/seller' element={<Order />} />

      </Route>


      <Route path="/sellerProfile" element={
        <AuthRoute>
          <RoleBaseRoute accessibleRoles={["Seller"]}>
            <SellerHeader />
            <SellerProfilePage />
          </RoleBaseRoute>
        </AuthRoute>

      } />




      <Route element={<SellerApplicationLayout />}>
        <Route path='/seller-application' element={<SellerApplication />} />
        <Route path='/history-seller-application' element={<HistorySellerApplication />} />
      </Route>

      {/* Admin Route */}
      <Route element={<ManagerLayout />}>
        <Route path='/dashboard' element={
          <div className="flex overflow-scroll">
            <div className="basis-[100%] border overflow-scroll h-[100vh]">
              <Dashboardview />
              <Main />
            </div>
          </div>
        } />
        <Route path='/specification-unit' element={
          <SpecificationUnitPage />
        } />
        <Route path='/category' element={
          <CategoryPage />
        } />
        <Route path='/brand' element={
          <BrandPage />
        } />
        <Route path='/manage-seller-application' element={
          <ManageSellerApplicationPage />
        } />
      </Route>
    </Routes>

  );
}

export default App;
