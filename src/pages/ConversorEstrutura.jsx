// src/pages/ConversorEstrutura.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { calcularFerroPrincipal, calcularEstribos } from '../utils/calculos';
import axios from 'axios';

import '../styles/Conversor.css';

function ConversorEstrutura() {
  const navigate = useNavigate();

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [estrutura, setEstrutura] = useState('');
  const [modelo, setModelo] = useState('');
  const [bitola, setBitola] = useState('');
  const [bitolaEstribo, setBitolaEstribo] = useState('');
  const [bitolas, setBitolas] = useState([]);
  const [bitolasEstribo, setBitolasEstribo] = useState([]);
  const [quantidade, setQuantidade] = useState('');
  const [medidas, setMedidas] = useState(['']);
  const [estribar, setEstribar] = useState('');
  const [formaEstribo, setFormaEstribo] = useState('');
  const [medidasEstribo, setMedidasEstribo] = useState(['']);
  const [estribarMetros, setEstribarMetros] = useState('');
  const [pesoTotal, setPesoTotal] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/bitolas')
      .then(res => setBitolas(res.data))
      .catch(err => console.error('Erro ao buscar bitolas:', err));

    axios.get('http://localhost:3001/bitolas_estribo')
      .then(res => setBitolasEstribo(res.data))
      .catch(err => console.error('Erro ao buscar estribos:', err));

      const nome = localStorage.getItem('usuario');
      if (nome) setNomeUsuario(nome);
  }, []);

  const handleMedidaChange = (index, value) => {
    const novas = [...medidas];
    novas[index] = value;
    setMedidas(novas);
  };

  const handleMedidasEstriboChange = (index, value) => {
    const novas = [...medidasEstribo];
    novas[index] = value;
    setMedidasEstribo(novas);
  };

  const renderCamposMedidas = () => {
    const campos = modelo === 'U' ? 3 : modelo === 'L' ? 2 : modelo === 'reto' ? 1 : 0;
    return Array.from({ length: campos }, (_, i) => (
      <input
        key={i}
        type="text"
        placeholder={`Medida ${i + 1} (m)`}
        value={medidas[i] || ''}
        onChange={(e) => handleMedidaChange(i, e.target.value)}
      />
    ));
  };

  const renderMedidasEstribo = () => {
    const campos = formaEstribo === 'quadrado' ? 2 : formaEstribo === 'circular' ? 1 : 0;
    return Array.from({ length: campos }, (_, i) => (
      <input
        key={i}
        type="text"
        placeholder={formaEstribo === 'circular' ? 'Raio (m)' : `Medida ${i + 1} (m)`}
        value={medidasEstribo[i] || ''}
        onChange={(e) => handleMedidasEstriboChange(i, e.target.value)}
      />
    ));
  };

  const handleCalcular = async () => {
    if (!bitola || !bitolaEstribo) {
      alert('Selecione as bitolas da estrutura e do estribo antes de calcular');
      return;
    }
    
    try {
      const resFerro = await axios.get(`http://localhost:3001/bitolas/${bitola}`);
      const massaFerro = parseFloat(resFerro.data.massa);
      console.log('resFerro.data:', resFerro.data);

      const resEstribo = await axios.get(`http://localhost:3001/bitolas_estribo/${bitolaEstribo}`);
      const massaEstribo = parseFloat(resEstribo.data.massa);
      console.log('resEstribo.data:', resEstribo.data);

      const pesoFerro = calcularFerroPrincipal({
        estrutura,
        modelo,
        medidas,
        quantidade,
        massaNominal: massaFerro
      });

      const pesoEstribo = calcularEstribos({
        estrutura,
        forma: formaEstribo,
        medida1: medidasEstribo[0],
        medida2: medidasEstribo[1],
        raio: medidasEstribo[0],
        bitola: bitolaEstribo,
        massaNominal: massaEstribo,
        espacamento: estribar,
        metros: estribarMetros,
        quantidade
      });

      //condição para se o valor da bitola o aço for igual a do estribo, somar os dois
      //se diferente, apresentar os pesos separados

      const pesoTotal = pesoFerro + pesoEstribo;
      setPesoTotal(pesoTotal.toFixed(2));

      const usuarioId = localStorage.getItem('id_usuario');
      const id_modelo = modelo === 'U' ? 1 : modelo === 'L' ? 2 : 3;

      await axios.post('http://localhost:3001/conversoes', {
        id_usuario: usuarioId,
        id_bitola: bitola,
        id_bitola_estribo: bitolaEstribo,
        id_modelo,
        quantidade,
        medida1: medidas[0] || 0,
        medida2: medidas[1] || 0,
        medida3: medidas[2] || 0,
        tipo_estrutura: estrutura,
        estribar_cm: estribarMetros,
        tipo_estribo: formaEstribo,
        medida_estribo1:medidasEstribo[0] || 0,
        medida_estribo2: medidasEstribo[1] || 0,
        peso_final: pesoTotal
      });

    } catch (error) {
      console.error('Erro ao calcular:', error);
      alert('Erro ao calcular. Verifique os dados.');
    }
  };

  const limpaCampos = () => {
    setEstrutura('');
    setModelo('');
    setBitola('');
    setBitolaEstribo('');
    setQuantidade('');
    setMedidas(['']);
    setEstribar('');
    setFormaEstribo('');
    setMedidasEstribo(['']);
    setEstribarMetros('');
    setBitolaEstribo('');
    setPesoTotal(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('id_usuario');
    navigate('/');
  };

  return (
  <>
  <nav>
      <h2>Bem vindo, {nomeUsuario}!</h2>
        {localStorage.getItem('tipo') === 'admin' && (
          <div>
            <button
              className='botao'
              onClick={() => navigate('/admin')}>
              Página do Administrador
            </button>
          </div>
        )}

        <div>
          <button
            className='botao'
            onClick={() => navigate('/relatorio')}>
            Relatório de Conversões
          </button>
        </div>

        <div>
          <button
            className='botao'
            onClick={handleLogout}>Sair</button>
        </div>
  </nav>
  
    <div className='container'>
      <h3>Escolha sua Estrutura</h3>

      <label className="titulo">
        Estrutura:
        <select value={estrutura} onChange={(e) => setEstrutura(e.target.value)}>
          <option value="">Selecione</option>
          <option value="viga">Viga</option>
          <option value="pilar">Pilar</option>
          <option value="estaca">Estaca</option>
          <option value="estribo">Estribo</option>
          <option value="diversa">Peça diversa</option>
        </select>
      </label>

      <div>
        <label className="titulo">Modelo:</label><br />
        <label><input type="radio" name="modelo" value="U" onChange={(e) => setModelo(e.target.value)} /> U</label>
        <label><input type="radio" name="modelo" value="L" onChange={(e) => setModelo(e.target.value)} /> L</label>
        <label><input type="radio" name="modelo" value="reto" onChange={(e) => setModelo(e.target.value)} /> Reto</label>
      </div>

      <div>
        <label className="titulo">Bitola:</label>
        <select value={bitola} onChange={(e) => setBitola(e.target.value)}>
          <option value="">Selecione</option>
          {bitolas.map((b) => (
            <option key={b.id} value={b.id}>{b.medida_mm} mm</option>
          ))}
        </select>
      </div>

      <div>
        <label className="titulo">Quantidade de Ferros:</label><br />
        <input
          type="number"
          placeholder="Unidades"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
        />
      </div>

      <div>
        <label className="titulo">Medidas:</label><br />
        {renderCamposMedidas()}
      </div>

      <div>
        <label className="titulo">Estribar apenas (m):</label><br />
        <input
          type="number"
          placeholder="Ex: 2.5"
          value={estribarMetros}
          onChange={(e) => setEstribarMetros(e.target.value)}
        />
      </div>

      <div>
        <label className="titulo">Estribar a cada (cm):</label><br />
        <input
          type="number"
          placeholder="Ex: 20"
          value={estribar}
          onChange={(e) => setEstribar(e.target.value)}
        />
      </div>

      <div>
        <label className="titulo">Estribo:</label><br />
        <label><input type="radio" name="forma" value="quadrado" onChange={(e) => setFormaEstribo(e.target.value)} /> Quadrado</label>
        <label><input type="radio" name="forma" value="circular" onChange={(e) => setFormaEstribo(e.target.value)} /> Circular</label>
      </div>

      <div>
        <label className="titulo">Bitola do Estribo:</label>
        <select value={bitolaEstribo} onChange={(e) => setBitolaEstribo(e.target.value)}>
          <option value="">Selecione</option>
          {bitolasEstribo.map((b) => (
            <option key={b.id} value={b.id}>{b.medida_mm} mm</option>
          ))}
        </select>
      </div>

      <div>
        <label className="titulo">Medidas Estribo:</label><br />
        {renderMedidasEstribo()}
      </div>

      <br />
      <button onClick={handleCalcular}>Calcular</button><br />
      <button onClick={limpaCampos}>Limpar</button>
      {pesoTotal !== null && (
        <div className='resultado'>
          Peso Total da Conversão: {pesoTotal} Kg
        </div>
      )}
    </div>
  </>
  );
}

export default ConversorEstrutura;