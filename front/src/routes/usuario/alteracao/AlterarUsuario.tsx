import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../../../componentes/sidebar/Sidebar";
import './AlterarUsuario.css';
import Navbar from "../../../componentes/navbar/Navibar";

interface User {
  uuid: string;
  name: string;
  password: string;
  isActived: string;
  isRoot: Boolean;
  roles: string[];
  creationDate: string;
  updatedDate: string;
}

export default function AlterarUsuario() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  const [oldUser, setOldUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRoot, setIsRoot] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!uuid) return;

    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:1880/usuario-id", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid }),
        });
        if (!res.ok) throw new Error("Usuário não encontrado");
        const data: User = await res.json();

        setOldUser(data);
        setName(data.name);
        setPassword("");
        setIsRoot(data.isRoot === true);
        setRoles(data.roles || []);
      } catch (err) {
        alert("Erro ao carregar usuário");
      }
    }

    fetchUser();
  }, [uuid]);

  if (!oldUser) return <div>Carregando...</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      uuid,
      name,
      password,
      isRoot,
      roles,
    };

    try {
      const res = await fetch("http://localhost:1880/usuarios", {
        method: "",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Falha na atualização");

      alert("Usuário atualizado com sucesso!");
      navigate("/usuarios");
    } catch {
      alert("Erro ao atualizar usuário");
    }
  };

  return (
    <div className="container">
      <Navbar></Navbar>
      <Sidebar />
      <div className="editar-container">
        <div className="card old-user">
          <h3>Dados Antigos</h3>
          <p><strong>Nome:</strong> {oldUser.name}</p>
          <p><strong>Senha:</strong> {oldUser.password}</p>
          <p><strong>Administrador:</strong> {oldUser.isRoot.toString()}</p>
          <p><strong>Roles:</strong> {oldUser.roles.join(", ")}</p>
          <p><strong>Criado em:</strong> {new Date(oldUser.creationDate).toLocaleString()}</p>
          <p><strong>Atualizado em:</strong> {new Date(oldUser.updatedDate).toLocaleString()}</p>
        </div>

        <div className="card new-user">
          <h3>Atualizar Usuário</h3>
          <form onSubmit={handleSubmit}>
            <label>
              Nome:
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </label>

            <label>
              Senha:
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Deixe em branco para não alterar"
              />
            </label>

            <label>
              Administrador:
              <input
                type="checkbox"
                checked={isRoot}
                onChange={e => setIsRoot(e.target.checked)}
              />
            </label>

            <label>
              Permissões:
              <select
                multiple
                value={roles}
                onChange={e => {
                  const selected = Array.from(e.target.selectedOptions).map(o => o.value);
                  setRoles(selected);
                }}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </label>

            <button type="submit">Atualizar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
