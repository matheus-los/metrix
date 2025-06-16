import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/Login.css'

function Login() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.post('http://localhost:3001/login', {
        usuario,
        senha,
      });

      const { tipo } = resposta.data;

      localStorage.setItem('tipo', tipo);
      localStorage.setItem('usuario', usuario);

      alert('Login bem-sucedido!');

      navigate('/conversor');
    } catch (error) {
      alert('Usuario ou senha incorreta');
    }
  };

  return (
    <>
    <div className="login-container">

      <div className="logo">
          <img src ="/imagens/logo.png" alt="Logo Metrix" />
          <p>METRIX</p>
      </div>

      <div className="login-box">

        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <br />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <br />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  </>
  );
}

export default Login;