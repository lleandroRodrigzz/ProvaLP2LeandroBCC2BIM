import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateUser } from '../features/userSlice';
import { Form, Button, Alert } from 'react-bootstrap';

export default function LoginUsuario({ onLoginSuccess, onCadastro }){
  const dispatch = useDispatch();
  const authenticatedUser = useSelector((state) => state.users.authenticatedUser); // Usuário autenticado
  const [nickname, setNickname] = useState(''); // Estado do nickname
  const [senha, setSenha] = useState(''); // Estado da senha
  const [error, setError] = useState(''); // Mensagem de erro

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Tentar autenticar o usuário
      await dispatch(authenticateUser({ nickname, senha })).unwrap();
      setError('');
      onLoginSuccess(); // Sucesso no login, redireciona para o chat
    } catch (err) {
      setError('Credenciais inválidas.');
    }
  };

  return (
    <div className="container mt-4" style={{ textAlign: 'center', backgroundColor: '#333', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: 'white' }}>Login</h2>
      <Form onSubmit={handleLogin} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'white' }}>Nickname</Form.Label>
          <Form.Control
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Digite seu nickname"
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'yellow' }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'white' }}>Senha</Form.Label>
          <Form.Control
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite sua senha"
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'yellow' }}
          />
        </Form.Group>
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="warning" type="submit" style={{ width: '100%' }}>
          Entrar
        </Button>
        <Button variant="link" onClick={onCadastro} className="mt-2" style={{ color: 'white' }}>
          Não tem conta? Cadastre-se
        </Button>
      </Form>
    </div>
  );
};
