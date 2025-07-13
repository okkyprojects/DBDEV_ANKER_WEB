import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import React from "react";import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const HomeLayout = ({children}) => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-neutral-50 font-dinnext text-neutral-900 font-normal">
                {children}
            </div>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Footer />
        </>
    );
};

export default HomeLayout;
