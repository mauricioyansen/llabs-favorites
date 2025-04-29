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

### 📨 Sistema de Mensageria com BullMQ

Para garantir **escalabilidade e performance** no processo de favoritar produtos — especialmente com a alta volumetria de até 100.000 requisições por minuto — o backend utiliza o **BullMQ**, uma biblioteca robusta para gerenciamento de filas baseada em Redis.

## 📌 Funcionamento

- Ao favoritar um produto, a operação de envio de notificação é **desacoplada da requisição principal** e enfileirada.
- A fila é processada por workers que são responsáveis por simular (ou enviar, se configurado) a notificação via e-mail.
- Isso permite uma experiência mais fluida para o cliente e evita sobrecarga no servidor HTTP.

## 📦 Tecnologias relacionadas

- **BullMQ** – biblioteca de filas baseada em Redis.
- **Redis** – utilizado como broker de mensageria para armazenar e distribuir os jobs.
- **Mailtrap** (mock) – usado como serviço de email para ambiente de desenvolvimento.

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

4. Suba o projeto com Docker Compose:

```bash
docker-compose up -d
```

5. Inicialize o banco de dados com Prisma:

```bash
npx prisma migrate dev
npx prisma generate
```

6. (Opcional) Acesse o painel de dados:

```bash
npx prisma studio
```

Rode em modo desenvolvimento localmente:

```bash
npm run start:dev
```

OBS: Foram passados modelos genéricos de chaves RS256 publica e privada, assim voce nao precisa gerar suas próprias chaves para testar a aplicação

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

## 🧪 Coleção de Testes no Postman

Para facilitar o teste das rotas da aplicação, há uma coleção do **Postman** disponível na raiz do projeto com o nome `Llabs Favorites`.

Essa coleção contém exemplos de requisições organizadas por categorias, incluindo autenticação, criação de listas de favoritos e favoritar produtos.

### 📂 Estrutura da coleção:

- **Accounts**

  - Create User

- **Sessions**

  - Login User 1 (com extração automática do `accessToken`)
  - Login User 2 (com extração automática do `accessToken`)

- **Favorite List**

  - Create Fav List
  - Show Fav List
  - Edit Fav List
  - Del Fav List

- **Favorite Products**
  - Get All Product
  - Favorite a Product
  - Get Fav Products By FavListId
  - Del Product By Id

### 🛠️ Como usar

1. Abra o **Postman**.
2. Clique em **Import** e selecione o arquivo `.json` localizado na raiz do projeto.
3. Altere a variável `{{url}}` para o endereço local da sua API (por exemplo, `http://localhost:3333`).
4. Faça login com um dos usuários de teste e copie o `accessToken`, que será salvo automaticamente no ambiente.
5. Use as demais requisições conforme necessário para testar a aplicação.

---

Essa coleção é útil tanto para testes manuais quanto para explorar rapidamente as funcionalidades expostas pela API.

---

## 🧪 Tecnologias Utilizadas

### Backend

- **NestJS** (framework)
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (autenticação)
- **Docker** / Docker Compose
- **BullMQ** – biblioteca de filas baseada em Redis.
- **Redis** – utilizado como broker de mensageria para armazenar e distribuir os jobs.
- **Mailtrap** (mock) – usado como serviço de email para ambiente de desenvolvimento.
- **Vitest** - Para os teste e2e.

### Frontend

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Shadcn UI**

---

## 📬 Contato

Desenvolvido por [Maurício Yansen](https://github.com/mauricioyansen) 🚀
