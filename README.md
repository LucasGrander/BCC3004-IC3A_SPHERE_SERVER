# BCC3004-IC3A_SPHERE_SERVER


Servidor backend do projeto **Sphere**, desenvolvido em **TypeScript** com **Express**, **PostgreSQL** e **Drizzle ORM**.

---

## Tecnologias

- **Node.js** com suporte a **ESM**
- **TypeScript**
- **Express** para rotas e middleware
- **Drizzle ORM** como camada de banco de dados
- **PostgreSQL** como SGBD
- **Drizzle Kit** para gerenciamento de schema e migrações

---

## Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/LucasGrander/BCC3004-IC3A_SPHERE_SERVER.git
cd BCC3004-IC3A_SPHERE_SERVER
npm i
```

Crie um arquivo `.env` na raiz do projeto com suas variáveis de ambiente:

```env
DATABASE_URL=postgres://usuario:senha@localhost:5432/nome_do_banco
PORT=3000
```

---

## Scripts principais

### Desenvolvimento

```bash
npm run dev
```

Executa o servidor em modo de desenvolvimento com **TSX** e **Nodemon** (recarga automática).

### Compilação

```bash
npm run build
```

Compila os arquivos TypeScript para JavaScript em `./dist`.

### Produção

```bash
npm start
```

Roda o servidor compilado.

---

## Drizzle ORM e Drizzle Kit

### Comandos principais

#### Sincronizar tipos

```bash
npx drizzle-kit introspect
```

Gera automaticamente tipos TypeScript baseados nas tabelas existentes.

#### Visualizar o banco de dados

```bash
npx drizzle-kit studio
```

Abre uma interface web local com visualização das tabelas e dados.

---

