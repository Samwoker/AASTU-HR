import React from "react";
import Carousel from "../../../components/common/Carousel";
import LoginForm from "../../../components/auth/LoginForm";

export default function Login() {
  return (
    <div className="flex h-screen w-full bg-gray-50">
      {/* Left Side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 p-4 h-full">
        <Carousel />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 md:p-10 animate-[fadeIn_0.5s_ease-out]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-k-dark-grey mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500">
              Please enter your details to sign in
            </p>
          </div>

          <LoginForm />

          <div className="mt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Kacha Digital Financial Service S.C.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
