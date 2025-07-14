import { useState } from "react";
import Sidebar from "../../../componentes/sidebar/Sidebar";
import Navbar from "../../../componentes/navbar/Navibar";
import { Toast } from "../../../componentes/utils/Toast";
import "./CadastrarUsuario.css";
import { useNavigate } from "react-router-dom";

export default function CadastrarUsuario() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminFlag, setIsAdminFlag] = useState(false);
  const [isActiveFlag, setIsActiveFlag] = useState(true);


  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: name,
      password: password,
      isActived: isActiveFlag ? "true" : "false",
      isRoot: isAdminFlag ? "ADMIN" : "USER"
    };

    try {

      const token = localStorage.getItem('token')

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:1880/inserir-usuario", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setToastMessage("Usuário cadastrado com sucesso!");
        setToastType("success");
        setShowToast(true);

        setName("");
        setPassword("");
        setIsAdminFlag(false);
        setIsActiveFlag(true);
      } else {
        setToastMessage(data.error || "Falha ao cadastrar usuário");
        setToastType("error");
        setShowToast(true);
      }
    }
    catch (err) {
      setToastMessage("Erro de conexão ou servidor indisponível");
      setToastType("error");
      setShowToast(true);
    }

    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <div className="center-wrapper">
        <div className="usuario">
          <form onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Digite o nome"
              />
            </label>

            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Digite o password"
              />
            </label>

            <fieldset className="flags-group">
              <legend>Permissões:</legend>
                <input
                  type="checkbox"
                  id="ativo"
                  checked={isActiveFlag}
                  onChange={(e) => setIsActiveFlag(e.target.checked)}
                />
                <label htmlFor="ativo">Ativo</label>

                <input
                  type="checkbox"
                  id="admin"
                  checked={isAdminFlag}
                  onChange={(e) => setIsAdminFlag(e.target.checked)}
                />
                <label htmlFor="admin">Administrador</label>

            </fieldset>

            <button type="submit">Cadastrar</button>
          </form>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}