import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MdLock } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Input from "../common/Input";
import Button from "../common/Button";
import toast from "react-hot-toast";
import kachaLogo from "../../../assets/images/kacha_logo.jpg";
import authService from "../../services/authService";

interface ResetPasswordFormProps {
  title?: string;
  subtitle?: string;
  token?: string;
}

export default function ResetPasswordForm({
  title = "Reset Password",
  subtitle = "Enter a new password",
  token: propToken,
}: ResetPasswordFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useMemo(() => propToken || searchParams.get("token") || "", [
    propToken,
    searchParams,
  ]);
  const didShowMissingTokenToast = useRef(false);

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) return;
    if (didShowMissingTokenToast.current) return;
    toast.error("Reset token is missing. Please request a new reset link.");
    didShowMissingTokenToast.current = true;
  }, [token]);

  const validate = () => {
    if (!token) return "Reset token is missing.";
    if (!password) return "New password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    setError(validationError);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword({ token, password });
      setSuccess(true);
      toast.success("Password updated successfully");
      // backend returns JWT; authService stores it like login.
      navigate("/", { replace: true });
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Token is invalid or has expired";

      const friendlyMessage =
        String(message).includes("invalid") ||
        String(message).includes("expired")
          ? "Link expired. Please request a new reset link."
          : message;

      setError(friendlyMessage);
      toast.error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex items-center justify-center px-6 py-8 lg:px-12 bg-transparent">
        <div className="w-full max-w-[380px]">
          <div className="flex justify-center mb-6">
            <img
              src={kachaLogo}
              alt="Kacha HRMS"
              className="h-12 w-auto object-contain"
            />
          </div>
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 text-sm text-k-dark-grey">
            Reset token is missing. Please request a new reset link.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center px-6 py-8 lg:px-12 bg-transparent">
      <div className="w-full max-w-[380px]">
        <div className="flex justify-center mb-6">
          <img
            src={kachaLogo}
            alt="Kacha HRMS"
            className="h-12 w-auto object-contain"
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-k-dark-grey mb-2">{title}</h1>
          <p className="text-sm text-k-medium-grey">{subtitle}</p>
        </div>

        {success ? (
          <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl p-4 text-sm text-k-dark-grey">
            Password updated successfully. Redirecting…
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="New Password"
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter new password"
              icon={MdLock}
              error={!!error}
              helperText={error || ""}
              required
              suffix={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="text-k-medium-grey hover:text-k-dark-grey transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              }
            />

            <Button type="submit" variant="primary" fullWidth loading={loading}>
              Reset Password
            </Button>

            {error === "Link expired. Please request a new reset link." && (
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm font-medium text-k-orange hover:text-k-dark-grey transition-colors duration-200 text-left"
              >
                Back to Forgot Password
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
