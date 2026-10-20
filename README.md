# API REST de Currículo (Express + PostgreSQL / NeonDB)

Projeto desenvolvido para a disciplina de **Arquitetura Orientada a Serviços (AOS)** da **UNICAP**, utilizando exatamente a arquitetura em camadas (`models`, `services`, `controllers`, `routes`, `middlewares`, `utils`), Babel, Express 5 e Sequelize com PostgreSQL (NeonDB).

## Entidades e Relacionamentos

1. **Pessoa (`pessoas`)**: Dados principais do titular do currículo (`id`, `nome`, `titulo`, `resumo`, `email`, `telefone`, `linkedin`, `github`).
2. **Experiência Acadêmica (`experienciasAcademicas`)**: Relacionamento `1:N` com `Pessoa` (`pessoaId`).
3. **Experiência Profissional (`experienciasProfissionais`)**: Relacionamento `1:N` com `Pessoa` (`pessoaId`).
4. **Projeto (`projetos`)**: Relacionamento `1:N` com `Pessoa` (`pessoaId`).
5. **Habilidade (`habilidades`)**: Relacionamento `1:N` com `Pessoa` (`pessoaId`).

## Rotas da API

### Pessoas (`/pessoas`)
- `GET /pessoas` - Lista todos os currículos com seus relacionamentos inclusos.
- `GET /pessoas/:pessoaId` - Busca uma pessoa específica pelo ID com todos os relacionamentos.
- `POST /pessoas` - Cria um novo currículo de pessoa.
- `PUT /pessoas/:pessoaId` - Atualiza os dados de uma pessoa.
- `DELETE /pessoas/:pessoaId` - Remove uma pessoa e seus itens associados (`CASCADE`).

### Rotas de Relacionamento de Pessoa
- `GET /pessoas/:pessoaId/experiencias-academicas`
- `GET /pessoas/:pessoaId/experiencias-profissionais`
- `GET /pessoas/:pessoaId/projetos`
- `GET /pessoas/:pessoaId/habilidades`

### Experiências Acadêmicas (`/experiencias-academicas`)
- `GET /experiencias-academicas` (aceita filtro opcional `?pessoaId=...`)
- `GET /experiencias-academicas/:experienciaId`
- `POST /experiencias-academicas`
- `PUT /experiencias-academicas/:experienciaId`
- `DELETE /experiencias-academicas/:experienciaId`

### Experiências Profissionais (`/experiencias-profissionais`)
- `GET /experiencias-profissionais` (aceita filtro opcional `?pessoaId=...`)
- `GET /experiencias-profissionais/:experienciaId`
- `POST /experiencias-profissionais`
- `PUT /experiencias-profissionais/:experienciaId`
- `DELETE /experiencias-profissionais/:experienciaId`

### Projetos (`/projetos`)
- `GET /projetos` (aceita filtro opcional `?pessoaId=...`)
- `GET /projetos/:projetoId`
- `POST /projetos`
- `PUT /projetos/:projetoId`
- `DELETE /projetos/:projetoId`

### Habilidades (`/habilidades`)
- `GET /habilidades` (aceita filtro opcional `?pessoaId=...`)
- `GET /habilidades/:habilidadeId`
- `POST /habilidades`
- `PUT /habilidades/:habilidadeId`
- `DELETE /habilidades/:habilidadeId`

## Como executar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` na raiz (baseado no `.env.sample`) apontando para o seu banco no **NeonDB**:
   ```env
   DATABASE_URL=postgresql://usuario:senha@ep-exemplo.us-east-2.aws.neon.tech/neondb?sslmode=require
   SYNC_DATABASE=true
   ERASE_DATABASE_ON_SYNC=true
   ```
   > Com `ERASE_DATABASE_ON_SYNC=true` na primeira execução, o servidor criará as tabelas e cadastrará automaticamente o currículo completo de **DUAS pessoas** no NeonDB. Depois de popular o banco, mude `ERASE_DATABASE_ON_SYNC=false`.
3. Execute em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Para gerar o build para a Vercel:
   ```bash
   npm run build
   ```
