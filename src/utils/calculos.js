// utils/calculos.js
export function calcularFerroPrincipal({ estrutura, modelo, medidas, quantidade, massaNominal }) {
  const qtd = parseFloat(quantidade || 0);
  const mNominal = parseFloat(massaNominal || 0);
  const m1 = parseFloat(medidas[0] || 0);
  const m2 = parseFloat(medidas[1] || 0);
  const m3 = parseFloat(medidas[2] || 0);

  switch (estrutura) {
    case 'viga':
      if (modelo === 'reto') return m1 * qtd * mNominal;
      if (modelo === 'U') return (m1 + m2 + m3) * qtd * mNominal;
      if (modelo === 'L') return (m1 + m2) * qtd * mNominal;
      break;

    case 'estaca':
    case 'pilar':
      if (modelo === 'reto') return m1 * qtd * mNominal;
      if (modelo === 'L') return (m1 + m2) * qtd * mNominal;
      break;

      default:
        return 0;
  }
}

export function calcularEstribos({ estrutura, forma, medida1, medida2, raio, bitola, massaNominal, espacamento, metros, quantidade }) {
  const bitolaM = parseFloat(bitola || 0);
  const mNominal = parseFloat(massaNominal || 0);
  const espac = parseFloat(espacamento || 1); // em cm
  const metrosEstribar = parseFloat(metros || 0);
  const qtd = parseFloat(quantidade || 0);
  const m1 = parseFloat(medida1 || 0);
  const m2 = parseFloat(medida2 || 0);
  const r = parseFloat(raio || 0);

  if (!forma || espac <= 0 || mNominal <= 0) return 0;

  let fator = 0;

  if (estrutura === 'viga') {
    fator = qtd / espac;
  } else if (estrutura === 'estaca' || estrutura === 'pilar') {
    fator = metrosEstribar / espac;
  }

  if (forma === 'quadrado') {
    return fator * (((2 * m1) + (2 * m2) + (2 * bitolaM)) * mNominal);
  }

  if (forma === 'circular') {
    return fator * (((2 * 3.14) * r) * mNominal);
  }

  return 0;
}
