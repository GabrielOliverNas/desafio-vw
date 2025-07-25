Este projeto é um sistema de gestão de **usuários** e **veículos**, desenvolvido com **Node-RED** e **React + TypeScript**.

---

## Funcionalidades Principais

**Login com JWT** — Autenticação de usuários com geração de token e roles (`ADMIN` ou `USER`).

**Controle de Acesso** — As rotas do frontend são protegidas por um `ProtectedRoute` que valida o token e as permissões.

**Gestão de Usuários** — Permite cadastrar, listar, editar e remover usuários.

**Gestão de Veículos** — Permite cadastrar, listar, filtrar, editar e remover veículos.

**Tabelas Estáticas** — Modelos e cores são armazenados em tabelas internas (`modelsTable` e `colorsTable`).

**Dashboard** — Página principal de visão geral.

---

## ⚙️ Tecnologias

- **Backend:** Node-RED
- **Frontend:** React + TypeScript
- **Auth:** JWT (Token salvo em Local Storage)
- **Armazenamento:** Contexto do Node-RED (`flow.get` e `flow.set`)

---

## 🚀 Como rodar localmente (SEM Docker)

### Backend (Node-RED)

1. Instale o **Node.js** (versão recomendada: >=16).
2. Instale o Node-RED global:
   ```bash
   npm install -g node-red
   ```
3. Rode o Node-RED:
   ```bash
   node-red
   ```
4. Acesse o editor: [http://localhost:1880](http://localhost:1880)  
   Importe o arquivo `flows.json` se for necessário.

---

### Frontend (React)

1. Acesse a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o projeto:
   ```bash
   npm start
   ```

O frontend abrirá em [http://localhost:3000](http://localhost:3000).

---

# Projeto Node.js + React com Docker

Este projeto é um template básico para aplicações **Fullstack** com **Node.js** (backend) e **React** (frontend) usando **Docker** para orquestração.

---

## 🚀 Como rodar o projeto

### 1️⃣ Pré-requisitos
- **Docker** instalado.
- **Docker Compose** (opcional, mas recomendado).

---

### 2️⃣ Subir containers

Execute na raiz do projeto:

``` bash
docker compose down
docker compose build --no-cache
docker compose up
```

### 3️⃣ Acessar o projeto

Frontend: http://localhost:3000
Backend: http://localhost:1880
