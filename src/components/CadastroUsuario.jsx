import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, createUser } from '../features/userSlice';
import { Form, Button, Alert } from 'react-bootstrap';

export default function CadastroUsuario({ onCadastroSuccess }) {
  const dispatch = useDispatch();
  const { list, status } = useSelector((state) => state.users); // Lista de usuários
  const [nickname, setNickname] = useState(''); // Estado do nickname
  const [urlAvatar, setUrlAvatar] = useState(''); // Estado da URL do avatar
  const [senha, setSenha] = useState(''); // Estado da senha
  const [error, setError] = useState(''); // Mensagem de erro
  const [success, setSuccess] = useState(''); // Mensagem de sucesso

  useEffect(() => {
    dispatch(fetchUsers()); // Buscar usuários ao carregar o componente
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname || !urlAvatar || !senha) {
      setError('Preencha todos os campos!');
      return;
    }
    // Criar um novo usuário
    dispatch(createUser({ nickname, urlAvatar, senha }))
      .unwrap()
      .then(() => {
        setSuccess('Usuário cadastrado com sucesso!');
        setNickname('');
        setUrlAvatar('');
        setSenha('');
        setError('');
        dispatch(fetchUsers()); // Atualizar lista de usuários
      })
      .catch(() => setError('Erro ao cadastrar usuário.'));
  };

  return (
    <div className="container mt-4" style={{ textAlign: 'center', backgroundColor: '#333', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: 'white' }}>Cadastro de Usuários</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'white' }}>Nickname</Form.Label>
          <Form.Control
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Digite o nickname"
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'yellow' }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'white' }}>URL do Avatar</Form.Label>
          <Form.Control
            type="text"
            value={urlAvatar}
            onChange={(e) => setUrlAvatar(e.target.value)}
            placeholder="URL da imagem do avatar"
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'yellow' }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'white' }}>Senha</Form.Label>
          <Form.Control
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Digite a senha"
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'yellow' }}
          />
        </Form.Group>
        <Button variant="warning" type="submit" style={{ width: '100%' }}>
          Cadastrar
        </Button>
      </Form>

      {/* Botão de Voltar ao Login */}
      <Button
        variant="link"
        onClick={onCadastroSuccess} // Chama a função que retorna à tela de login
        style={{ marginTop: '20px', color: 'white' }}
      >
        Já tem uma conta? Volte para o Login
      </Button>
    </div>
  );
}
