import React, { Fragment, useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Home from "./pages/Home";
import RoleBaseRoute from "./components/auth/RoleBaseRoute";
import AuthRoute from "./components/auth/AuthRoute";
import useAuth from "./context/auth/useAuth";
import SignUp from "./pages/SignUp/SignUpPage";
import Verify from "./pages/SignUp/Verify";
import Header from "./components/layout/Header";
import Sidebar from "./pages/Admin/Sidebar";
import Dashboardview from "./pages/Admin/Dashboardview";
import Main from "./pages/Admin/Main";
import SearchPage from "./pages/Search/SearchPage";
import LogIn from "./components/auth/LoginPage";
import FavoritePage from "./pages/Favorite/FavoritePage";
import ProfilePage from "./pages/Profile/ProfilePage";

function App() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Define paths where the header should be hidden
  const hideHeaderPaths = ['/signin', '/signup', '/verify', '/dashboard'];

  // Check if current path is one of the paths to hide header
  const showHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <Fragment>
      {showHeader && <Header />}
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<Home />} />
        <Route path='/signin' element={<LogIn />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/verify' element={<Verify />} />
        <Route path ='search' element={<SearchPage/>}/>
        <Route path ='favorite' element={<FavoritePage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
        {/* Protected Routes */}
        

        {/* Admin Dashboard Route */}
        <Route path='/dashboard' element={
          <AuthRoute>
            <RoleBaseRoute accessibleRoles={["Admin"]}>
              <div className="flex overflow-scroll">
                <div className="basis-[12%] h-[100vh]">
                  <Sidebar />
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                  <Dashboardview />
                  <div>
                    <Main />
                  </div>
                </div>
              </div>
            </RoleBaseRoute>
          </AuthRoute>
        } />

      </Routes>
    </Fragment>
  );
}

export default App;
