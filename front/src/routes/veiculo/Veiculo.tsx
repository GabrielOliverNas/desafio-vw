import { useEffect, useState } from "react";
import "./Veiculo.css";
import Navbar from "../../componentes/navbar/Navibar";
import Sidebar from "../../componentes/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";

interface Veiculo {
  uuid: string;
  model: { uuid: string; modelName: string };
  color: { uuid: string; colorName: string };
  year: number;
  imagePath: string[];
  creationUserName: string;
  creationDate: string;
  updateDate?: string;
}

export default function ListarVeiculos() {
  const navigate = useNavigate();
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

  useEffect(() => {
    async function fetchVeiculos() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        const res = await fetch("http://localhost:1880/listar-veiculos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Erro ao buscar veículos");

        const data = await res.json();

        setVeiculos(data.data || data || []);
      } catch (err) {
        console.error(err);
      }
    }

    fetchVeiculos();
  }, [navigate]);

  function handleEditar(uuid: string) {
    navigate(`/veiculo/editar/${uuid}`);
  }

  async function handleExcluir(uuid: string) {
    if (!window.confirm("Confirma exclusão desse veículo?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:1880/remover-veiculo-id", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({uuid})
      });

      if (!res.ok) {
        throw new Error("Falha ao deletar veículo.");
      }

      setVeiculos((prev) => prev.filter((v) => v.uuid !== uuid));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      
      <div className="center-wrapper">
        <div className="listar">
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
                  <th>Criado por</th>
                  <th>Criado em</th>
                  <th>Atualizado em</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.map((v) => (
                  <tr key={v.uuid}>
                    <td>{v.model?.modelName || "-"}</td>
                    <td>{v.color?.colorName || "-"}</td>
                    <td>{v.year}</td>
                    <td>
                      {v.imagePath && v.imagePath.length > 0 && v.imagePath[0] ? (
                        <a href={v.imagePath[0]} target="_blank" rel="noopener noreferrer">
                          Ver Foto
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{v.creationUserName || "-"}</td>
                    <td>{new Date(v.creationDate).toLocaleString()}</td>
                    <td>{new Date(v.updateDate || v.creationDate).toLocaleString()}</td>
                    <td>
                      <button onClick={() => handleEditar(v.uuid)} className="btn-editar">
                        🖉
                      </button>
                      <button onClick={() => handleExcluir(v.uuid)} className="btn-excluir">
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
