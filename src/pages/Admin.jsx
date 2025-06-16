import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import '../styles/Admin.css';

function Admin() {
    const [usuarios, setUsuarios] = useState([]);
    const [novoUsuario, setNovoUsuario] = useState('');
    const [senha, setSenha] = useState('');
    const [tipo, setTipo] = useState('comum');
    const navigate = useNavigate();

    

    useEffect(() => {
        const tipo = localStorage.getItem('tipo');
        if (tipo !== 'admin') {
            navigate('/login');
        } else {
            carregarUsuarios();
        }
    }, [navigate]);

    const carregarUsuarios = async () => {
        try {
            const res = await axios.get('http://localhost:3001/usuarios');
            setUsuarios(res.data);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
        }
    };

    const cadastrarUsuario = async () => {
        try {
            await axios.post('http://localhost:3001/usuarios', {
                usuario: novoUsuario,
                senha,
                tipo,
            });
            alert('Usuário cadastrado com sucesso!');
            setNovoUsuario('');
            setSenha('');
            setTipo('comum');
            carregarUsuarios();
        } catch (err) {
            console.error('Erro ao cadastrar usuários', err);
            alert('Erro ao cadstrar. Verifique os dados.');
        }
    };

    return (
    <>
    <div>
        <button className="botao_voltar" onClick={() => navigate(-1)}>Voltar</button>
    </div>

    <div className="usuario_container">
        <div className="lista_usuarios">
            <h2>Usuários Cadastrados</h2>

            {usuarios.length === 0 ? (
                <p>Nenhum usuario encontrado</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Usuário</th>
                            <th>Tipo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.usuario}</td>
                                <td>{u.tipo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

            <div className="cadastro_usuarios">
                <h3>Cadastro de Novo Usuário</h3>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={novoUsuario}
                    onChange={(e) => setNovoUsuario(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="comum">Usuário</option>
                    <option value="admin">Administrador</option>
                </select>
                <button onClick={cadastrarUsuario}>Cadastrar</button>
            </div>
    </div>
    </>
    );
}

export default Admin;