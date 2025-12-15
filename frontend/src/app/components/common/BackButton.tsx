import Button from "./Button";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

type ButtonVariant = "primary" | "secondary" | "outline" | "link";

interface BackButtonProps {
  label?: string;
  to?: string;
  fallbackTo?: string;
  variant?: ButtonVariant;
  className?: string;
}

export default function BackButton({
  label = "Back",
  to,
  fallbackTo,
  variant = "link",
  className = "",
}: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <Button
      type="button"
      variant={variant}
      icon={FiArrowLeft}
      className={className}
      onClick={() => {
        if (to) {
          navigate(to);
          return;
        }

        if (window.history.length > 1) {
          navigate(-1);
          return;
        }

        if (fallbackTo) {
          navigate(fallbackTo);
        }
      }}
    >
      {label}
    </Button>
  );
}
