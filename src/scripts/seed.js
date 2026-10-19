const { client, connectDb } = require('../config/db');

const pessoa1 = {
  nome: 'João Victor de Oliveira Chaves',
  email: 'joao.chaves@email.com',
  telefone: '(81) 99999-1234',
  cidade: 'Recife',
  estado: 'PE',
  pais: 'Brasil',
  linkedin: 'https://linkedin.com/in/joaovictor',
  github: 'https://github.com/joaovictor',
  resumo: 'Desenvolvedor full stack com foco em APIs, integração e experiência de usuário.',
  objetivo: 'Buscar oportunidades para crescer como desenvolvedor backend e full stack.',
};

const pessoa2 = {
  nome: 'Maria Eduarda Silva',
  email: 'maria.silva@email.com',
  telefone: '(81) 98888-5678',
  cidade: 'Recife',
  estado: 'PE',
  pais: 'Brasil',
  linkedin: 'https://linkedin.com/in/maria-eduarda',
  github: 'https://github.com/mariaedu',
  resumo: 'Analista de sistemas com interesse em arquitetura de software e dados.',
  objetivo: 'Contribuir em projetos de tecnologia com foco em inovação e qualidade.',
};

async function insertPessoa(person) {
  const result = await client.query(
    `
      INSERT INTO pessoas (nome, email, telefone, cidade, estado, pais, linkedin, github, resumo, objetivo)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id;
    `,
    [
      person.nome,
      person.email,
      person.telefone,
      person.cidade,
      person.estado,
      person.pais,
      person.linkedin,
      person.github,
      person.resumo,
      person.objetivo,
    ],
  );

  return result.rows[0].id;
}

async function insertExperienciasAcademicas(pessoaId) {
  await client.query(
    `
      INSERT INTO experiencias_academicas (pessoa_id, instituicao, curso, tipo, inicio, fim, descricao)
      VALUES
        ($1, 'Universidade de Pernambuco', 'Bacharelado em Sistemas de Informação', 'Graduação', '2021-02-01', '2025-12-01', 'Formação em desenvolvimento de software, banco de dados e arquitetura de sistemas.'),
        ($1, 'Instituto Federal de Pernambuco', 'Técnico em Informática', 'Técnico', '2018-02-01', '2020-12-01', 'Estudo de lógica, programação e manutenção de computadores.');
    `,
    [pessoaId],
  );
}

async function insertExperienciasProfissionais(pessoaId) {
  await client.query(
    `
      INSERT INTO experiencias_profissionais (pessoa_id, empresa, cargo, tipo, inicio, fim, descricao)
      VALUES
        ($1, 'HIDRAPE Tecnologia', 'Desenvolvedor Full Stack', 'CLT', '2023-01-01', '2025-12-01', 'Responsável por APIs REST, interfaces em React e integração com banco de dados.'),
        ($1, 'Startup Digital', 'Estagiário de Desenvolvimento', 'Estágio', '2022-01-01', '2022-12-01', 'Apoio em manutenção de sistemas web, testes e documentação técnica.');
    `,
    [pessoaId],
  );
}

async function insertHabilidades(pessoaId) {
  await client.query(
    `
      INSERT INTO habilidades (pessoa_id, nome, categoria, nivel)
      VALUES
        ($1, 'JavaScript', 'Linguagem', 'Avançado'),
        ($1, 'Node.js', 'Backend', 'Avançado'),
        ($1, 'Express', 'Backend', 'Avançado'),
        ($1, 'PostgreSQL', 'Banco de Dados', 'Intermediário'),
        ($1, 'React', 'Frontend', 'Intermediário');
    `,
    [pessoaId],
  );
}

async function insertCertificados(pessoaId) {
  await client.query(
    `
      INSERT INTO certificados (pessoa_id, nome, instituicao, data_emissao, validade, url)
      VALUES
        ($1, 'Desenvolvimento Web Moderno', 'Alura', '2024-03-15', null, 'https://www.alura.com.br/'),
        ($1, 'Node.js para APIs', 'Udemy', '2025-01-10', null, 'https://www.udemy.com/');
    `,
    [pessoaId],
  );
}

async function insertProjetos(pessoaId) {
  const result = await client.query(
    `
      INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, tecnologias, ano, destaque)
      VALUES
        ($1, 'Sistema de Gestão de Estoque', 'Aplicação para controle de produtos, fornecedores e relatórios.', 'https://exemplo.com/estoque', 'https://github.com/exemplo/estoque', 'Node.js, PostgreSQL, React', 2024, true),
        ($1, 'Dashboard Analítico', 'Painel de indicadores e métricas para operação.', 'https://exemplo.com/dashboard', 'https://github.com/exemplo/dashboard', 'JavaScript, Express, SQL', 2025, false)
      RETURNING id;
    `,
    [pessoaId],
  );

  return result.rows;
}

async function addProjetoTecnologias(projetos) {
  for (const projeto of projetos) {
    await client.query(
      `
        INSERT INTO projeto_tecnologias (projeto_id, tecnologia)
        VALUES ($1, 'Node.js'), ($1, 'PostgreSQL'), ($1, 'React');
      `,
      [projeto.id],
    );
  }
}

async function seedData() {
  const ids = [];
  ids.push(await insertPessoa(pessoa1));
  ids.push(await insertPessoa(pessoa2));

  for (const id of ids) {
    await insertExperienciasAcademicas(id);
    await insertExperienciasProfissionais(id);
    await insertHabilidades(id);
    await insertCertificados(id);
    const projetos = await insertProjetos(id);
    await addProjetoTecnologias(projetos);
  }

  console.log('DOIS currículos foram cadastrados com sucesso.');
}

(async () => {
  try {
    await connectDb();
    await seedData();
  } catch (error) {
    console.error('Erro ao popular dados:', error.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
