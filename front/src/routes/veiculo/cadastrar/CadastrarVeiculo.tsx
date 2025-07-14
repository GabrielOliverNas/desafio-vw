import { useEffect, useState } from "react";
import Sidebar from "../../../componentes/sidebar/Sidebar";
import Navbar from "../../../componentes/navbar/Navibar";
import { Toast } from "../../../componentes/utils/Toast";
import "./CadastrarVeiculo.css";
import { useNavigate } from "react-router-dom";

interface Option {
  uuid: string;
  modelName?: string;
  colorName?: string;
}

export default function CadastrarVeiculo() {

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const [models, setModels] = useState<Option[]>([]);
  const [colors, setColors] = useState<Option[]>([]);

  const [formVeiculo, setFormVeiculo] = useState({
    modelUuid: "",
    colorUuid: "",
    year: new Date().getFullYear(),
    imagePath: [""]
  });

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate("/login");
        return;
      }

      const modelsRes = await fetch("http://localhost:1880/models", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const modelsData = await modelsRes.json();
      setModels(modelsData);

      const colorsRes = await fetch("http://localhost:1880/colors", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const colorsData = await colorsRes.json();
      setColors(colorsData);
    }

    fetchData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormVeiculo((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagePathChange = (index: number, value: string) => {
    const updated = [...formVeiculo.imagePath];
    updated[index] = value;
    setFormVeiculo((prev) => ({ ...prev, imagePath: updated }));
  };

  const addImageField = () => {
    setFormVeiculo((prev) => ({
      ...prev,
      imagePath: [...prev.imagePath, ""]
      })); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      modelUuid: formVeiculo.modelUuid,
      colorUuid: formVeiculo.colorUuid,
      year: Number(formVeiculo.year),
      imagePath: formVeiculo.imagePath
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
        setFormVeiculo({
          modelUuid: "",
          colorUuid: "",
          year: new Date().getFullYear(),
          imagePath: [""]
        });
        setToastMessage("Veículo cadastrado com sucesso!");
        setToastType("success");
        setShowToast(true);
      } else {
        throw new Error();
      }
    } catch (err) {
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

      <div className="center-wrapper">
        <div className="veiculo">
          <form onSubmit={handleSubmit}>
            <label>
              Modelo:
              <select name="modelUuid" value={formVeiculo.modelUuid} onChange={handleChange} required>
                <option value="">Selecione</option>
                {models.map((m) => (
                  <option key={m.uuid} value={m.uuid}>{m.modelName}</option>
                ))}
              </select>
            </label>

            <label>
              Cor:
              <select name="colorUuid" value={formVeiculo.colorUuid} onChange={handleChange} required>
                <option value="">Selecione</option>
                {colors.map((c) => (
                  <option key={c.uuid} value={c.uuid}>{c.colorName}</option>
                ))}
              </select>
            </label>

            <label>
              Ano:
              <input
                type="number"
                name="year"
                value={formVeiculo.year}
                min="1900"
                max={new Date().getFullYear() + 1}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              URLs das Imagens:
              {formVeiculo.imagePath.map((url, index) => (
                <input
                  key={index}
                  type="url"
                  value={url}
                  onChange={(e) => handleImagePathChange(index, e.target.value)}
                  placeholder="https://..."
                  style={{ marginBottom: "0.5rem" }}
                />
              ))}
              <button type="button" onClick={addImageField}>+ Adicionar Imagem</button>
            </label>

            <button type="submit">
              {"Salvar Alterações"}
            </button>
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
    </div>
  );
}
