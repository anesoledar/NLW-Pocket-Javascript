# NLW Pocket Intermediário Passo a Passo

## Inicializando o projeto

1. Crie o `package.json`:
    ```bash
    npm init -y
    ```
2. Instale o TypeScript como dependência de desenvolvimento:
    ```bash
    npm i typescript -D
    ```
3. Inicialize o TypeScript:
    ```bash
    npx tsc --init
    ```
4. Configure o `tsconfig.json`:
    - Acesse [tsconfig/bases](https://github.com/tsconfig/bases?tab=readme-ov-file) e procure a versão do Node utilizada (ex: `@tsconfig/node20`).
    - Copie o conteúdo de `The tsconfig.json` e cole no arquivo `tsconfig.json`. Pronto, o TypeScript está configurado!

5. Instale as dependências adicionais:
    ```bash
    npm i @types/node tsx -D
    ```
    > **Observação**: O `tsx` permite executar o projeto sem converter para JavaScript.

6. Estruture o projeto:
    - Crie uma pasta `src`, dentro dela, uma pasta `http`, e dentro dessa pasta, crie o arquivo `server.ts`.

7. Configure o script de desenvolvimento no `package.json`:
    ```json
    "scripts": {
      "dev": "tsx watch src/http/server.ts"
    }
    ```

8. Instale o framework `Fastify`:
    ```bash
    npm i fastify
    ```

## Criando o servidor HTTP

No arquivo `server.ts`, importe o Fastify e crie a aplicação:

```typescript
import fastify from 'fastify'

const app = fastify()

app.listen({
    port: 3333,
}).then(() => {
    console.log("🚀 HTTP server running!")
})
```
## Configurando o Biome para formatação de código
1. Instale o Biome:
```bash
npm i -D --save-exact @biomejs/biome
```
2. Crie o arquivo biome.json na raiz do projeto e adicione as configurações:
```JSON
{
  "$schema": "./node_modules/@biomejs/biome/configuration_schema.json",
  "organizeImports": {
    "enabled": true
  },
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "arrowParentheses": "asNeeded",
      "jsxQuoteStyle": "double",
      "quoteStyle": "single",
      "semicolons": "asNeeded",
      "trailingCommas": "es5"
    }
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "files": {
    "ignore": [
      "node_modules"
    ]
  }
}
```
3. Configure o VSCode para formatar o código ao salvar:
* Pressione Ctrl + Shift + P e procure por Settings: Open Workspace Settings (JSON).
* Adicione as seguintes configurações
```JSON
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "biomejs.biome"
}
```
4- Instale a extensão do Biome no VSCode e, se necessário, recarregue a janela (Ctrl + Shift + P, procurar por Reload Window).
## Configurando o PostgreSQL com Docker
1- Crie um arquivo docker-compose.yml na raiz do projeto com o seguinte conteúdo:
```yaml
name: pocket-js-server

services:
  pg:
    image: bitnami/postgresql:13.16.0
    ports:
      - '5432:5432'
    environment:
      - POSTGRES_USER=docker
      - POSTGRES_PASSWORD=docker
      - POSTGRES_DB=inorbit
```
2-Execute o Docker:
* Com o Docker Desktop rodando, execute o seguinte comando para subir o serviço PostgreSQL:
```bash
docker compose up -d
```
* Verifique se o banco correto está rodando com o comando:
```bash
docker ps
```
## Como configurar o Drizzle ORM no seu projeto

1. Instalação e Configuração
Instale as dependências:
```
npm i drizzle-orm drizzle-kit zod postgres
```
* drizzle-orm: Para interagir com o banco de dados.
* drizzle-kit: Para gerenciar migrações e realizar outras tarefas.
* zod: Para validação de dados.
* postgres: Driver para conexão com o PostgreSQL.
* Crie o arquivo drizzle.config.ts na raiz do projeto:
import { defineConfig } from 'drizzle-kit'
import { env } from './src/http/env'
```
export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
})
```
* Crie o arquivo .env na raiz do projeto:
```
DATABASE_URL = 'postgresql://docker:docker@localhost:5432/inorbit'
```
*Atualize o script dev no package.json:
```
"scripts": {
  "dev": "tsx --env-file .env watch src/http/server.ts"
},
```
* Crie o arquivo env.ts dentro da pasta src para validar o conteúdo do .env:
 ```
import z from "zod";

const envSchema = z.object({
    DATABASE_URL : z.string().url(),
})

export const env = envSchema.parse(process.env)
// Caso o arquivo env não esteja no formato correto ele vai gerar um erro e fechar o programa.
```
2. Definição do Schema
* Crie a pasta db dentro da pasta src e o arquivo schema.ts dentro dela:
```
import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const goals = pgTable('goals', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  desiredWeeklyFrequency: integer('desired_weekly_frequency').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
```
3. Gerando Migrações e Criando a Tabela
* Execute o comando para gerar as migrações:
  ```
  npx drizzle-kit generate
  ```
* Após a geração das migrações, execute o comando para criar a tabela:
```
npx drizzle-kit migrate
```
* Para visualizar a tabela criada, execute o comando:
```
npx drizzle-kit studio
```
* Isso abrirá um link no seu navegador para visualizar a tabela.
4. Criando a Tabela de Metas Concluídas
* Adicione a definição da tabela goalCompletions no arquivo schema.ts:
```
export const goalCompletions = pgTable('goal_completions', {
  id: text('id').primaryKey(),
  // Adicione os campos da tabela aqui...
})

```
* Execute novamente os comandos npx drizzle-kit generate e npx drizzle-kit migrate para criar a nova tabela.
5. Dicas Importantes
* Utilize o dotenv para carregar as variáveis de ambiente:
```
const { config } = require('dotenv')
config()
```

