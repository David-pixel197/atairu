# Ataîru

Este é o repositório principal do projeto **Ataîru**, que contém a infraestrutura do banco de dados e a API Backend (desenvolvida em Spring Boot). O projeto é conteinerizado, facilitando a execução em qualquer ambiente.

---

## 🛠️ Tecnologias Utilizadas

* **Backend:** Java 25, Spring Boot, Maven
* **Banco de Dados:** PostgreSQL com extensão PostGIS
* **Infraestrutura:** Docker e Docker Compose

---

## 📋 Pré-requisitos

Para rodar este projeto na sua máquina, você não precisa instalar o Java ou o PostgreSQL nativamente, pois tudo roda isolado em containers. Você precisa ter instalado apenas:

1.  **[Docker](https://docs.docker.com/get-docker/)**
2.  **[Docker Compose](https://docs.docker.com/compose/install/)** (Geralmente já vem incluso no Docker Desktop)
3.  **[Git](https://git-scm.com/)** (Para clonar o repositório)

---

## Sugestoes de Tecnologias

1.  **[Docker Desktop](https://docs.docker.com/desktop/)** (Ferramenta mais completa e visual para gerenciamento de conteiners)
2.  **[Dbeaver](https://dbeaver.io/)** (Ferramenta visual para gerenciar o banco de dados)

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
