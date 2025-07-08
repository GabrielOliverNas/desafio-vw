import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../componentes/sidebar/Sidebar";
import Navbar from "../../../componentes/navbar/Navibar";
import "./AlterarVeiculo.css";

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

interface Option {
  uuid: string;
  modelName?: string; // Para models
  colorName?: string; // Para cores
}

export default function AlterarVeiculo() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const isEditing = !!uuid;

  const [visualVeiculo, setVisualVeiculo] = useState<Veiculo | null>(null);
  const [models, setModels] = useState<Option[]>([]);
  const [colors, setColors] = useState<Option[]>([]);

  const [formVeiculo, setFormVeiculo] = useState({
    modelUuid: "",
    colorUuid: "",
    year: new Date().getFullYear(),
    imagePath: [""]
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    async function fetchData() {
      try {
        if (uuid) {
          const res = await fetch("http://localhost:1880/listar-veiculo-id", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ uuid })
          });
          const data = await res.json();
          if (!data.veiculo) throw new Error("Veículo não encontrado");

          setVisualVeiculo(data.veiculo);
          setFormVeiculo({
            modelUuid: data.veiculo.model?.uuid || "",
            colorUuid: data.veiculo.color?.uuid || "",
            year: data.veiculo.year,
            imagePath: data.veiculo.imagePath?.length ? data.veiculo.imagePath : [""]
          });
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

      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [uuid, navigate]);

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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!visualVeiculo) {
      console.error("Veículo não carregado para edição.");
      return;
    }

    try {
      const payload = {
        uuid: visualVeiculo.uuid,
        modelUuid: formVeiculo.modelUuid,
        colorUuid: formVeiculo.colorUuid,
        year: Number(formVeiculo.year),
        imagePath: formVeiculo.imagePath
      };

      console.log(payload)
      const res = await fetch("http://localhost:1880/alterar-veiculo-id", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Erro ao salvar");

      alert("Veículo atualizado com sucesso!");
      navigate("/veiculo");
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
          {visualVeiculo ? (
            <>
              <p><strong>Modelo:</strong> {visualVeiculo.model?.modelName || "-"}</p>
              <p><strong>Cor:</strong> {visualVeiculo.color?.colorName || "-"}</p>
              <p><strong>Ano:</strong> {visualVeiculo.year}</p>
              <p><strong>Imagens:</strong></p>
              <ul>
                {visualVeiculo.imagePath.map((url, i) => (
                  <li key={i}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></li>
                ))}
              </ul>
              <p><strong>Criado por:</strong> {visualVeiculo.creationUserName}</p>
              <p><strong>Criado em:</strong> {new Date(visualVeiculo.creationDate).toLocaleString()}</p>
              <p><strong>Atualizado em:</strong> {new Date(visualVeiculo.updateDate || visualVeiculo.creationDate).toLocaleString()}</p>
            </>
          ) : (
            <p>Carregando dados...</p>
          )}
        </div>

        <div className="usuario">
          <form onSubmit={handleSubmit}>
            <h3>{isEditing ? "Editar Veículo" : "Cadastrar Veículo"}</h3>

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
              {isEditing ? "Salvar Alterações" : "Cadastrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
