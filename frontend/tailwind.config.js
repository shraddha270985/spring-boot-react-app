module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d6efd",
        success: "#198754",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#0dcaf0",
      },
    },
  },
  plugins: [],
  // Avoid conflicts with Bootstrap by using important selector
  corePlugins: {
    preflight: true,
  },
  important: true,
};
