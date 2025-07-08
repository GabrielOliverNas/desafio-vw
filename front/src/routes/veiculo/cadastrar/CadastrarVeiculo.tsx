import { useState } from "react";
import Sidebar from "../../../componentes/sidebar/Sidebar";
import Navbar from "../../../componentes/navbar/Navibar";
import { Toast } from "../../../componentes/utils/Toast";
import "./CadastrarVeiculo.css"; // Reaproveitando o estilo do usuário
import { useNavigate } from "react-router-dom";

export default function CadastrarVeiculo() {
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [ano, setAno] = useState(new Date().getFullYear());
  const [fotoUrl, setFotoUrl] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      modelName: modelo,
      colorName: cor,
      year: ano,
      imagePath: [fotoUrl],
      creationUserName: "nome logado JWT",
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch("http://localhost:1880/inserir-veiculo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setToastMessage("Veículo cadastrado com sucesso!");
        setToastType("success");
        setShowToast(true);

        setModelo("");
        setCor("");
        setAno(new Date().getFullYear());
        setFotoUrl("");
      } else {
        throw new Error();
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Falha ao cadastrar veículo");
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
            Modelo:
            <input
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              required
              placeholder="Digite o modelo"
            />
          </label>

          <label>
            Cor:
            <input
              type="text"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              required
              placeholder="Digite a cor"
            />
          </label>

          <label>
            Ano:
            <input
              type="number"
              value={ano}
              onChange={(e) => setAno(Number(e.target.value))}
              min="1900"
              max={new Date().getFullYear() + 1}
              required
              placeholder="Digite o ano"
            />
          </label>

          <label>
            URL da Foto:
            <input
              type="url"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              placeholder="https://servidor.com/foto.jpg"
              required
            />
          </label>

          <button type="submit">Cadastrar Veículo</button>
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
