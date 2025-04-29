
# 📦 LLabs Favorites

Este projeto fullstack tem como objetivo gerenciar **produtos favoritos de clientes**, fornecendo uma API robusta e uma interface simples para interação. O sistema foi construído com foco em alta performance, suportando uma grande carga de **produtos favoritados por minuto**.

---

## 🔧 Funcionalidades

### 👤 Cadastro e Login de Clientes
- Registro de cliente com nome, e-mail e senha.
- Validação para impedir registros duplicados com o mesmo e-mail.
- Login com retorno amigável em caso de erro.

### ⭐ Listas de Produtos Favoritos
- Cada cliente pode criar uma única lista de favoritos com título e descrição.
- Funcionalidades de **criar, visualizar, editar e excluir** listas.
- Limite de até **5 produtos por lista**.
- Exclusão da lista desfavorita todos os produtos associados.

### 🛍️ Catálogo e Favoritar Produtos
- Exibição de catálogo de produtos (consumido da [Fake Store API](https://fakestoreapi.com/docs)).
- Produtos apresentados com **título, imagem e preço**.
- Regras de negócio:
  - Não é possível favoritar produtos inexistentes ou duplicados.
  - Apenas até 5 favoritos permitidos por cliente.

### 📢 Notificações (mockadas)
- Para cada produto favoritado, o cliente recebe uma notificação.
- Integração com serviço de e-mail fake via Mailtrap (mock ou opcionalmente real).

---

## 📁 Estrutura do Projeto

```
llabs-favorites/
├── backend/
├── frontend/
└── README.md
```

---

## ⚙️ Backend (NestJS + Prisma + PostgreSQL)

### 📦 Pré-requisitos

- Docker e Docker Compose
- Node.js v18+
- PostgreSQL (se não for usar Docker)

### 🚀 Executando localmente

1. Clone o repositório:

```bash
git clone https://github.com/mauricioyansen/llabs-favorites.git
cd llabs-favorites/backend
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:

Renomeie o arquivo `.env.example` para `.env` e edite os valores conforme seu ambiente:

```
PORT=3000
DATABASE_URL="postgresql://postgres:docker@localhost:5432/my-db?schema=public"
PRIVATE_KEY_PATH=./keys/private.key
PUBLIC_KEY_PATH=./keys/public.key
MAILTRAP_USER=xxxxxx
MAILTRAP_PASSWORD=xxxxxx
FAKE_API_PRODUCTS_URL=https://fakestoreapi.com/products
```

4. Inicialize o banco de dados com Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

5. (Opcional) Acesse o painel de dados:

```bash
npx prisma studio
```

6. Suba o projeto com Docker Compose:

```bash
docker-compose up
```

Ou rode em modo desenvolvimento localmente:

```bash
npm run start:dev
```

### ✅ Testes

- Testes end-to-end:

```bash
npm run test:e2e
```

---

## 💻 Frontend (React + Vite + Tailwind)

### 📦 Pré-requisitos

- Node.js v18+

### 🚀 Executando localmente

1. Acesse a pasta `frontend`:

```bash
cd ../frontend
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo `.env` com a URL do backend:

```
VITE_API_URL=http://localhost:3000
```

4. Inicie o projeto:

```bash
npm run dev
```

---

## 🧪 Tecnologias Utilizadas

### Backend

- **NestJS** (framework)
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (autenticação)
- **Docker** / Docker Compose

### Frontend

- **React 19**
- **Vite**
- **Tailwind CSS**

---

## 📬 Contato

Desenvolvido por [Maurício Yansen](https://github.com/mauricioyansen) 🚀
