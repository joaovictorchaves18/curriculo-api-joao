const { client, connectDb } = require('../config/db');

const schemaSql = `
  DROP TABLE IF EXISTS experiencia_profissional_tecnologias;
  DROP TABLE IF EXISTS projeto_tecnologias;
  DROP TABLE IF EXISTS certificados;
  DROP TABLE IF EXISTS habilidades;
  DROP TABLE IF EXISTS experiencias_profissionais;
  DROP TABLE IF EXISTS experiencias_academicas;
  DROP TABLE IF EXISTS projetos;
  DROP TABLE IF EXISTS pessoas;

  CREATE TABLE pessoas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    telefone VARCHAR(50),
    cidade VARCHAR(100),
    estado VARCHAR(100),
    pais VARCHAR(100),
    linkedin VARCHAR(255),
    github VARCHAR(255),
    resumo TEXT,
    objetivo TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE experiencias_academicas (
    id SERIAL PRIMARY KEY,
    pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    instituicao VARCHAR(200) NOT NULL,
    curso VARCHAR(200) NOT NULL,
    tipo VARCHAR(80) NOT NULL,
    inicio DATE,
    fim DATE,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE experiencias_profissionais (
    id SERIAL PRIMARY KEY,
    pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    empresa VARCHAR(200) NOT NULL,
    cargo VARCHAR(200) NOT NULL,
    tipo VARCHAR(80) DEFAULT 'CLT',
    inicio DATE,
    fim DATE,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE habilidades (
    id SERIAL PRIMARY KEY,
    pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(80),
    nivel VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE certificados (
    id SERIAL PRIMARY KEY,
    pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    instituicao VARCHAR(200),
    data_emissao DATE,
    validade DATE,
    url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE projetos (
    id SERIAL PRIMARY KEY,
    pessoa_id INTEGER NOT NULL REFERENCES pessoas(id) ON DELETE CASCADE,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    url VARCHAR(255),
    repositorio VARCHAR(255),
    tecnologias TEXT,
    ano INTEGER,
    destaque BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE projeto_tecnologias (
    id SERIAL PRIMARY KEY,
    projeto_id INTEGER NOT NULL REFERENCES projetos(id) ON DELETE CASCADE,
    tecnologia VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );

  CREATE TABLE experiencia_profissional_tecnologias (
    id SERIAL PRIMARY KEY,
    experiencia_profissional_id INTEGER NOT NULL REFERENCES experiencias_profissionais(id) ON DELETE CASCADE,
    tecnologia VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  );
`;

(async () => {
  try {
    await connectDb();
    await client.query(schemaSql);
    console.log('Schema do currículo criado com sucesso.');
  } catch (error) {
    console.error('Erro ao criar schema:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
