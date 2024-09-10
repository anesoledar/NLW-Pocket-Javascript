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
