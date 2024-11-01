import React from "react";
import HeroSection from './HeroSection';
import AOS from "aos";
import "aos/dist/aos.css";
import Products from "./Products";
import TopProducts from "./TopProducts";
import Banner from "./Banner";
import Subscribe from "./Subscribe";
import Testimonials from "./Testimonials";
import Popup from "./Popup";
import Footer from "~/components/layout/Footer";

function Home() {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };
  React.useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <HeroSection handleOrderPopup={handleOrderPopup} />
      <Products />
      <TopProducts handleOrderPopup={handleOrderPopup}/>
      <Banner/>
      <Subscribe/>
      <Testimonials/>
      <Footer/>
      <Popup orderPopup={orderPopup} setOrderPopup={setOrderPopup} />
    </div>
  )
}

export default Home