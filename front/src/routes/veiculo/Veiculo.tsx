import { useEffect, useState } from "react";
import "./Veiculo.css";
import Navbar from "../../componentes/navbar/Navibar";
import Sidebar from "../../componentes/sidebar/Sidebar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

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

export default function ListarVeiculos() {
  const navigate = useNavigate();

  const { isAdmin } = useAuth();

  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("model");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    const fetchVeiculos = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const requestBody = {
          search,
          sortField,
          sortOrder,
          page,
          limit,
        };

        const res = await fetch("http://localhost:1880/listar-veiculos-paginado", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Erro ao buscar veículos");

        setVeiculos(data.data || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVeiculos();
  }, [search, sortField, sortOrder, page, limit, navigate]);

  const totalPages = Math.ceil(total / limit);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleEditar = (uuid: string) => {
    navigate(`/veiculo/editar/${uuid}`);
  };

  const handleExcluir = async (uuid: string) => {
    if (!window.confirm("Confirma exclusão desse veículo?")) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:1880/remover-veiculo-id", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uuid }),
      });

      if (!res.ok) {
        throw new Error("Falha ao deletar veículo.");
      }

      setVeiculos((prev) => prev.filter((v) => v.uuid !== uuid));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <Sidebar />

      <div className="center-wrapper">
        <div className="listar">
          <h2>Lista de Veículos</h2>

          <div className="filtros">
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value={5}>5 por página</option>
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
            </select>
          </div>

          {veiculos.length === 0 ? (
            <p>Nenhum veículo encontrado.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th onClick={() => handleSort("model")}>Modelo</th>
                  <th onClick={() => handleSort("color")}>Cor</th>
                  <th onClick={() => handleSort("year")}>Ano</th>
                  <th>Foto</th>
                  <th>Criado por</th>
                  <th onClick={() => handleSort("creationDate")}>Criado em</th>
                  <th>Atualizado em</th>
                  {isAdmin && (
                    <th>Ações</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {veiculos.map((v) => (
                  <tr key={v.uuid}>
                    <td>{v.model?.modelName || "-"}</td>
                    <td>{v.color?.colorName || "-"}</td>
                    <td>{v.year}</td>
                    <td>
                      {v.imagePath?.[0] ? (
                        <a
                          href={v.imagePath[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver Foto
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>{v.creationUserName || "-"}</td>
                    <td>{new Date(v.creationDate).toLocaleString()}</td>
                    <td>
                      {new Date(v.updateDate || v.creationDate).toLocaleString()}
                    </td>
                    {isAdmin && (
                      <td>
                        <button
                          onClick={() => handleEditar(v.uuid)}
                          className="btn-editar"
                        >
                          🖉
                        </button>
                        <button
                          onClick={() => handleExcluir(v.uuid)}
                          className="btn-excluir"
                        >
                          🗑️
                        </button>
                      </td>
                      )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="paginacao">
            Página: {page} de {totalPages}
            <button
              onClick={() => page > 1 && setPage(page - 1)}
              disabled={page === 1}
            >
              {"<"}
            </button>
            <button
              onClick={() => page < totalPages && setPage(page + 1)}
              disabled={page === totalPages}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
