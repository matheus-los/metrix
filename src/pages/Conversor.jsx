import React, { useState } from 'react';

function Conversor() {
  const [tipoAco, setTipoAco] = useState('');
  const [metro, setMetro] = useState('');
  const [peso, setPeso] = useState(null);

  const acoTipos = {
    'Chapa fina': 7.85,
    'Barra redonda': 6.5,
    'Perfil I': 9.0,
    'Tubo retangular': 5.4
  };

  const calcularPeso = () => {
    if (!tipoAco || !metro || isNaN(metro)) {
      alert('Preencha todos os campos corretamente!');
      return;
    }

    const densidade = acoTipos[tipoAco];
    const resultado = parseFloat(metro) * densidade;
    setPeso(resultado.toFixed(2));
  };

  return (
    <div>
      <h2>Conversor de Aço</h2>

      <select value={tipoAco} onChange={(e) => setTipoAco(e.target.value)}>
        <option value="">Selecione o tipo de aço</option>
        {Object.keys(acoTipos).map((tipo) => (
          <option key={tipo} value={tipo}>{tipo}</option>
        ))}
      </select>

      <br />
      <input
        type="number"
        placeholder="Medida em metros"
        value={metro}
        onChange={(e) => setMetro(e.target.value)}
      />

      <br />
      <button onClick={calcularPeso}>Calcular</button>

      {peso && (
        <p>Peso estimado: <strong>{peso} kg</strong></p>
      )}
    </div>
  );
}

export default Conversor;