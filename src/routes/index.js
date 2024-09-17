 //Layout
import {HeaderOnly} from "~/components/Layout"
import Home from "~/pages/Home"
import SignInPage from "~/pages/SignIn/SignInPage"
import SignUpPage from "~/pages/SignUp/SignUpPage"
import ForgotPWDPage from "~/pages/ForgotPWD/ForgotPWDPage"
import LogIn from "~/components/auth/LoginPage"
//Public routes 

const publicRoutes = [
  { path: "/", component: Home },
  { path: "/signin", component: SignInPage, layout: null},
  { path: "/signup", component: SignUpPage, layout: null},
  { path: "/forgot-password", component: ForgotPWDPage, layout: null },
];





const privateRoutes = []



export {publicRoutes, privateRoutes}