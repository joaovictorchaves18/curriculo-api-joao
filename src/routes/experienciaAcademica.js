import { Router } from "express";
import { experienciaAcademicaController } from "../controllers/index.js";

const router = Router();

router.get("/", experienciaAcademicaController.getExperienciasAcademicas);
router.get("/:experienciaId", experienciaAcademicaController.getExperienciaAcademica);
router.post("/", experienciaAcademicaController.createExperienciaAcademica);
router.put("/:experienciaId", experienciaAcademicaController.updateExperienciaAcademica);
router.delete("/:experienciaId", experienciaAcademicaController.deleteExperienciaAcademica);

export default router;
