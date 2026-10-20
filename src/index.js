import "dotenv/config";
import express from "express";
import models, { sequelize } from "./models/index.js";
import {
  corsMiddleware,
  logMiddleware,
  notFoundMiddleware,
  errorMiddleware,
} from "./middlewares/index.js";
import * as routes from "./routes/index.js";

const app = express();

app.set("trust proxy", true);

// middlewares
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);

// rotas
app.get("/", (req, res) => {
  return res.send("API REST de Currículo executando...");
});
app.use("/pessoas", routes.pessoa);
app.use("/experiencias-academicas", routes.experienciaAcademica);
app.use("/experiencias-profissionais", routes.experienciaProfissional);
app.use("/projetos", routes.projeto);
app.use("/habilidades", routes.habilidade);

// rota não encontrada (404)
app.use(notFoundMiddleware);

// middleware global de erro
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

const eraseDatabaseOnSync = process.env.ERASE_DATABASE_ON_SYNC === "true";
const syncDatabase =
  process.env.SYNC_DATABASE === "true" || eraseDatabaseOnSync;

const startServer = () => {
  app.listen(port, () => console.log(`Servidor de Currículo executando na porta ${port}!`));
};

const createInitialCurriculos = async () => {
  // Currículo 1: João Chaves
  await models.Pessoa.create(
    {
      nome: "João Chaves",
      titulo: "Desenvolvedor Full Stack",
      resumo:
        "Estudante de Sistemas para Internet na UNICAP e desenvolvedor focado em soluções modernas com Node.js, React e PostgreSQL.",
      email: "joao.chaves@unicap.br",
      telefone: "(81) 99999-1111",
      linkedin: "https://linkedin.com/in/joaochaves",
      github: "https://github.com/joaochaves",
      experienciasAcademicas: [
        {
          instituicao: "Universidade Católica de Pernambuco (UNICAP)",
          curso: "Sistemas para Internet",
          grau: "Tecnólogo",
          dataInicio: "2024-02",
          dataFim: "2026-12",
          descricao: "Foco em arquitetura orientada a serviços, desenvolvimento web e mobile.",
        },
        {
          instituicao: "SENAC Pernambuco",
          curso: "Técnico em Informática para Internet",
          grau: "Técnico",
          dataInicio: "2022-01",
          dataFim: "2023-12",
          descricao: "Fundamentos de lógica de programação, HTML, CSS, JavaScript e banco de dados.",
        },
      ],
      experienciasProfissionais: [
        {
          empresa: "Tech Solutions Recife",
          cargo: "Desenvolvedor Back-end Júnior",
          dataInicio: "2025-03",
          dataFim: "Atual",
          descricao: "Desenvolvimento e manutenção de APIs REST com Node.js, Express, Sequelize e PostgreSQL.",
        },
        {
          empresa: "InovaWeb Digital",
          cargo: "Estagiário de Desenvolvimento Web",
          dataInicio: "2024-04",
          dataFim: "2025-02",
          descricao: "Criação de interfaces em React e integração com serviços RESTful.",
        },
      ],
      projetos: [
        {
          nome: "API REST de Currículo (AOS)",
          descricao: "API completa em Express e PostgreSQL (NeonDB) para gestão de currículos e portfólios.",
          tecnologias: "Node.js, Express, Sequelize, PostgreSQL, Babel, Vercel",
          urlRepositorio: "https://github.com/joaochaves/curriculo-api",
          urlDeploy: "https://curriculo-api.vercel.app",
        },
        {
          nome: "TaskFlow Manager",
          descricao: "Sistema web de gerenciamento de tarefas em equipe com quadros Kanban.",
          tecnologias: "React, TypeScript, TailwindCSS, Node.js",
          urlRepositorio: "https://github.com/joaochaves/taskflow",
          urlDeploy: "https://taskflow-demo.vercel.app",
        },
      ],
      habilidades: [
        {
          nome: "Node.js / Express",
          nivel: "Avançado",
          categoria: "Back-end",
        },
        {
          nome: "PostgreSQL / Sequelize",
          nivel: "Intermediário",
          categoria: "Banco de Dados",
        },
        {
          nome: "React.js",
          nivel: "Intermediário",
          categoria: "Front-end",
        },
      ],
    },
    {
      include: [
        { model: models.ExperienciaAcademica, as: "experienciasAcademicas" },
        { model: models.ExperienciaProfissional, as: "experienciasProfissionais" },
        { model: models.Projeto, as: "projetos" },
        { model: models.Habilidade, as: "habilidades" },
      ],
    }
  );

  // Currículo 2: Maria Beatriz Silva
  await models.Pessoa.create(
    {
      nome: "Maria Beatriz Silva",
      titulo: "Engenheira de Software & Especialista em Dados",
      resumo:
        "Profissional com experiência em engenharia de software, arquitetura em nuvem e análise de dados em larga escala.",
      email: "maria.beatriz@email.com",
      telefone: "(81) 98888-2222",
      linkedin: "https://linkedin.com/in/mariabeatrizsilva",
      github: "https://github.com/mariabeatriz",
      experienciasAcademicas: [
        {
          instituicao: "Universidade Católica de Pernambuco (UNICAP)",
          curso: "Ciência da Computação",
          grau: "Bacharelado",
          dataInicio: "2021-02",
          dataFim: "2025-06",
          descricao: "Pesquisa científica na área de inteligência artificial e bancos de dados distribuídos.",
        },
      ],
      experienciasProfissionais: [
        {
          empresa: "Porto Digital Labs",
          cargo: "Engenheira de Software Pleno",
          dataInicio: "2024-01",
          dataFim: "Atual",
          descricao: "Liderança técnica de microsserviços e integração contínua em nuvem.",
        },
        {
          empresa: "DataCorp Brasil",
          cargo: "Analista de Engenharia de Dados Júnior",
          dataInicio: "2022-06",
          dataFim: "2023-12",
          descricao: "Modelagem de bancos relacionais PostgreSQL e construção de pipelines ETL.",
        },
      ],
      projetos: [
        {
          nome: "HealthTrack Analytics",
          descricao: "Plataforma de monitoramento de indicadores de saúde pública em tempo real.",
          tecnologias: "Node.js, Python, PostgreSQL, Docker, React",
          urlRepositorio: "https://github.com/mariabeatriz/healthtrack",
          urlDeploy: "https://healthtrack-analytics.vercel.app",
        },
        {
          nome: "FinControl API",
          descricao: "Back-end financeiro para controle de despesas pessoais e metas de investimento.",
          tecnologias: "Express, Sequelize, PostgreSQL, JWT",
          urlRepositorio: "https://github.com/mariabeatriz/fincontrol-api",
          urlDeploy: "https://fincontrol-api.vercel.app",
        },
      ],
      habilidades: [
        {
          nome: "Arquitetura de Microsserviços",
          nivel: "Avançado",
          categoria: "Arquitetura",
        },
        {
          nome: "PostgreSQL / SQL Tuning",
          nivel: "Avançado",
          categoria: "Banco de Dados",
        },
        {
          nome: "Python / Ciência de Dados",
          nivel: "Avançado",
          categoria: "Dados",
        },
      ],
    },
    {
      include: [
        { model: models.ExperienciaAcademica, as: "experienciasAcademicas" },
        { model: models.ExperienciaProfissional, as: "experienciasProfissionais" },
        { model: models.Projeto, as: "projetos" },
        { model: models.Habilidade, as: "habilidades" },
      ],
    }
  );
};

if (syncDatabase) {
  sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
    if (eraseDatabaseOnSync) {
      await createInitialCurriculos();
    } else {
      const count = await models.Pessoa.count();
      if (count === 0) {
        await createInitialCurriculos();
      }
    }
    startServer();
  });
} else {
  startServer();
}

export default app;
