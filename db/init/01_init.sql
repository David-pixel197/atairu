/* =========================================================
   Ataîru — Esquema físico PostgreSQL
   Convertido a partir do modelo lógico.
   Ajustes aplicados estão comentados inline com "-- FIX:"
   ========================================================= */

CREATE EXTENSION IF NOT EXISTS postgis;

-- ---------------------------------------------------------
-- Tabelas base
-- ---------------------------------------------------------

CREATE TABLE administrador (
    id_usuario_a    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email           VARCHAR NOT NULL,
    senha           VARCHAR NOT NULL,
    cpf             VARCHAR,
    avatar          VARCHAR,
    data_cadastro   TIMESTAMP DEFAULT now(),
    nome            VARCHAR,
    data_nascimento TIMESTAMP
);

CREATE TABLE jogador (
    id_usuario_j    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nickname        VARCHAR NOT NULL,
    km              DECIMAL DEFAULT 0,
    banido          BOOLEAN DEFAULT FALSE,
    email           VARCHAR NOT NULL,
    senha           VARCHAR NOT NULL,
    cpf             VARCHAR,
    avatar          VARCHAR,
    data_cadastro   TIMESTAMP DEFAULT now(),
    nome            VARCHAR,
    data_nascimento TIMESTAMP,
    -- FIX: no original, "UNIQUE (Nickname, Email, CPF)" era uma única
    -- constraint composta (só bloqueia se os TRÊS valores coincidirem
    -- juntos). Separado em três constraints individuais, que é o que
    -- normalmente se quer para nickname/email/cpf de cadastro.
    UNIQUE (nickname),
    UNIQUE (email),
    UNIQUE (cpf)
);

CREATE TABLE historias (
    id_historia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- FIX: Titulo estava como INTEGER no lógico; título de história é texto.
    titulo      VARCHAR NOT NULL,
    autor       VARCHAR,
    progresso   INTEGER DEFAULT 0,
    km          DECIMAL
);

CREATE TABLE monumentos (
    id_monumentos INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo        VARCHAR,
    descricao     VARCHAR,
    imagem        VARCHAR,
    -- FIX: cord_x/cord_y (DECIMAL) substituídos por um ponto PostGIS,
    -- que permite consultas de distância/proximidade nativas
    -- (ex.: ST_DWithin para "o que está a X metros do jogador").
    localizacao   GEOGRAPHY(POINT, 4326) NOT NULL,
    raio          INTEGER,
    fk_historias  INTEGER
);

CREATE TABLE itens (
    id_item     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR,
    descricao   VARCHAR,
    imagens     VARCHAR,
    -- FIX: cord_x/cord_y (DECIMAL) substituídos por um ponto PostGIS.
    localizacao GEOGRAPHY(POINT, 4326) NOT NULL,
    raio        INTEGER,
    fk_historia INTEGER
);

CREATE TABLE classificacao (
    id_classificacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome             VARCHAR NOT NULL,
    descricao        VARCHAR
);

CREATE TABLE enigma (
    -- FIX: id_enigma estava BOOLEAN PRIMARY KEY no lógico (só permitiria
    -- 2 linhas na tabela inteira). Corrigido para INTEGER/identity.
    id_enigma     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pergunta      VARCHAR,
    desvendado    BOOLEAN DEFAULT FALSE,
    dica          VARCHAR,
    dica_revelada BOOLEAN DEFAULT FALSE,
    fk_historia   INTEGER
);

CREATE TABLE opcoes (
    id_opcao   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    texto      VARCHAR,
    imagem     VARCHAR,
    correto    BOOLEAN DEFAULT FALSE,
    -- FIX: fk_enigmas estava tipado BOOLEAN; precisa casar com o tipo
    -- de enigma.id_enigma (INTEGER) para a FK funcionar.
    fk_enigmas INTEGER
);

-- ---------------------------------------------------------
-- Tabelas associativas (N:N) — cada uma ganhou PK composta,
-- que faltava no lógico original.
-- ---------------------------------------------------------

CREATE TABLE jogador_historias (
    fk_jogador   INTEGER NOT NULL,
    fk_historias INTEGER NOT NULL,
    PRIMARY KEY (fk_jogador, fk_historias)
);

CREATE TABLE inventario (
    fk_itens    INTEGER NOT NULL,
    fk_usuario  INTEGER NOT NULL,
    PRIMARY KEY (fk_itens, fk_usuario)
);

CREATE TABLE visitas (
    fk_monumentos INTEGER NOT NULL,
    fk_jogador    INTEGER NOT NULL,
    PRIMARY KEY (fk_monumentos, fk_jogador)
);

CREATE TABLE historias_classificacao (
    fk_classificacao INTEGER NOT NULL,
    fk_historias      INTEGER NOT NULL,
    PRIMARY KEY (fk_classificacao, fk_historias)
);

-- ---------------------------------------------------------
-- Foreign keys
-- ---------------------------------------------------------

ALTER TABLE monumentos
    ADD CONSTRAINT fk_monumentos_historias
    FOREIGN KEY (fk_historias) REFERENCES historias (id_historia)
    ON DELETE CASCADE;

-- FIX: no lógico, a FK de Itens referenciava (fk_Historias, fk_historia)
-- duplicado contra (ID_Historia, ID_Historia) — mas a tabela Itens só
-- tem a coluna fk_historia. Reduzido para uma FK simples de uma coluna.
ALTER TABLE itens
    ADD CONSTRAINT fk_itens_historias
    FOREIGN KEY (fk_historia) REFERENCES historias (id_historia)
    ON DELETE CASCADE;

ALTER TABLE jogador_historias
    ADD CONSTRAINT fk_jogador_historias_historia
    FOREIGN KEY (fk_historias) REFERENCES historias (id_historia)
    ON DELETE CASCADE;

ALTER TABLE jogador_historias
    ADD CONSTRAINT fk_jogador_historias_jogador
    FOREIGN KEY (fk_jogador) REFERENCES jogador (id_usuario_j)
    ON DELETE CASCADE;

ALTER TABLE inventario
    ADD CONSTRAINT fk_inventario_itens
    FOREIGN KEY (fk_itens) REFERENCES itens (id_item)
    ON DELETE CASCADE;

ALTER TABLE inventario
    ADD CONSTRAINT fk_inventario_jogador
    FOREIGN KEY (fk_usuario) REFERENCES jogador (id_usuario_j)
    ON DELETE CASCADE;

ALTER TABLE visitas
    ADD CONSTRAINT fk_visitas_monumentos
    FOREIGN KEY (fk_monumentos) REFERENCES monumentos (id_monumentos)
    ON DELETE CASCADE;

ALTER TABLE visitas
    ADD CONSTRAINT fk_visitas_jogador
    FOREIGN KEY (fk_jogador) REFERENCES jogador (id_usuario_j)
    ON DELETE CASCADE;

ALTER TABLE historias_classificacao
    ADD CONSTRAINT fk_historias_classificacao_classificacao
    FOREIGN KEY (fk_classificacao) REFERENCES classificacao (id_classificacao)
    ON DELETE CASCADE;

ALTER TABLE historias_classificacao
    ADD CONSTRAINT fk_historias_classificacao_historias
    FOREIGN KEY (fk_historias) REFERENCES historias (id_historia)
    ON DELETE CASCADE;

ALTER TABLE enigma
    ADD CONSTRAINT fk_enigma_historia
    FOREIGN KEY (fk_historia) REFERENCES historias (id_historia)
    ON DELETE CASCADE;

ALTER TABLE opcoes
    ADD CONSTRAINT fk_opcoes_enigma
    FOREIGN KEY (fk_enigmas) REFERENCES enigma (id_enigma)
    ON DELETE CASCADE;

-- ---------------------------------------------------------
-- Índices espaciais (GIST) — recomendado sempre que houver
-- consultas por proximidade/distância nas colunas geography.
-- ---------------------------------------------------------

CREATE INDEX idx_monumentos_localizacao ON monumentos USING GIST (localizacao);
CREATE INDEX idx_itens_localizacao ON itens USING GIST (localizacao);

-- ---------------------------------------------------------
-- NÃO incluída: ALTER TABLE Historias ADD CONSTRAINT FK_Historias_2
-- FOREIGN KEY (ClassIndicativa???) REFERENCES ??? (???);
-- Confirmado como resquício duplicado da relação N:N já coberta por
-- historias_classificacao — removida do esquema físico.
-- ---------------------------------------------------------