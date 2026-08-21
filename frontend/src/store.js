import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./features/usersSlice";
import authReducer from "./features/authSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    auth: authReducer,
  },
});
