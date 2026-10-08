/* =========================================================
   Ataîru — Esquema físico PostgreSQL (versão revisada)
   Convertido a partir do modelo lógico.
   Ajustes da conversão estão comentados inline com "-- FIX:"
   Ajustes da revisão do esquema estão com "-- REV:"
   ========================================================= */

CREATE EXTENSION IF NOT EXISTS postgis;

-- ---------------------------------------------------------
-- Tabelas base
-- ---------------------------------------------------------

CREATE TABLE administrador (
    id_usuario_a    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email           VARCHAR(254) NOT NULL,
    senha           VARCHAR NOT NULL,
    cpf             VARCHAR(11),
    avatar          VARCHAR,
    data_cadastro   TIMESTAMP DEFAULT now(),
    nome            VARCHAR,
    data_nascimento DATE,
    termo_aceito_em TIMESTAMP,   -- vírgula adicionada

    UNIQUE (email),
    UNIQUE (cpf)
);

CREATE TABLE jogador (
    id_usuario_j    INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nickname        VARCHAR NOT NULL,
    km              DECIMAL DEFAULT 0,
    banido          BOOLEAN DEFAULT FALSE,
    email           VARCHAR(254) NOT NULL,
    senha           VARCHAR NOT NULL,
    cpf             VARCHAR(11),
    avatar          VARCHAR,
    data_cadastro   TIMESTAMP DEFAULT now(),
    nome            VARCHAR,
    data_nascimento DATE,
    -- REV (RN07): momento em que o jogador aceitou o termo de segurança.
    -- NULL = ainda não aceitou.
    termo_aceito_em TIMESTAMP,
    -- FIX: no original, "UNIQUE (Nickname, Email, CPF)" era uma única
    -- constraint composta (só bloqueia se os TRÊS valores coincidirem
    -- juntos). Separado em três constraints individuais.
    UNIQUE (nickname),
    UNIQUE (email),
    UNIQUE (cpf)
);

CREATE TABLE historias (
    id_historia INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    -- FIX: Titulo estava como INTEGER no lógico; título é texto.
    titulo      VARCHAR NOT NULL,
    autor       VARCHAR,
    km          DECIMAL,
    -- REV (RF12): controla a visibilidade da história para os jogadores.
    publicada   BOOLEAN DEFAULT FALSE
    -- REV: a coluna "progresso" foi removida. O progresso é por jogador
    -- e é calculado pela quantidade de pistas (itens) encontradas,
    -- veja a view progresso_jogador no final do script.
);

CREATE TABLE monumentos (
    id_monumentos INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo        VARCHAR,
    descricao     VARCHAR,
    imagem        VARCHAR,
    -- FIX: cord_x/cord_y (DECIMAL) substituídos por um ponto PostGIS.
    localizacao   GEOGRAPHY(POINT, 4326) NOT NULL,
    raio          INTEGER,
    -- REV (RN05): janela de funcionamento do local. NULL = sem restrição.
    abertura      TIME,
    fechamento    TIME,
    fk_historias  INTEGER NOT NULL
);

CREATE TABLE itens (
    id_item     INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome        VARCHAR,
    descricao   VARCHAR,
    imagens     VARCHAR,
    -- FIX: cord_x/cord_y (DECIMAL) substituídos por um ponto PostGIS.
    localizacao GEOGRAPHY(POINT, 4326) NOT NULL,
    raio        INTEGER,
    -- REV (RN05): janela de funcionamento do local. NULL = sem restrição.
    abertura    TIME,
    fechamento  TIME,
    fk_historia INTEGER NOT NULL
);

CREATE TABLE classificacao (
    id_classificacao INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome             VARCHAR NOT NULL,
    descricao        VARCHAR
);

CREATE TABLE enigma (
    -- FIX: id_enigma estava BOOLEAN PRIMARY KEY no lógico (só permitiria
    -- 2 linhas na tabela inteira). Corrigido para INTEGER/identity.
    id_enigma   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    pergunta    VARCHAR,
    dica        VARCHAR,
    fk_historia INTEGER NOT NULL
    -- REV: "desvendado" e "dica_revelada" saíram daqui. Esses estados
    -- são por jogador (senão, um jogador resolver o enigma o marcaria
    -- como resolvido para todos). Ver tabela jogador_enigma.
);

CREATE TABLE opcoes (
    id_opcao   INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    texto      VARCHAR,
    imagem     VARCHAR,
    correto    BOOLEAN DEFAULT FALSE,
    -- FIX: fk_enigmas estava BOOLEAN; precisa casar com enigma.id_enigma.
    fk_enigmas INTEGER NOT NULL
);

-- REV (RN11): registro de modificações feitas pelos administradores nas
-- histórias. As FKs usam SET NULL (e não CASCADE) para que o registro
-- sobreviva à exclusão da história ou do administrador.
CREATE TABLE historia_logs (
    id_log           INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    fk_historia      INTEGER,
    fk_administrador INTEGER,
    acao             VARCHAR NOT NULL,
    data_hora        TIMESTAMP DEFAULT now()
);

-- ---------------------------------------------------------
-- Tabelas associativas (N:N) — cada uma com PK composta.
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
    fk_historias     INTEGER NOT NULL,
    PRIMARY KEY (fk_classificacao, fk_historias)
);

-- REV: estado do enigma por jogador (resolvido? dica revelada?).
CREATE TABLE jogador_enigma (
    fk_jogador    INTEGER NOT NULL,
    fk_enigma     INTEGER NOT NULL,
    desvendado    BOOLEAN DEFAULT FALSE,
    dica_revelada BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (fk_jogador, fk_enigma)
);

-- ---------------------------------------------------------
-- Foreign keys
-- ---------------------------------------------------------

ALTER TABLE monumentos
    ADD CONSTRAINT fk_monumentos_historias
    FOREIGN KEY (fk_historias) REFERENCES historias (id_historia)
    ON DELETE CASCADE;

-- FIX: FK de itens reduzida a uma FK simples de uma coluna.
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

ALTER TABLE jogador_enigma
    ADD CONSTRAINT fk_jogador_enigma_jogador
    FOREIGN KEY (fk_jogador) REFERENCES jogador (id_usuario_j)
    ON DELETE CASCADE;

ALTER TABLE jogador_enigma
    ADD CONSTRAINT fk_jogador_enigma_enigma
    FOREIGN KEY (fk_enigma) REFERENCES enigma (id_enigma)
    ON DELETE CASCADE;

ALTER TABLE historia_logs
    ADD CONSTRAINT fk_historia_logs_historia
    FOREIGN KEY (fk_historia) REFERENCES historias (id_historia)
    ON DELETE SET NULL;

ALTER TABLE historia_logs
    ADD CONSTRAINT fk_historia_logs_administrador
    FOREIGN KEY (fk_administrador) REFERENCES administrador (id_usuario_a)
    ON DELETE SET NULL;

-- ---------------------------------------------------------
-- Índices espaciais (GIST) — para consultas por proximidade.
-- ---------------------------------------------------------

CREATE INDEX idx_monumentos_localizacao ON monumentos USING GIST (localizacao);
CREATE INDEX idx_itens_localizacao ON itens USING GIST (localizacao);

-- ---------------------------------------------------------
-- REV: progresso por jogador/história, medido pela quantidade de
-- pistas (itens) coletadas em relação ao total da história.
-- Como é calculado, não existe coluna para ele (evita dado duplicado
-- que poderia ficar inconsistente com o inventário).
-- ---------------------------------------------------------

CREATE VIEW progresso_jogador AS
SELECT
    jh.fk_jogador,
    jh.fk_historias,
    COUNT(inv.fk_itens) AS itens_coletados,
    COUNT(i.id_item)    AS total_itens,
    ROUND(100.0 * COUNT(inv.fk_itens) / NULLIF(COUNT(i.id_item), 0), 1)
                        AS percentual
FROM jogador_historias jh
LEFT JOIN itens i
       ON i.fk_historia = jh.fk_historias
LEFT JOIN inventario inv
       ON inv.fk_itens = i.id_item
      AND inv.fk_usuario = jh.fk_jogador
GROUP BY jh.fk_jogador, jh.fk_historias;