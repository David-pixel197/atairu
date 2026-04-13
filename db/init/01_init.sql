-- =============================================
-- Lógico_Ataîru — PostgreSQL
-- =============================================

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE Administrador (
    ID_UsuarioA     SERIAL PRIMARY KEY,
    Email           VARCHAR(255) UNIQUE NOT NULL,
    Senha           VARCHAR(255) NOT NULL,
    CPF             VARCHAR(14) UNIQUE NOT NULL,
    Avatar          VARCHAR(500),
    DataCadastro    TIMESTAMP DEFAULT NOW(),
    Nome            VARCHAR(255) NOT NULL,
    DataNascimento  DATE
);

CREATE TABLE Jogador (
    ID_UsuarioJ     SERIAL PRIMARY KEY,
    Nickname        VARCHAR(50)  NOT NULL,
    Email           VARCHAR(255) NOT NULL,
    Senha           VARCHAR(255) NOT NULL,
    CPF             VARCHAR(14),
    Avatar          VARCHAR(500),
    DataCadastro    TIMESTAMP DEFAULT NOW(),
    Nome            VARCHAR(255) NOT NULL,
    DataNascimento  DATE,
    Km              DECIMAL(10, 2) DEFAULT 0,
    Banido          BOOLEAN DEFAULT FALSE,
    UNIQUE (Nickname),
    UNIQUE (Email),
    UNIQUE (CPF)
);

CREATE TABLE Classificacao (
    ID_Classificacao  SERIAL PRIMARY KEY,
    Nome              VARCHAR(100) NOT NULL,
    Descricao         TEXT
);

CREATE TABLE Historias (
    ID_Historia  SERIAL PRIMARY KEY,
    Titulo       VARCHAR(255) NOT NULL,
    Autor        VARCHAR(255),
    Km           DECIMAL(10, 2),
    Progresso    INTEGER DEFAULT 0
    -- ATENÇÃO: FK_Historias_2 (ClassIndicativa) estava indefinida no original.
    -- Adicione aqui: fk_Classificacao INTEGER REFERENCES Classificacao(ID_Classificacao)
    -- caso Historias tenha uma classificação indicativa direta.
);

CREATE TABLE Monumentos (
    ID_Monumentos  SERIAL PRIMARY KEY,
    Titulo         VARCHAR(255) NOT NULL,
    Descricao      TEXT,
    Imagem         VARCHAR(500),
    Localizacao    GEOMETRY(POINT, 4326) NOT NULL,
    Raio           INTEGER,
    fk_Historias   INTEGER NOT NULL,
    CONSTRAINT FK_Monumentos_1 FOREIGN KEY (fk_Historias)
        REFERENCES Historias (ID_Historia)
        ON DELETE CASCADE
);

-- Índice espacial (essencial para queries de proximidade)
CREATE INDEX idx_monumentos_localizacao
    ON Monumentos USING GIST (Localizacao);

CREATE TABLE Itens (
    ID_Item      SERIAL PRIMARY KEY,
    Nome         VARCHAR(255) NOT NULL,
    Descricao    TEXT,
    Imagens      VARCHAR(500),
    Localizacao    GEOMETRY(POINT, 4326) NOT NULL,
    Raio         INTEGER,
    fk_historia  INTEGER NOT NULL,
    -- CORRIGIDO: original tinha fk_Historias e fk_historia como se fossem dois campos;
    -- na tabela só existe fk_historia — normalizado para um único FK.
    CONSTRAINT FK_Itens_2 FOREIGN KEY (fk_historia)
        REFERENCES Historias (ID_Historia)
        ON DELETE CASCADE
);

CREATE INDEX idx_itens_localizacao
    ON Itens USING GIST (Localizacao);

CREATE TABLE Jogador_Historias (
    fk_Jogador   INTEGER NOT NULL,
    fk_Historias INTEGER NOT NULL,
    PRIMARY KEY (fk_Jogador, fk_Historias),
    CONSTRAINT FK_Jogador_Historias_1 FOREIGN KEY (fk_Historias)
        REFERENCES Historias (ID_Historia),
    CONSTRAINT FK_Jogador_Historias_2 FOREIGN KEY (fk_Jogador)
        REFERENCES Jogador (ID_UsuarioJ)
);

CREATE TABLE Inventario (
    fk_Itens    INTEGER NOT NULL,
    fk_usuario  INTEGER NOT NULL,
    Possui      BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (fk_Itens, fk_usuario),
    CONSTRAINT FK_Inventario_1 FOREIGN KEY (fk_Itens)
        REFERENCES Itens (ID_Item),
    CONSTRAINT FK_Inventario_2 FOREIGN KEY (fk_usuario)
        REFERENCES Jogador (ID_UsuarioJ)
);

CREATE TABLE Visitas (
    fk_Monumentos  INTEGER NOT NULL,
    fk_Jogador     INTEGER NOT NULL,
    Visitado       BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (fk_Monumentos, fk_Jogador),
    CONSTRAINT FK_Visitas_1 FOREIGN KEY (fk_Monumentos)
        REFERENCES Monumentos (ID_Monumentos),
    CONSTRAINT FK_Visitas_2 FOREIGN KEY (fk_Jogador)
        REFERENCES Jogador (ID_UsuarioJ)
);

CREATE TABLE Historias_Classificacao (
    fk_Classificacao  INTEGER NOT NULL,
    fk_Historias      INTEGER NOT NULL,
    PRIMARY KEY (fk_Classificacao, fk_Historias),
    CONSTRAINT FK_Historias_Classificacao_1 FOREIGN KEY (fk_Classificacao)
        REFERENCES Classificacao (ID_Classificacao),
    CONSTRAINT FK_Historias_Classificacao_2 FOREIGN KEY (fk_Historias)
        REFERENCES Historias (ID_Historia)
);