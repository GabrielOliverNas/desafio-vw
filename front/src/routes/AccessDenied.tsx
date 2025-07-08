import React from 'react';
import { Link } from 'react-router-dom';

const AcessoNegado: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h2>🚫 Acesso negado</h2>
      <p>Você não está logado para acessar esta página.</p>
      <Link to="/login">Ir para Login</Link>
    </div>
  );
};

export default AcessoNegado;