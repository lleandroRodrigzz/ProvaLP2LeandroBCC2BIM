import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages } from '../services/api';

export const fetchMessages = createAsyncThunk('messages/fetch', async () => {
  const response = await getMessages();
  return response.data.listaMensagens;
});

const messageSlice = createSlice({
  name: 'messages',
  initialState: { list: [], status: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.list = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchMessages.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export default messageSlice.reducer;
