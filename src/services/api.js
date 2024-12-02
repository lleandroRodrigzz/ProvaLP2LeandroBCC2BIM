import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-bcc-2-b.vercel.app',
});

// Endpoints para usuários
export const getUsers = () => api.get('/usuario');
export const addUser = (data) => api.post('/usuario', data);
export const updateUser = (data) => api.put('/usuario', data);
export const deleteUser = (data) => api.delete('/usuario', { data });
export const verifyPassword = (data) => api.post('/usuario/verificarSenha', data);

// Endpoints para mensagens
export const getMessages = () => api.get('/mensagem');
export const addMessage = (data) => api.post('/mensagem', data); 
export const updateMessage = (data) => api.patch('/mensagem', data);
export const deleteMessage = (data) => api.delete('/mensagem', { data });
