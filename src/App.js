import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './app/store';
import LoginUsuario from './components/LoginUsuario';
import CadastroUsuario from './components/CadastroUsuario';
import Mensagens from './components/Mensagens';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login'); // Estado para controlar a tela atual

  const handleLoginSuccess = () => {
    setCurrentScreen('chat'); // Se o login for bem-sucedido, vai para a tela de chat
  };

  const handleCadastro = () => {
    setCurrentScreen('cadastro'); // Vai para a tela de cadastro
  };

  const handleCadastroSuccess = () => {
    setCurrentScreen('login'); // Após cadastro, retorna para a tela de login
  };

  return (
    <Provider store={store}>
      <div className="container">
        {currentScreen === 'login' && (
          <LoginUsuario
            onLoginSuccess={handleLoginSuccess} // Quando o login for bem-sucedido
            onCadastro={handleCadastro} // Quando o usuário deseja se cadastrar
          />
        )}
        {currentScreen === 'cadastro' && (
          <CadastroUsuario onCadastroSuccess={handleCadastroSuccess} /> // Quando o cadastro for bem-sucedido
        )}
        {currentScreen === 'chat' && <Mensagens />} 
      </div>
    </Provider>
  );
}

export default App;
