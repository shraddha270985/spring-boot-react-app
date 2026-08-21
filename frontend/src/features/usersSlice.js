import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "/api/users";

// 1. Helper to extract token and configuration efficiently
const getAuthConfig = (thunkAPI) => {
  const token = thunkAPI.getState().auth?.token;
  return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
};

// 2. Helper to handle catch blocks uniformly across thunks
const handleThunkError = (error, thunkAPI) => {
  const message =
    error.response?.data?.message || error.message || "An error occurred";
  return thunkAPI.rejectWithValue(message);
};

// --- Async Thunks ---

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_BASE_URL, getAuthConfig(thunkAPI));
      return response.data.sort((a, b) => a.id - b.id);
    } catch (error) {
      return handleThunkError(error, thunkAPI);
    }
  },
);

export const addUser = createAsyncThunk(
  "users/addUser",
  async (user, thunkAPI) => {
    try {
      const response = await axios.post(
        API_BASE_URL,
        user,
        getAuthConfig(thunkAPI),
      );
      return response.data;
    } catch (error) {
      return handleThunkError(error, thunkAPI);
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, user }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${id}`,
        user,
        getAuthConfig(thunkAPI),
      );
      return response.data;
    } catch (error) {
      return handleThunkError(error, thunkAPI);
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, getAuthConfig(thunkAPI));
      return id;
    } catch (error) {
      return handleThunkError(error, thunkAPI);
    }
  },
);

// --- Slice ---

const usersSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
    editingUser: null,
  },
  reducers: {
    setEditingUser: (state, action) => {
      state.editingUser = action.payload;
    },
    updateEditingUser: (state, action) => {
      if (state.editingUser) {
        state.editingUser = { ...state.editingUser, ...action.payload };
      }
    },
    clearEditingUser: (state) => {
      state.editingUser = null;
    },
    clearUsers: (state) => {
      state.users = [];
      state.loading = false;
      state.error = null;
      state.editingUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Success Handlers
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.users.sort((a, b) => a.id - b.id); // Maintains sort order on creation
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.editingUser = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload);
      })

      // 3. Centralized Loading and Error matchers
      .addMatcher(
        isPending(fetchUsers, addUser, updateUser, deleteUser),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        isRejected(fetchUsers, addUser, updateUser, deleteUser),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error.message;
        },
      );
  },
});

export const {
  setEditingUser,
  updateEditingUser,
  clearEditingUser,
  clearUsers,
} = usersSlice.actions;

export default usersSlice.reducer;
