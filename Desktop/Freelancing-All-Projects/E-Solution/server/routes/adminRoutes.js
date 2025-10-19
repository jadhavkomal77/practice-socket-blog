import express from "express";
import {
  adminRegister,
  adminLogin,
  adminLogout,
  getAdminProfile,
  updateAdminProfile,
  getAllAdmins,
  deactivateAdmin
} from "../controllers/adminController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router.post("/adminregister", adminRegister);
router.post("/adminlogin", adminLogin);
router.post("/adminlogout", adminLogout);

router.get("/adminprofile", isAuth, getAdminProfile);
router.put("/adminprofileupdate", isAuth, updateAdminProfile);

router.get("/alladmin", isAuth, getAllAdmins);
router.put("/deactivate/:id", isAuth, deactivateAdmin);

export default router;
