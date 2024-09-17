import Header from "~/components/Layout/components/Header";
 import Footer from "~/components/Layout/components/Footer";

function DefaultLayout({children}) {
  return (

            <div className="wrapper">
                <Header/>
                <div className="container">                    
                    <div className="content">
                        {children}
                    </div>
                </div>
                <Footer/>
             </div>

);
}
export default DefaultLayout;
