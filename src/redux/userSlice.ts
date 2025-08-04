import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchUsers } from "../service/api";

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image?: string;
  isNew?: boolean;
}

interface UserState {
  users: User[];
  total: number;
  loading: boolean;
}

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async ({ limit, skip }: { limit: number; skip: number }) => {
    const data = await fetchUsers(limit, skip);
    return {
      users: data.users.map((user: any) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        image: user.image,
      })),
      total: data.total,
    };
  }
);

const initialState: UserState = {
  users: [],
  total: 0,
  loading: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const exists = state.users.find((u) => u.email === action.payload.email);
      if (!exists) {
        state.users.unshift({ ...action.payload, isNew: true });
      }
    },
    removeUser: (state, action) => {
  state.users = state.users.filter(user => user.email !== action.payload.email);
},
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        const existingUserIds = state.users.map((u) => u.id);
        const newUsers = action.payload.users.filter(
          (user: User) => !existingUserIds.includes(user.id)
        );
        state.users = [...newUsers, ...state.users];
        state.total = action.payload.total;
      })
      .addCase(getUsers.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;
