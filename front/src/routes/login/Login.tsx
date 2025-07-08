import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('http://localhost:1880/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } else {
      alert('Usuário ou senha inválidos!');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '400px',
          width: '100%',
          padding: '2rem',
          border: '2px solid #0074D9',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Login VW</h2>

        <div style={{ marginBottom: '1rem' }}>
          <label>Usuário:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
              boxSizing: 'border-box',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Senha:</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '4px',
              boxSizing: 'border-box',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#0074D9',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;