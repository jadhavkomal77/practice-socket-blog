import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { getAllUsers, deactivateUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router
  .get("/all", isAuth, getAllUsers)
  .put("/deactivate/:id", isAuth, deactivateUser)
  .delete("/delete/:id", isAuth, deleteUser);

export default router;
