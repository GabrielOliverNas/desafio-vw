import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../componentes/sidebar/Sidebar";
import Navbar from "../../../componentes/navbar/Navibar";
import "../Usuario.css";

interface User {
  uuid: string;
  name: string;
  password: string;
  isActived: string;
  isRoot: string;
  roles: string[];
  creationDate: string;
  updateDate: string;
}

export default function UsuarioForm() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const isEditing = !!uuid;

  const [visualUser, setVisualUser] = useState<User | null>(null);
  const [formUser, setFormUser] = useState<User>({
    uuid: "",
    name: "",
    password: "",
    isActived: "false",
    isRoot: "false",
    roles: [],
    creationDate: "",
    updateDate: "",
  });

  useEffect(() => {
    if (uuid) {

      const token = localStorage.getItem('token');

      if (!token) {
        navigate("/login");
        return;
      }

      fetch("http://localhost:1880/usuarios-id", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, },
        body: JSON.stringify({ uuid }),
      })
        .then((res) => res.json())
        .then((data) => setVisualUser(data))
        .catch((err) => console.error("Erro ao buscar visualização:", err));
    }
  }, [navigate, uuid]);

  useEffect(() => {
    if (isEditing) {
      fetch(`http://localhost:1880/usuarios/${uuid}`)
        .then((res) => res.json())
        .then((data) => setFormUser(data))
        .catch((err) => console.error("Erro ao buscar edição:", err));
    }
  }, [uuid, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:1880/usuarios/${uuid}`
      : "http://localhost:1880/usuarios";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formUser),
      });

      if (!res.ok) throw new Error("Erro ao salvar");
      navigate("/usuario");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <Sidebar />

      <div style={{ display: "flex", gap: "2rem", marginTop: "1%", width: "100%", padding: "0 2rem", boxSizing: "border-box" }}>
        {/* 🟦 Card de visualização */}
        <div className="usuario" style={{ flex: 1 }}>
          <h3>Visualização</h3>
          {visualUser ? (
            <>
              <p><strong>Nome:</strong> {visualUser.name}</p>
              <p><strong>Senha:</strong> {visualUser.password}</p>
              <p><strong>Ativo:</strong> {visualUser.isActived}</p>
              <p><strong>Administrador:</strong> {visualUser.isRoot}</p>
              <p><strong>Roles:</strong> {visualUser.roles.join(", ")}</p>
              <p><strong>Criado em:</strong> {new Date(visualUser.creationDate).toLocaleString()}</p>
              <p><strong>Atualizado em:</strong> {new Date(visualUser.updateDate).toLocaleString()}</p>
            </>
          ) : (
            <p>Carregando dados...</p>
          )}
        </div>

        {/* 🟩 Card de edição */}
        <div className="usuario" style={{ flex: 1 }}>
          <form onSubmit={handleSubmit}>
            <h3>{isEditing ? "Editar Usuário" : "Cadastrar Usuário"}</h3>

            <label>
              Nome:
              <input
                type="text"
                name="name"
                value={formUser.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Senha:
              <input
                type="password"
                name="password"
                value={formUser.password}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Ativo (true/false):
              <input
                type="text"
                name="isActived"
                value={formUser.isActived}
                onChange={handleChange}
              />
            </label>

            <label>
              Administrador (true/false):
              <input
                type="text"
                name="isRoot"
                value={formUser.isRoot}
                onChange={handleChange}
              />
            </label>

            <label>
              Roles (separadas por vírgula):
              <input
                type="text"
                name="roles"
                value={formUser.roles.join(",")}
                onChange={(e) =>
                  setFormUser((prev) => ({
                    ...prev,
                    roles: e.target.value.split(","),
                  }))
                }
              />
            </label>

            <button type="submit">
              {isEditing ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
