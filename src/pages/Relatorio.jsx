// src/pages/Relatorio.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';

import '../styles/Relatorio.css';


function Relatorio() {
  const [conversoes, setConversoes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/conversoes')
      .then(res => setConversoes(res.data))
      .catch(err => console.error('Erro ao buscar conversões:', err));
  }, []);

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.text('Relatório de Conversões', 14, 10);

    autoTable(doc, {
      head: [['Estrutura', 'Bitola Estrutura', 'Bitola Estribo', 'Peso Total (kg)']],
      body: conversoes.map(item => [
        item.tipo_estrutura,
        item.bitola_estrutura || '-',
        item.bitola_estribo || '-',
        !isNaN(item.peso_final) ? Number(item.peso_final).toFixed(2) : '0.00'
      ])
    });

    doc.save('relatorio_conversoes.pdf');
  };

  return (
    <>
    <div>
      <button className="botao_voltar" onClick={() => navigate(-1)}>Voltar</button>
    </div>
    <div style={{ padding: '20px' }}>
      <h2>Relatório de Conversões</h2>
      <button className="botao_relatorio" onClick={gerarPDF}>Exportar PDF</button>
      <table border="1" cellPadding="8" style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Tipo de Estrutura</th>
            <th>Bitola Estrutura</th>
            <th>Bitola Estribo</th>
            <th>Peso Total (kg)</th>
          </tr>
        </thead>
        <tbody>
          {conversoes.map((item, index) => (
            <tr key={index}>
              <td>{item.tipo_estrutura}</td>
              <td>{item.bitola_estrutura || '-'}</td>
              <td>{item.bitola_estribo || '-'}</td>
              <td>{!isNaN(item.peso_final) ? Number(item.peso_final).toFixed(2) : '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

export default Relatorio;