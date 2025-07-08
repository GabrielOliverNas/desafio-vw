import { useEffect, useState } from "react";
import "./Veiculo.css";
import Navbar from "../../componentes/navbar/Navibar";
import Sidebar from "../../componentes/sidebar/Sidebar";

interface Veiculo {
  uuid: string;
  modelo: string;
  cor: string;
  ano: number;
  fotoUrl: string;
  creationDate: string;
  updateDate?: string;
}

export default function ListarVeiculos() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    async function fetchVeiculos() {
      try {
        const res = await fetch("http://localhost:1880/veiculos");
        if (!res.ok) throw new Error("Erro ao buscar veículos");

        const data = await res.json();
        const lista: Veiculo[] = Array.isArray(data)
          ? data
          : Array.isArray(data.veiculos)
          ? data.veiculos
          : [];

        setVeiculos(
          lista.map((v) => ({
            ...v,
            updateDate: v.updateDate || v.creationDate,
          }))
        );
      } catch (err) {
        console.error(err);
      }
    }

    fetchVeiculos();
  }, []);

  return (
    <div className="container">
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <div className="listar-veiculos">
        <h2>Lista de Veículos</h2>
        {veiculos.length === 0 ? (
          <p>Nenhum veículo encontrado.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Cor</th>
                <th>Ano</th>
                <th>Foto</th>
                <th>Criado em</th>
                <th>Atualizado em</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map((v) => (
                <tr key={v.uuid}>
                  <td>{v.modelo}</td>
                  <td>{v.cor}</td>
                  <td>{v.ano}</td>
                  <td>
                    <a href={v.fotoUrl} target="_blank" rel="noopener noreferrer">
                      Ver Foto
                    </a>
                  </td>
                  <td>{new Date(v.creationDate).toLocaleString()}</td>
                  <td>{new Date(v.updateDate || v.creationDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
