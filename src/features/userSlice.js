import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUsers, addUser, verifyPassword } from '../services/api';

// Thunk para buscar usuários
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await getUsers();
  return response.data.listaUsuarios;
});

// Thunk para criar usuários
export const createUser = createAsyncThunk('users/createUser', async (user) => {
  const response = await addUser(user);
  return response.data;
});

// Thunk para autenticar usuários
export const authenticateUser = createAsyncThunk(
  'users/authenticateUser',
  async ({ nickname, senha }) => {
    const response = await verifyPassword({ nickname, senha });
    if (response.data.status && response.data.senhaCorreta) {
      const usersResponse = await getUsers();
      const user = usersResponse.data.listaUsuarios.find((u) => u.nickname === nickname);
      return user; // Retorna o usuário completo com ID
    }
    throw new Error('Credenciais inválidas');
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [],
    authenticatedUser: null,
    status: null,
  },
  reducers: {
    logout: (state) => {
      state.authenticatedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(authenticateUser.fulfilled, (state, action) => {
        state.authenticatedUser = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
