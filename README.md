# Ataîru

Este é o repositório principal do projeto **Ataîru**, que contém a infraestrutura do banco de dados e a API Backend (desenvolvida em Spring Boot). O projeto é conteinerizado, facilitando a execução em qualquer ambiente.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Java 17, Spring Boot, Maven
* **Banco de Dados:** PostgreSQL com extensão PostGIS
* **Frontend:** React Native com Expo
* **Infraestrutura:** Docker e Docker Compose

---

## 📋 Pré-requisitos

Para rodar este projeto na sua máquina, você precisará instalar:

1. **[Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)** (Para rodar o Banco de Dados e o Backend isolados)
2. **[Node.js](https://nodejs.org/)** (Para gerenciar as dependências do Frontend)
3. **[Git](https://git-scm.com/)** (Para clonar o repositório)

*Sugestões adicionais:*
* **[Docker Desktop](https://docs.docker.com/desktop/)**: Ferramenta visual para gerenciamento de contêineres.
* **[DBeaver](https://dbeaver.io/)**: Ferramenta visual para gerenciar o banco de dados.
* **[Expo Go](https://expo.dev/go)**: Aplicativo no seu smartphone (Android/iOS) para testar o frontend em tempo real.

---

## 🚀 Como Configurar e Rodar o Projeto

Siga o passo a passo abaixo para inicializar a aplicação:

### 1. Variáveis de Ambiente

O projeto precisa de algumas configurações sensíveis para conectar ao banco de dados.
Copie o arquivo de exemplo para criar o seu arquivo de ambiente local:

**No Linux/macOS:**
```bash
cp .env.example .env
```

**No Windows (PowerShell):**
```bash
Copy-Item .env.example -Destination .env
```

> O arquivo `.env` já está no `.gitignore` e não será enviado para o repositório.

---

### 2. Subindo os Containers (Backend + Banco de Dados)

Com o terminal aberto na raiz do projeto (onde está o arquivo `docker-compose.yml`), execute:

```bash
docker compose up --build -d
```

O parâmetro `-d` (detached) faz com que os containers rodem em segundo plano.

Após a inicialização, os serviços estarão disponíveis em:

* **Backend (Spring Boot):** `http://localhost:8080`
* **Banco de Dados (PostgreSQL):** `localhost:5432`

---

### 3. Rodando o Frontend (App Expo)

Com o backend já rodando, abra uma nova aba do terminal e execute:

```bash
cd atairu-frontend
npm install
npx expo start
```

No terminal, o Expo exibirá um QR Code. Você pode:

* Ler o QR Code com o **Expo Go** no celular para testar no dispositivo físico.
* Pressionar **`a`** para abrir no Emulador Android.
* Pressionar **`i`** para abrir no Simulador iOS.
* Pressionar **`w`** para abrir no navegador web.

---

## 🔗 Conectando o Frontend ao Backend

O frontend precisa saber o endereço do backend para fazer requisições. A configuração correta depende de **onde** o app está rodando.

### Entendendo os endereços

| Onde o app roda | Endereço correto do backend |
|---|---|
| Navegador web (`w`) | `http://localhost:8080` |
| Emulador Android (`a`) | `http://10.0.2.2:8080` |
| Simulador iOS (`i`) | `http://localhost:8080` |
| Expo Go no celular físico | `http://<IP-da-sua-máquina>:8080` |

> **Por que endereços diferentes?** Emuladores e dispositivos físicos são máquinas separadas. `localhost` dentro deles aponta para o próprio aparelho, não para o seu computador. O Android usa `10.0.2.2` como atalho para o `localhost` do host. No celular físico via Expo Go, é necessário usar o IP real da sua máquina na rede local (ex: `192.168.1.10`).

---

### Como encontrar o IP da sua máquina

**Linux/macOS:**
```bash
ip route get 1 | awk '{print $7; exit}'
# ou
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows (PowerShell):**
```powershell
ipconfig | findstr "IPv4"
```

---

### Configurando a URL base no frontend

Crie (ou edite) um arquivo de configuração central no frontend para definir a URL do backend, evitando repetição em cada chamada de API. Por exemplo, em `atairu-frontend/src/config/api.ts`:

```typescript
// Escolha o endereço correto para o seu ambiente de desenvolvimento:

// Para navegador web ou Simulador iOS:
const BASE_URL = 'http://localhost:8080';

// Para Emulador Android:
// const BASE_URL = 'http://10.0.2.2:8080';

// Para celular físico via Expo Go (substitua pelo seu IP):
// const BASE_URL = 'http://192.168.1.10:8080';

export default BASE_URL;
```

Importe e use essa constante em qualquer chamada de API:

```typescript
import BASE_URL from '../config/api';

const response = await fetch(`${BASE_URL}/api/jogadores/cadastro`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, senha, nickname, nome, cpf }),
});
```

---

### Testando a conexão manualmente

Antes de testar pelo app, confirme que o backend está respondendo com um `curl` ou acessando no navegador:

```bash
# Cadastrar um jogador de teste
curl -X POST http://localhost:8080/api/jogadores/cadastro \
     -H "Content-Type: application/json" \
     -d '{
          "email": "teste@email.com",
          "senha": "senha123",
          "nickname": "JogadorTeste",
          "nome": "Usuario de Teste",
          "cpf": "12345678900",
          "dataNascimento": "2000-01-01T00:00:00"
     }'
```

Uma resposta com o JSON do jogador criado confirma que o backend e o banco estão funcionando corretamente.

---

### Endpoints disponíveis

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/jogadores/cadastro` | Cadastra um novo jogador |
| `POST` | `/api/jogadores/login` | Autentica um jogador (email + senha) |
| `PATCH` | `/api/jogadores/{id}/nickname?novoNickname=` | Atualiza o nickname do jogador |

---

## 🛑 Como Parar a Aplicação

Para parar os containers sem perder os dados do banco:

```bash
docker compose down
```

Para **resetar** o banco de dados completamente (apaga todos os dados e recria as tabelas):

```bash
docker compose down -v
```