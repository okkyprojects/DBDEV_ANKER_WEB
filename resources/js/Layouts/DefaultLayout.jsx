import { ToastContainer } from "react-toastify";
import Navbar from "@/Components/NavbarAuth/Navbar";
import "react-toastify/dist/ReactToastify.css";

const DefaultLayout = ({ children }) => {
  return (
      <>
          <Navbar />
          <div
              className={` bg-neutral-50 font-dinnext text-neutral-900 min-h-screen sm:ml-64 p-4 md:p-7 lg:p-10 xl:p-11 !pt-24
        `}
          >
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
      </>
  );
};

export default DefaultLayout;
