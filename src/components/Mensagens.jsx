import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages } from '../features/messageSlice';
import { fetchUsers } from '../features/userSlice'; 
import { addMessage, deleteMessage } from '../services/api';
import { Form, Button, Alert, ListGroup } from 'react-bootstrap';

export default function Mensagens(){
  const { list: mensagens, status } = useSelector((state) => state.messages); // Lista de mensagens
  const { list: usuarios, status: statusUsuarios } = useSelector((state) => state.users); // Lista de usuários
  const usuarioAutenticado = useSelector((state) => state.users.authenticatedUser); // Usuário autenticado
  const dispatch = useDispatch();
  const [mensagem, setMensagem] = useState(''); // Estado da mensagem
  const [erro, setErro] = useState(''); // Mensagem de erro
  const [sucesso, setSucesso] = useState(''); // Mensagem de sucesso

  // Efeito para carregar as mensagens e os usuários quando o componente é montado
  useEffect(() => {
    console.log('Usuário autenticado:', usuarioAutenticado);
    if (usuarioAutenticado) {
      dispatch(fetchMessages()); // Carregar mensagens
      dispatch(fetchUsers()); // Carregar usuários
    }
  }, [dispatch, usuarioAutenticado]);

  // Função para enviar uma nova mensagem
  const handleEnviarMensagem = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!mensagem.trim()) {
      setErro('A mensagem não pode ser vazia.');
      return;
    }

    if (!usuarioAutenticado || !usuarioAutenticado.id) {
      setErro('Usuário autenticado inválido.');
      return;
    }

    try {
      const resposta = await addMessage({
        mensagem,
        usuario: { id: usuarioAutenticado.id },
      });

      if (resposta.data.status) {
        setSucesso('Mensagem enviada com sucesso!');
        setMensagem('');
        dispatch(fetchMessages()); // Atualizar lista de mensagens
      } else {
        setErro(resposta.data.mensagem || 'Erro ao enviar mensagem.');
      }
    } catch (err) {
      setErro('Erro ao enviar mensagem.');
    }
  };

  // Função para excluir uma mensagem
  const handleExcluirMensagem = async (mensagem) => {
    // Ajustando a hora da mensagem (adicionando 3 horas para o fuso horário do servidor)
    const horaMensagem = new Date(mensagem.dataHora);
    horaMensagem.setHours(horaMensagem.getHours() + 3);

    // Hora atual
    const horaAtual = new Date();
    const diferencaTempo = (horaAtual - horaMensagem) / 1000 / 60; // Diferença em minutos

    if (diferencaTempo > 5) {
      alert('Você só pode excluir mensagens enviadas nos últimos 5 minutos.');
      return;
    }

    try {
      const resposta = await deleteMessage({ id: mensagem.id });
      if (resposta.data.status) {
        dispatch(fetchMessages()); // Atualiza a lista de mensagens
      } else {
        setErro(resposta.data.mensagem || 'Erro ao excluir mensagem.');
      }
    } catch (err) {
      setErro('Erro ao excluir mensagem.');
    }
  };

  // Verifica se a mensagem pode ser excluída (se for do usuário autenticado)
  const podeExcluirMensagem = (mensagem) => {
    return mensagem.usuario.id === usuarioAutenticado.id;
  };

  // Se o usuário não estiver autenticado, exibe uma mensagem de erro
  if (!usuarioAutenticado) {
    return <Alert variant="danger">Você precisa estar autenticado para acessar o chat.</Alert>;
  }

  return (
    <div>
      <Alert style={{ textAlign: 'center', marginTop: '15px', fontSize: '45px' }} variant="warning">Bate-Papo</Alert>
      {status === 'loading' && <p>Carregando mensagens...</p>}
      {status === 'failed' && <p>Erro ao carregar mensagens.</p>}
      <ul>
        {mensagens.map((mensagem) => (
          <li key={mensagem.id}>
            <Alert variant="dark" style={{ borderColor: 'green', backgroundColor: 'black', color: 'white' }}>
              <p>{mensagem.mensagem}</p>
              <small>Enviado por: <span style={{ color: 'green' }}>{mensagem.usuario.nickname}</span></small>
              {podeExcluirMensagem(mensagem) && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleExcluirMensagem(mensagem)}
                  className="ms-2"
                >
                  Excluir
                </Button>
              )}
            </Alert>
          </li>
        ))}
      </ul>

      <Form onSubmit={handleEnviarMensagem}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={mensagem}
            style={{ backgroundColor: 'black', color: 'white', borderColor: 'yellow' }}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem"
          />
        </Form.Group>
        {erro && <Alert variant="danger">{erro}</Alert>}
        {sucesso && <Alert variant="success">{sucesso}</Alert>}
        <Button variant="warning" type="submit">
          Enviar
        </Button>
      </Form>

      {/* Lista de Usuários */}
      <Alert style={{ textAlign: 'center', marginTop: '10%', fontSize: '45px' }} variant="warning">Usuários Cadastrados</Alert>
      {statusUsuarios === 'loading' && <p>Carregando usuários...</p>}
      {statusUsuarios === 'failed' && <p>Erro ao carregar usuários.</p>}
      {usuarios.length > 0 ? (
        <ListGroup>
          {usuarios.map((usuario) => (
            <ListGroup.Item key={usuario.id} variant="dark">
              <img src={usuario.urlAvatar} alt="avatar" style={{ width: 40, marginRight: 10 }} />
              {usuario.nickname}
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Alert variant="info">Nenhum usuário cadastrado :(</Alert>
      )}
    </div>
  );
};
