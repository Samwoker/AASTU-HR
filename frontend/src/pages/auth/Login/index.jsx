import React, { useState } from "react";
import Input from "../../../components/auth/Input";
import Button from "../../../components/auth/Button";
import Checkbox from "../../../components/auth/Checkbox";
import Carousel from "../../../components/auth/Carousel";
import kachaLogo from "../../../assets/images/kacha_logo.jpg";
import loginBg from "../../../assets/images/login_bg_image.jpg";
import LoginForm from "../../../components/auth/LoginForm";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Login attempt:", formData);
      setIsLoading(false);
      // Handle login logic here
    }, 1500);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative"
      style={{
        backgroundImage: `url(${loginBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-sm bg-black/10"></div>

      {/* Login container */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full max-w-[1200px] h-[550px] bg-white/20 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden mx-4">
        {/* Left Side - Login Form */}

        <LoginForm title="Welcome Back!" subtitle="Login to your account" />

        {/* Right Side - Carousel */}
        <div className="hidden lg:block relative h-full rounded-r-2xl overflow-hidden">
          <Carousel />
        </div>
      </div>
    </div>
  );
}
