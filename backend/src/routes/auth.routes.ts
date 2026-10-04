import { Router } from "express";
import signup from "../controllers/auth/signup.controller.js";
import signin from "../controllers/auth/signin.controller.js";
import refreshAccessToken from "../controllers/auth/refresh.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refresh", refreshAccessToken);
export default router;