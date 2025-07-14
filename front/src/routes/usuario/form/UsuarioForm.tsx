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
    isActived: "",
    isRoot: "",
    creationDate: "",
    updateDate: "",
  });

  useEffect(() => {
  if (uuid) {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:1880/usuario-id", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uuid }),
    })
      .then((res) => res.json())
      .then((data) => {
        const usuario = data.usuario;
        setVisualUser(usuario);
      })
      .catch((err) => console.error("Erro ao buscar usuário:", err));
    }
  }, [navigate, uuid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!visualUser) {
      console.error("Usuário não carregado para edição.");
      return;
    }

    try {
      const payload = {
        ...formUser,
        uuid: visualUser.uuid
      };

      const res = await fetch("http://localhost:1880/alterar-usuario", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

      <div style={{ display: "flex", gap: "2rem", width: "100%", justifyContent: "center", padding: "2rem" }}>
        <div className="usuario">
          <h3>Visualização</h3>
          {visualUser ? (
            <>
              <p><strong>Nome:</strong> {visualUser.name}</p>
              <p><strong>Senha:</strong> {visualUser.password}</p>
              <p><strong>Ativo:</strong> {visualUser.isActived}</p>
              <p><strong>Administrador:</strong> {visualUser.isRoot}</p>
              <p><strong>Criado em:</strong> {new Date(visualUser.creationDate).toLocaleString()}</p>
              <p><strong>Atualizado em:</strong> {new Date(visualUser.updateDate).toLocaleString()}</p>
            </>
          ) : (
            <p>Carregando dados...</p>
          )}
        </div>

        <div className="usuario">
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
                placeholder="Digite o nome"
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
                placeholder="Digite a senha"
              />
            </label>

            <fieldset className="permissoes-group">
              <legend>Permissões:</legend>
                <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formUser.isActived === "true"}
                  onChange={(e) =>
                    setFormUser((prev) => ({
                      ...prev,
                      isActived: e.target.checked ? "true" : "false",
                    }))
                  }
                />
                Ativo
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formUser.isRoot === "true"}
                  onChange={(e) =>
                    setFormUser((prev) => ({
                      ...prev,
                      isRoot: e.target.checked ? "true" : "false",
                    }))
                  }
                />
                Administrador
              </label>
            </fieldset>

            <button type="submit">
              {isEditing ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
