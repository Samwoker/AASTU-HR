import React, { useEffect } from "react";
import { MdCheckCircle, MdWarning, MdInfo, MdError } from "react-icons/md";
import Button from "./Button";

/**
 * StatusModal - A reusable modal for success, warning, error, and info messages.
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Callback when modal is closed
 * @param {string} type - 'success' | 'warning' | 'error' | 'info'
 * @param {string} title - Modal title
 * @param {string} message - Modal message/description
 * @param {string} primaryButtonText - Text for the primary action button
 * @param {function} onPrimaryAction - Callback for primary button click
 * @param {string} secondaryButtonText - Optional text for secondary button
 * @param {function} onSecondaryAction - Optional callback for secondary button click
 */
export default function StatusModal({ 
  isOpen, 
  onClose, 
  type = "success",
  title, 
  message,
  primaryButtonText = "Close",
  onPrimaryAction,
  secondaryButtonText,
  onSecondaryAction
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const iconConfig = {
    success: { icon: MdCheckCircle, bgColor: "bg-green-50", iconColor: "text-success" },
    warning: { icon: MdWarning, bgColor: "bg-yellow-50", iconColor: "text-warning" },
    error: { icon: MdError, bgColor: "bg-red-50", iconColor: "text-error" },
    info: { icon: MdInfo, bgColor: "bg-blue-50", iconColor: "text-info" },
  };

  const config = iconConfig[type] || iconConfig.success;
  const Icon = config.icon;

  const handlePrimaryClick = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-[scaleIn_0.2s_ease-out] shadow-2xl">
        <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 ${config.iconColor}`}>
          <Icon className="text-5xl" />
        </div>
        
        <h3 className="text-2xl font-bold text-k-dark-grey mb-2">{title}</h3>
        <p className="text-k-medium-grey mb-8 font-medium">{message}</p>
        
        <div className={`flex ${secondaryButtonText ? 'gap-4' : ''}`}>
          {secondaryButtonText && (
            <Button 
              onClick={onSecondaryAction || onClose}
              variant="secondary"
              className="w-full"
            >
              {secondaryButtonText}
            </Button>
          )}
          <Button 
            onClick={handlePrimaryClick}
            variant="primary"
            className="w-full"
          >
            {primaryButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
