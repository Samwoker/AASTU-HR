import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "colored",
};

const ToastService = {
  success: (message: string) => {
    toast.success(message, defaultOptions);
  },
  error: (message: string) => {
    toast.error(message, defaultOptions);
  },
  info: (message: string) => {
    toast.info(message, defaultOptions);
  },
  warning: (message: string) => {
    toast.warning(message, defaultOptions);
  },
};

export default ToastService;
