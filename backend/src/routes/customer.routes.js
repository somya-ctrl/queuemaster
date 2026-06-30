import { Router } from "express";
import {
  listCustomers,
  addCustomer,
  markServing,
  markCompleted,
  removeCustomer,
} from "../controllers/customer.controller.js";

const router = Router();


router.get("/", listCustomers);
router.post("/", addCustomer);
router.patch("/:id/serve", markServing);
router.patch("/:id/complete", markCompleted);
router.delete("/:id", removeCustomer);

export default router;
