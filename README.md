# Ataîru

Este é o repositório principal do projeto **Ataîru**, que contém a infraestrutura do banco de dados e a API Backend (desenvolvida em Spring Boot). O projeto é conteinerizado, facilitando a execução em qualquer ambiente.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Java 25, Spring Boot, Maven
* **Banco de Dados:** PostgreSQL com extensão PostGIS
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

No Windows (PowerShell):
```bash
Copy-Item .env.example -Destination .env
```

Observação: O arquivo .env já está no .gitignore e não será enviado para o repositório.
2. Subindo os Containers

Com o terminal aberto na raiz do projeto (onde está o arquivo docker-compose.yml), execute o comando abaixo para construir a imagem do backend e iniciar os serviços:
Bash

```bash
docker-compose up --build -d
```

O parâmetro -d (detached) faz com que os containers rodem em segundo plano.
3. Acessando a Aplicação

Após o Docker finalizar a inicialização, os serviços estarão disponíveis em:

    Backend (Spring Boot): http://localhost:8080
    Banco de Dados (PostgreSQL): localhost:5432

---

## Rodando o App (Frontend)

Com o backend já rodando, abra uma nova aba ou janela do seu terminal e siga os passos abaixo para iniciar o aplicativo:

1. Acesse a pasta do frontend e instale as dependências:
```bash
cd atairu-frontend
npm install
```

2. Inicie o servidor do Expo:
```bash
npx expo start
```

(Ou npm start)

3. Acesse o aplicativo:
No terminal, o Expo exibirá um QR Code. Você pode:

    Ler o QR Code com o aplicativo Expo Go no seu celular para testar no dispositivo físico.

    Pressionar a no terminal para abrir no Emulador Android.

    Pressionar i no terminal para abrir no Simulador iOS.

    Pressionar w no terminal para abrir no Navegador Web.

---

🛑 Como Parar a Aplicação

Para parar os containers sem perder os dados do banco:

```bash
docker-compose down
```

Atenção: Se você precisar "resetar" o banco de dados e apagar todas as tabelas para que o script de inicialização (01_init.sql) rode novamente, adicione a flag -v para remover os volumes:
Bash

```bash
docker-compose down -v
```
