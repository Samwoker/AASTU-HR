import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Input from "../common/Input";
import Button from "../common/Button";
import Checkbox from "../common/Checkbox";
import { MdEmail, MdLock } from "react-icons/md";
import toast from "react-hot-toast";
import kachaLogo from "../../assets/images/kacha_logo.jpg";
import { login, reset } from "../../features/auth/authSlice";

export default function LoginForm({
  title = "Welcome Back!",
  subtitle = "Login to your account",
  redirectPath,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      // Show success toast
      if (isSuccess) {
        toast.success(`Welcome back, ${user?.email || 'User'}!`);
      }
      
      // Determine redirect path based on user role_id
      let path = redirectPath;
      if (!path) {
        // If no custom redirect path, route based on role_id
        // role_id: 1 = SUPER_ADMIN, others = regular employees
        if (user?.role_id === 1) {
          path = "/superadmin/dashboard";
        } else {
          path = "/employee/onboarding";
        }
      }
      navigate(path);
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch, redirectPath]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    dispatch(login(formData));
  };

  return (
    <div className="flex items-center justify-center px-6 py-8 lg:px-12 bg-transparent">
      <div className="w-full max-w-[380px]">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={kachaLogo}
            alt="Kacha HRMS"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-k-dark-grey mb-2">{title}</h1>
          <p className="text-sm text-k-medium-grey">{subtitle}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="E-mail Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            icon={MdEmail}
            error={!!errors.email}
            helperText={errors.email}
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={MdLock}
            error={!!errors.password}
            helperText={errors.password}
            required
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Checkbox
              label="Remember me"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <a
              href="#forgot-password"
              className="text-sm font-medium text-k-orange hover:text-k-dark-grey transition-colors duration-200"
            >
              Reset Password?
            </a>
          </div>

          <Button type="submit" variant="primary" fullWidth loading={isLoading}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
