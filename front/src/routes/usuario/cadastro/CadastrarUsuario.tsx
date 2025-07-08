import { useState } from "react";
import Sidebar from "../../../componentes/sidebar/Sidebar";
import Navbar from "../../../componentes/navbar/Navibar";
import { Toast } from "../../../componentes/utils/Toast";
import "../Usuario.css";

export default function CadastrarUsuario() {
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [isAdminFlag, setIsAdminFlag] = useState(false);
  const [isActiveFlag, setIsActiveFlag] = useState(true);
  const [permissoes, setPermissoes] = useState<string[]>([]);

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  function togglePermissao(role: string) {
    setPermissoes((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: nome,
      password: senha,
      isActived: isActiveFlag ? "true" : "false",
      isRoot: isAdminFlag ? "true" : "false",
      roles: permissoes,
    };

    try {
      const res = await fetch("http://localhost:1880/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToastMessage("Usuário cadastrado com sucesso!");
        setToastType("success");
        setShowToast(true);

        setNome("");
        setSenha("");
        setIsAdminFlag(false);
        setIsActiveFlag(true);
        setPermissoes([]);
      } else {
        throw new Error();
      }
    } catch {
      setToastMessage("Falha ao cadastrar usuário");
      setToastType("error");
      setShowToast(true);
    }

    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="container">
      <Navbar />
      <Sidebar />
      <div className="usuario">
        <form onSubmit={handleSubmit}>
          <label>
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Digite o nome"
            />
          </label>

          <label>
            Senha:
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              placeholder="Digite a senha"
            />
          </label>

          <fieldset className="permissoes-group">
            <legend>Permissões:</legend>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={permissoes.includes("USER")}
                onChange={() => togglePermissao("USER")}
              />
              USER
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={permissoes.includes("ADMIN")}
                onChange={() => togglePermissao("ADMIN")}
              />
              ADMIN
            </label>
          </fieldset>

          <div className="checkbox-inline-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isActiveFlag}
                onChange={(e) => setIsActiveFlag(e.target.checked)}
              />
              Ativo
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isAdminFlag}
                onChange={(e) => setIsAdminFlag(e.target.checked)}
              />
              Administrador
            </label>
          </div>

          <button type="submit">Cadastrar</button>
        </form>
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