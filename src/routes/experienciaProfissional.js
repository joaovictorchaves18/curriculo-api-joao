import { Router } from "express";
import { experienciaProfissionalController } from "../controllers/index.js";

const router = Router();

router.get("/", experienciaProfissionalController.getExperienciasProfissionais);
router.get("/:experienciaId", experienciaProfissionalController.getExperienciaProfissional);
router.post("/", experienciaProfissionalController.createExperienciaProfissional);
router.put("/:experienciaId", experienciaProfissionalController.updateExperienciaProfissional);
router.delete("/:experienciaId", experienciaProfissionalController.deleteExperienciaProfissional);

export default router;
