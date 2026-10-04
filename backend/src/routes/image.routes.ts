import { Router } from "express";
import uploadImage from "../controllers/uploadImage.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import getImage from "../controllers/getImage.controller.js";
import getAllImages from "../controllers/getAllImage.controller.js";
import deleteImageFromServer from "../controllers/deleteImage.controller.js";

const router = Router()

router.use(authMiddleware);

router.post("/upload", uploadImage);
router.get("/get/image/:id", getImage);
router.get("/get/allImages", getAllImages);
router.delete("/delete/:id", deleteImageFromServer);

export default router;