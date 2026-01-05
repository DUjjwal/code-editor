import {toast, Bounce} from "react-toastify"


export const error = (error: string) => {
    toast.error(error , {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}