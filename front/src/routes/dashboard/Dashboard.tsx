import React from 'react';
import Sidebar from '../../componentes/sidebar/Sidebar';
import Navbar from '../../componentes/navbar/Navibar';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <div className='center-wrapper'>
        <main className="dashboard">
        <h2>Dashboard</h2>
        <p>Bem-vindo!</p>
      </main>
      </div>
    </div>
  );
};

export default Dashboard;
