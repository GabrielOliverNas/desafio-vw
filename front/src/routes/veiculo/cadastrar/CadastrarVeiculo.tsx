import { useState } from "react";
import Sidebar from "../../../componentes/sidebar/Sidebar";
import Navbar from "../../../componentes/navbar/Navibar";
import { Toast } from "../../../componentes/utils/Toast";
import "../../usuario/Usuario.css"; // Reutilizando o mesmo estilo visual

export default function CadastrarVeiculo() {
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [ano, setAno] = useState(new Date().getFullYear());
  const [fotoUrl, setFotoUrl] = useState("");

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      modelo,
      cor,
      ano,
      fotoUrl,
    };

    try {
      const res = await fetch("http://localhost:1880/veiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      if (text.trim().startsWith("{")) {
        const data = JSON.parse(text);
        setToastMessage("Veículo cadastrado com sucesso!");
        setToastType("success");
        setShowToast(true);

        setModelo("");
        setCor("");
        setAno(new Date().getFullYear());
        setFotoUrl("");
      } else {
        throw new Error("Resposta inválida do servidor");
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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div style={{ flexGrow: 1 }}>
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
                placeholder="https://meuservidor.com/fotos/..."
                required
              />
            </label>
          </div>

          <div style={{ marginTop: "1rem", alignSelf: "flex-start" }}>
            <button type="submit">Cadastrar Veículo</button>
          </div>
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
