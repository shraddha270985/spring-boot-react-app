import React, { memo } from "react";

/**
 * Tailwind-styled Card Component
 * Alternative to Bootstrap Card - more customizable
 */
export const TailwindCard = memo(({ title, children, className = "" }) => (
  <div
    className={`bg-white rounded-lg shadow-md p-6 border border-gray-200 ${className}`}
  >
    {title && <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>}
    {children}
  </div>
));

/**
 * Tailwind-styled Button Component
 * Variants: primary, secondary, danger, success
 */
export const TailwindButton = memo(
  ({ variant = "primary", children, className = "", ...props }) => {
    const baseStyles =
      "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-400",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      success:
        "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
      outline:
        "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
    };

    return (
      <button
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

/**
 * Tailwind-styled Input Component
 * With error state support
 */
export const TailwindInput = memo(
  ({ label, error, className = "", ...props }) => (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 text-red-900 focus:ring-red-500 bg-red-50"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        }`}
        {...props}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  ),
);

/**
 * Tailwind-styled Badge Component
 * Status indicators
 */
export const TailwindBadge = memo(({ status = "ACTIVE", className = "" }) => {
  const statusStyles = {
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-red-100 text-red-800",
    PENDING: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]} ${className}`}
    >
      {status}
    </span>
  );
});

/**
 * Tailwind-styled Alert Component
 */
export const TailwindAlert = memo(
  ({ variant = "info", children, className = "" }) => {
    const variants = {
      success: "bg-green-50 border border-green-200 text-green-800",
      error: "bg-red-50 border border-red-200 text-red-800",
      warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
      info: "bg-blue-50 border border-blue-200 text-blue-800",
    };

    return (
      <div className={`p-4 rounded-lg ${variants[variant]} ${className}`}>
        {children}
      </div>
    );
  },
);

/**
 * Tailwind-styled Loading Spinner
 */
export const TailwindSpinner = memo(({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizes[size]} border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin ${className}`}
      ></div>
    </div>
  );
});

TailwindCard.displayName = "TailwindCard";
TailwindButton.displayName = "TailwindButton";
TailwindInput.displayName = "TailwindInput";
TailwindBadge.displayName = "TailwindBadge";
TailwindAlert.displayName = "TailwindAlert";
TailwindSpinner.displayName = "TailwindSpinner";
