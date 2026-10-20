import { Router } from "express";
import { habilidadeController } from "../controllers/index.js";

const router = Router();

router.get("/", habilidadeController.getHabilidades);
router.get("/:habilidadeId", habilidadeController.getHabilidade);
router.post("/", habilidadeController.createHabilidade);
router.put("/:habilidadeId", habilidadeController.updateHabilidade);
router.delete("/:habilidadeId", habilidadeController.deleteHabilidade);

export default router;
