import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../componentes/sidebar/Sidebar";
import Navbar from "../../componentes/navbar/Navibar";
import "./Usuario.css";
import { useAuth } from "../../hooks/useAuth";

interface User {
  uuid: string;
  name: string;
  password: string;
  isActived: boolean;
  isRoot: boolean;
  creationDate: string;
  updateDate?: string;
}

export default function Usuario() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [usuarios, setUsuarios] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsuarios() {

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:1880/listar-usuarios", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await res.json();
        setUsuarios(Array.isArray(data) ? data : [data]);
      } catch (err) {
        console.error(err);
      }
    }

    fetchUsuarios();
  }, [navigate]);

  function handleEditar(uuid: string) {
    navigate(`/usuario/editar/${uuid}`);
  }

  async function handleExcluir(uuid: string) {
    if (!window.confirm("Confirma exclusão desse usuário?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:1880/deletar-usuario-id", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid }),
      });

      if (!res.ok) {
        throw new Error("Falha ao deletar usuário.");
      }

      setUsuarios((prev) => prev.filter((u) => u.uuid !== uuid));
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
        <h2>Lista de Usuários</h2> {usuarios.length === 0 ? (
          <p>Nenhum usuário encontrado.</p>) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Senha</th>
                <th>Ativo</th>
                <th>Administrador</th>
                <th>Criado em</th>
                <th>Atualizado em</th>
                {isAdmin && (
                  <th>Ações</th>
                )}
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.uuid}>
                  <td>{user.name}</td>
                  <td>{user.password}</td>
                  <td>{user.isActived}</td>
                  <td>{user.isRoot}</td>
                  <td>{new Date(user.creationDate).toLocaleString()}</td>
                  <td>{new Date(user.updateDate || user.creationDate).toLocaleString()}</td>
                  {isAdmin && (
                    <td>
                      <button onClick={() => handleEditar(user.uuid)} className="btn-editar">
                        🖉
                      </button>
                      <button onClick={() => handleExcluir(user.uuid)} className="btn-excluir">
                        🗑️
                      </button>
                    </td>
                  )}
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
