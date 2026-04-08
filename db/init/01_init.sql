-- Criação da tabela Administrador
CREATE TABLE Administrador (
    ID_UsuarioA SERIAL PRIMARY KEY,   -- Chave base imutável para operações internas
    Senha VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) UNIQUE,
    Avatar VARCHAR(255),
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Nome VARCHAR(150) NOT NULL
);

-- Criação da tabela Jogador
CREATE TABLE Jogador (
    ID_UsuarioJ SERIAL PRIMARY KEY,   -- Chave base imutável para operações internas
    Nickname VARCHAR(50) NOT NULL UNIQUE,                -- "Nickname" alterável
    Km DECIMAL(10, 2) DEFAULT 0.00,
    Banido BOOLEAN DEFAULT FALSE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Senha VARCHAR(255) NOT NULL,
    CPF VARCHAR(14) UNIQUE,
    Avatar VARCHAR(255),
    DataCadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Nome VARCHAR(150) NOT NULL
);