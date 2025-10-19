import express from "express";
import { createContact, getAllContacts, deleteContact } from "../controllers/contactController.js";
import { isAuth } from "../middleware/isAuth.js";

const router = express.Router();

router
  .post("/", createContact)
  .get("/", isAuth, getAllContacts)
  .delete("/:id", isAuth, deleteContact);

export default router;
