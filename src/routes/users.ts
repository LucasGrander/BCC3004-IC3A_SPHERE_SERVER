import { Router } from "express";
import { getUserById, getUsers } from "../handlers/users";

const router = Router();

router.get("/", getUsers);

// /api./users/123
router.get("/:id", getUserById);

export default router;