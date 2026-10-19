const express = require('express');
const cors = require('cors');
const { connectDb, client } = require('./config/db');
const { ok, created, badRequest } = require('./utils/response');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  ok(res, {
    message: 'API de currículo ativa.',
    version: '1.0.0',
    endpoints: [
      '/pessoas',
      '/pessoas/:id/experiencias-academicas',
      '/pessoas/:id/experiencias-profissionais',
      '/pessoas/:id/habilidades',
      '/pessoas/:id/certificados',
      '/pessoas/:id/projetos',
    ],
  });
});

function parseIdParam(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return badRequest(res, 'O parâmetro id deve ser um número inteiro maior que zero.');
  }
  next();
}

async function getPersonById(id) {
  const result = await client.query('SELECT * FROM pessoas WHERE id = $1', [id]);
  return result.rows[0] || null;
}

app.get('/pessoas', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM pessoas ORDER BY id');
    ok(res, result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar pessoas.', error: error.message });
  }
});

app.post('/pessoas', async (req, res) => {
  const dados = req.body || {};
  const { nome, email, telefone, cidade, estado, pais, linkedin, github, resumo, objetivo } = dados;

  if (!nome || !nome.trim()) {
    return badRequest(res, 'O campo nome é obrigatório.');
  }

  try {
    const result = await client.query(
      `INSERT INTO pessoas (nome, email, telefone, cidade, estado, pais, linkedin, github, resumo, objetivo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *;`,
      [nome, email || null, telefone || null, cidade || null, estado || null, pais || null, linkedin || null, github || null, resumo || null, objetivo || null],
    );
    created(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar pessoa.', error: error.message });
  }
});

app.get('/pessoas/:id', parseIdParam, async (req, res) => {
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada.' });
    }
    ok(res, pessoa);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar pessoa.', error: error.message });
  }
});

app.put('/pessoas/:id', parseIdParam, async (req, res) => {
  const { nome, email, telefone, cidade, estado, pais, linkedin, github, resumo, objetivo } = req.body || {};

  try {
    const result = await client.query(
      `UPDATE pessoas SET
        nome = COALESCE($1, nome),
        email = COALESCE($2, email),
        telefone = COALESCE($3, telefone),
        cidade = COALESCE($4, cidade),
        estado = COALESCE($5, estado),
        pais = COALESCE($6, pais),
        linkedin = COALESCE($7, linkedin),
        github = COALESCE($8, github),
        resumo = COALESCE($9, resumo),
        objetivo = COALESCE($10, objetivo),
        updated_at = NOW()
       WHERE id = $11
       RETURNING *;`,
      [nome ?? null, email ?? null, telefone ?? null, cidade ?? null, estado ?? null, pais ?? null, linkedin ?? null, github ?? null, resumo ?? null, objetivo ?? null, req.params.id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pessoa não encontrada.' });
    }
    ok(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pessoa.', error: error.message });
  }
});

app.delete('/pessoas/:id', parseIdParam, async (req, res) => {
  try {
    const result = await client.query('DELETE FROM pessoas WHERE id = $1 RETURNING id;', [req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pessoa não encontrada.' });
    }
    ok(res, { message: 'Pessoa removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover pessoa.', error: error.message });
  }
});

app.get('/pessoas/:id/experiencias-academicas', parseIdParam, async (req, res) => {
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada.' });
    }
    const result = await client.query('SELECT * FROM experiencias_academicas WHERE pessoa_id = $1 ORDER BY inicio DESC, id', [req.params.id]);
    ok(res, result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar experiências acadêmicas.', error: error.message });
  }
});

app.post('/pessoas/:id/experiencias-academicas', parseIdParam, async (req, res) => {
  const { instituicao, curso, tipo, inicio, fim, descricao } = req.body || {};
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) {
      return res.status(404).json({ message: 'Pessoa não encontrada.' });
    }
    const result = await client.query(
      `INSERT INTO experiencias_academicas (pessoa_id, instituicao, curso, tipo, inicio, fim, descricao)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [req.params.id, instituicao, curso, tipo, inicio || null, fim || null, descricao || null],
    );
    created(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar experiência acadêmica.', error: error.message });
  }
});

app.put('/pessoas/:id/experiencias-academicas/:experienciaId', parseIdParam, async (req, res) => {
  const { instituicao, curso, tipo, inicio, fim, descricao } = req.body || {};
  try {
    const result = await client.query(
      `UPDATE experiencias_academicas SET
        instituicao = COALESCE($1, instituicao),
        curso = COALESCE($2, curso),
        tipo = COALESCE($3, tipo),
        inicio = COALESCE($4, inicio),
        fim = COALESCE($5, fim),
        descricao = COALESCE($6, descricao),
        updated_at = NOW()
       WHERE id = $7 AND pessoa_id = $8
       RETURNING *;`,
      [instituicao ?? null, curso ?? null, tipo ?? null, inicio ?? null, fim ?? null, descricao ?? null, req.params.experienciaId, req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Experiência acadêmica não encontrada.' });
    }
    ok(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar experiência acadêmica.', error: error.message });
  }
});

app.delete('/pessoas/:id/experiencias-academicas/:experienciaId', parseIdParam, async (req, res) => {
  try {
    const result = await client.query('DELETE FROM experiencias_academicas WHERE id = $1 AND pessoa_id = $2 RETURNING id;', [req.params.experienciaId, req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Experiência acadêmica não encontrada.' });
    }
    ok(res, { message: 'Experiência acadêmica removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover experiência acadêmica.', error: error.message });
  }
});

app.get('/pessoas/:id/experiencias-profissionais', parseIdParam, async (req, res) => {
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });
    const result = await client.query('SELECT * FROM experiencias_profissionais WHERE pessoa_id = $1 ORDER BY inicio DESC, id', [req.params.id]);
    ok(res, result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar experiências profissionais.', error: error.message });
  }
});

app.post('/pessoas/:id/experiencias-profissionais', parseIdParam, async (req, res) => {
  const { empresa, cargo, tipo, inicio, fim, descricao } = req.body || {};
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });
    const result = await client.query(
      `INSERT INTO experiencias_profissionais (pessoa_id, empresa, cargo, tipo, inicio, fim, descricao)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;`,
      [req.params.id, empresa, cargo, tipo || 'CLT', inicio || null, fim || null, descricao || null],
    );
    created(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar experiência profissional.', error: error.message });
  }
});

app.put('/pessoas/:id/experiencias-profissionais/:experienciaId', parseIdParam, async (req, res) => {
  const { empresa, cargo, tipo, inicio, fim, descricao } = req.body || {};
  try {
    const result = await client.query(
      `UPDATE experiencias_profissionais SET
        empresa = COALESCE($1, empresa),
        cargo = COALESCE($2, cargo),
        tipo = COALESCE($3, tipo),
        inicio = COALESCE($4, inicio),
        fim = COALESCE($5, fim),
        descricao = COALESCE($6, descricao),
        updated_at = NOW()
       WHERE id = $7 AND pessoa_id = $8
       RETURNING *;`,
      [empresa ?? null, cargo ?? null, tipo ?? null, inicio ?? null, fim ?? null, descricao ?? null, req.params.experienciaId, req.params.id],
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Experiência profissional não encontrada.' });
    }
    ok(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar experiência profissional.', error: error.message });
  }
});

app.delete('/pessoas/:id/experiencias-profissionais/:experienciaId', parseIdParam, async (req, res) => {
  try {
    const result = await client.query('DELETE FROM experiencias_profissionais WHERE id = $1 AND pessoa_id = $2 RETURNING id;', [req.params.experienciaId, req.params.id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Experiência profissional não encontrada.' });
    }
    ok(res, { message: 'Experiência profissional removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover experiência profissional.', error: error.message });
  }
});

app.get('/pessoas/:id/habilidades', parseIdParam, async (req, res) => {
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });
    const result = await client.query('SELECT * FROM habilidades WHERE pessoa_id = $1 ORDER BY id', [req.params.id]);
    ok(res, result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar habilidades.', error: error.message });
  }
});

app.post('/pessoas/:id/habilidades', parseIdParam, async (req, res) => {
  const { nome, categoria, nivel } = req.body || {};
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });
    const result = await client.query(
      `INSERT INTO habilidades (pessoa_id, nome, categoria, nivel)
       VALUES ($1, $2, $3, $4) RETURNING *;`,
      [req.params.id, nome, categoria || null, nivel || null],
    );
    created(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar habilidade.', error: error.message });
  }
});

app.put('/pessoas/:id/habilidades/:habilidadeId', parseIdParam, async (req, res) => {
  const { nome, categoria, nivel } = req.body || {};
  try {
    const result = await client.query(
      `UPDATE habilidades SET
        nome = COALESCE($1, nome),
        categoria = COALESCE($2, categoria),
        nivel = COALESCE($3, nivel),
        updated_at = NOW()
       WHERE id = $4 AND pessoa_id = $5
       RETURNING *;`,
      [nome ?? null, categoria ?? null, nivel ?? null, req.params.habilidadeId, req.params.id],
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Habilidade não encontrada.' });
    ok(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar habilidade.', error: error.message });
  }
});

app.delete('/pessoas/:id/habilidades/:habilidadeId', parseIdParam, async (req, res) => {
  try {
    const result = await client.query('DELETE FROM habilidades WHERE id = $1 AND pessoa_id = $2 RETURNING id;', [req.params.habilidadeId, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Habilidade não encontrada.' });
    ok(res, { message: 'Habilidade removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover habilidade.', error: error.message });
  }
});

app.get('/pessoas/:id/certificados', parseIdParam, async (req, res) => {
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });
    const result = await client.query('SELECT * FROM certificados WHERE pessoa_id = $1 ORDER BY data_emissao DESC, id', [req.params.id]);
    ok(res, result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar certificados.', error: error.message });
  }
});

app.post('/pessoas/:id/certificados', parseIdParam, async (req, res) => {
  const { nome, instituicao, data_emissao, validade, url } = req.body || {};
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });
    const result = await client.query(
      `INSERT INTO certificados (pessoa_id, nome, instituicao, data_emissao, validade, url)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
      [req.params.id, nome, instituicao || null, data_emissao || null, validade || null, url || null],
    );
    created(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar certificado.', error: error.message });
  }
});

app.put('/pessoas/:id/certificados/:certificadoId', parseIdParam, async (req, res) => {
  const { nome, instituicao, data_emissao, validade, url } = req.body || {};
  try {
    const result = await client.query(
      `UPDATE certificados SET
        nome = COALESCE($1, nome),
        instituicao = COALESCE($2, instituicao),
        data_emissao = COALESCE($3, data_emissao),
        validade = COALESCE($4, validade),
        url = COALESCE($5, url),
        updated_at = NOW()
       WHERE id = $6 AND pessoa_id = $7
       RETURNING *;`,
      [nome ?? null, instituicao ?? null, data_emissao ?? null, validade ?? null, url ?? null, req.params.certificadoId, req.params.id],
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Certificado não encontrado.' });
    ok(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar certificado.', error: error.message });
  }
});

app.delete('/pessoas/:id/certificados/:certificadoId', parseIdParam, async (req, res) => {
  try {
    const result = await client.query('DELETE FROM certificados WHERE id = $1 AND pessoa_id = $2 RETURNING id;', [req.params.certificadoId, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Certificado não encontrado.' });
    ok(res, { message: 'Certificado removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover certificado.', error: error.message });
  }
});

app.get('/pessoas/:id/projetos', parseIdParam, async (req, res) => {
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });
    const result = await client.query('SELECT * FROM projetos WHERE pessoa_id = $1 ORDER BY ano DESC, id', [req.params.id]);
    ok(res, result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar projetos.', error: error.message });
  }
});

app.post('/pessoas/:id/projetos', parseIdParam, async (req, res) => {
  const { nome, descricao, url, repositorio, tecnologias, ano, destaque } = req.body || {};
  try {
    const pessoa = await getPersonById(req.params.id);
    if (!pessoa) return res.status(404).json({ message: 'Pessoa não encontrada.' });
    const result = await client.query(
      `INSERT INTO projetos (pessoa_id, nome, descricao, url, repositorio, tecnologias, ano, destaque)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [req.params.id, nome, descricao || null, url || null, repositorio || null, tecnologias || null, ano || null, destaque || false],
    );
    created(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar projeto.', error: error.message });
  }
});

app.put('/pessoas/:id/projetos/:projetoId', parseIdParam, async (req, res) => {
  const { nome, descricao, url, repositorio, tecnologias, ano, destaque } = req.body || {};
  try {
    const result = await client.query(
      `UPDATE projetos SET
        nome = COALESCE($1, nome),
        descricao = COALESCE($2, descricao),
        url = COALESCE($3, url),
        repositorio = COALESCE($4, repositorio),
        tecnologias = COALESCE($5, tecnologias),
        ano = COALESCE($6, ano),
        destaque = COALESCE($7, destaque),
        updated_at = NOW()
       WHERE id = $8 AND pessoa_id = $9
       RETURNING *;`,
      [nome ?? null, descricao ?? null, url ?? null, repositorio ?? null, tecnologias ?? null, ano ?? null, destaque ?? null, req.params.projetoId, req.params.id],
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Projeto não encontrado.' });
    ok(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar projeto.', error: error.message });
  }
});

app.delete('/pessoas/:id/projetos/:projetoId', parseIdParam, async (req, res) => {
  try {
    const result = await client.query('DELETE FROM projetos WHERE id = $1 AND pessoa_id = $2 RETURNING id;', [req.params.projetoId, req.params.id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Projeto não encontrado.' });
    ok(res, { message: 'Projeto removido com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover projeto.', error: error.message });
  }
});

app.get('/pessoas/:id/projetos/:projetoId/tecnologias', parseIdParam, async (req, res) => {
  try {
    const result = await client.query(
      `SELECT pt.* FROM projeto_tecnologias pt
       JOIN projetos p ON p.id = pt.projeto_id
       WHERE p.pessoa_id = $1 AND pt.projeto_id = $2
       ORDER BY pt.id;`,
      [req.params.id, req.params.projetoId],
    );
    ok(res, result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar tecnologias do projeto.', error: error.message });
  }
});

app.post('/pessoas/:id/projetos/:projetoId/tecnologias', parseIdParam, async (req, res) => {
  const { tecnologia } = req.body || {};
  if (!tecnologia || !tecnologia.trim()) {
    return badRequest(res, 'O campo tecnologia é obrigatório.');
  }
  try {
    const result = await client.query(
      `INSERT INTO projeto_tecnologias (projeto_id, tecnologia) VALUES ($1, $2) RETURNING *;`,
      [req.params.projetoId, tecnologia],
    );
    created(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tecnologia do projeto.', error: error.message });
  }
});

app.delete('/pessoas/:id/projetos/:projetoId/tecnologias/:tecnologiaId', parseIdParam, async (req, res) => {
  try {
    const result = await client.query(
      `DELETE FROM projeto_tecnologias pt
       USING projetos p
       WHERE pt.id = $1 AND pt.projeto_id = $2 AND p.id = pt.projeto_id AND p.pessoa_id = $3
       RETURNING pt.id;`,
      [req.params.tecnologiaId, req.params.projetoId, req.params.id],
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Tecnologia do projeto não encontrada.' });
    ok(res, { message: 'Tecnologia removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover tecnologia do projeto.', error: error.message });
  }
});

app.get('/pessoas/:id/experiencias-profissionais/:experienciaId/tecnologias', parseIdParam, async (req, res) => {
  try {
    const result = await client.query(
      `SELECT et.* FROM experiencia_profissional_tecnologias et
       JOIN experiencias_profissionais ep ON ep.id = et.experiencia_profissional_id
       WHERE ep.pessoa_id = $1 AND et.experiencia_profissional_id = $2
       ORDER BY et.id;`,
      [req.params.id, req.params.experienciaId],
    );
    ok(res, result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar tecnologias da experiência profissional.', error: error.message });
  }
});

app.post('/pessoas/:id/experiencias-profissionais/:experienciaId/tecnologias', parseIdParam, async (req, res) => {
  const { tecnologia } = req.body || {};
  if (!tecnologia || !tecnologia.trim()) {
    return badRequest(res, 'O campo tecnologia é obrigatório.');
  }
  try {
    const result = await client.query(
      `INSERT INTO experiencia_profissional_tecnologias (experiencia_profissional_id, tecnologia)
       VALUES ($1, $2) RETURNING *;`,
      [req.params.experienciaId, tecnologia],
    );
    created(res, result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar tecnologia da experiência profissional.', error: error.message });
  }
});

app.delete('/pessoas/:id/experiencias-profissionais/:experienciaId/tecnologias/:tecnologiaId', parseIdParam, async (req, res) => {
  try {
    const result = await client.query(
      `DELETE FROM experiencia_profissional_tecnologias et
       USING experiencias_profissionais ep
       WHERE et.id = $1 AND et.experiencia_profissional_id = $2 AND ep.id = et.experiencia_profissional_id AND ep.pessoa_id = $3
       RETURNING et.id;`,
      [req.params.tecnologiaId, req.params.experienciaId, req.params.id],
    );
    if (result.rowCount === 0) return res.status(404).json({ message: 'Tecnologia da experiência profissional não encontrada.' });
    ok(res, { message: 'Tecnologia removida com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover tecnologia da experiência profissional.', error: error.message });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
