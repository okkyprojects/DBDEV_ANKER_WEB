import Footer from "@/Components/Footer/Footer";
import Navbar from "@/Components/Navbar/Navbar";
import React from "react";

const HomeLayout = ({children}) => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-neutral-50 font-dinnext text-neutral-900 font-normal">
                {children}
            </div>
            <Footer />
        </>
    );
};

export default HomeLayout;
