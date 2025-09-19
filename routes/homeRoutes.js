import router from "./authRoutes.js";
import { HomeController } from "../controllers/homeController.js";

router.get("/home", HomeController.renderHome)

export default router;