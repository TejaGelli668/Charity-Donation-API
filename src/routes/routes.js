import express from "express";
import { authorize } from "../middleware/authMiddleware.js";

import {
  addAdmin,
  adminLogin,
  getAdminById,
  getAdmins,
  updateAdmin,
} from "../controllers/adminController.js";

import {
  createUser,
  customerLogin,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from "../controllers/userController.js";

import {
  createCampaign,
  deleteCampaignById,
  getAllCampaignCategories,
  getAllCampaignStatuses,
  getAllCampaigns,
  getAllCampaignsByUsers,
  getCampaignById,
  getCampaignByUserId,
  updateCampaignById,
} from "../controllers/campaignController.js";
import {
  createDonation,
  getAllDonationsByCampaignId,
  getAllDonationsByUserId,
  updateDonationById,
} from "../controllers/donationsController.js";

const router = express.Router();

// Admin routes
router.get("/admin", authorize(["ROLE_ADMIN"]), getAdmins);
router.post("/admin", authorize(["ROLE_ADMIN"]), addAdmin);
router.get("/admin/:id", authorize(["ROLE_ADMIN"]), getAdminById);
router.put("/admin/:id", authorize(["ROLE_ADMIN"]), updateAdmin);
router.post("/admin/login", adminLogin);

// User routes
router.get("/users", authorize(["ROLE_ADMIN"]), getUsers);
router.get("/users/:id", authorize(["ROLE_ADMIN", "ROLE_USER"]), getUserById);
router.post("/users", createUser);
router.put("/users/:id", authorize(["ROLE_USER", "ROLE_ADMIN"]), updateUser);
router.delete("/users/:id", authorize(["ROLE_ADMIN"]), deleteUser);

// Authentication routes
router.post("/user/login", customerLogin);
router.post("/user/register", createUser);

router.get("/campaign-categories", getAllCampaignCategories);
router.get("/campaign-statuses", getAllCampaignStatuses);

// Campaign routes
router.get("/campaigns", getAllCampaigns);
router.get(
  "/campaigns-by-users",
  authorize(["ROLE_ADMIN"]),
  getAllCampaignsByUsers
);
router.get("/campaigns/:id", getCampaignById);
router.get("/campaigns/:id/donations", getAllDonationsByCampaignId);
router.get("/user/:id/campaigns", getCampaignByUserId);
router.post("/campaigns", authorize(["ROLE_USER"]), createCampaign);
router.put(
  "/campaigns/:id",
  authorize(["ROLE_USER", "ROLE_ADMIN"]),
  updateCampaignById
);
router.delete("/campaigns/:id", authorize(["ROLE_USER"]), deleteCampaignById);

// Campaign donation routes
router.get(
  "/campaigns/:id/donation/:donation_id",
  authorize(["ROLE_USER"]),
  getCampaignById
);
router.post("/campaigns/:id/donation", createDonation);

// Campaign donation routes
router.get(
  "/user/donations/:user_id",
  authorize(["ROLE_USER"]),
  getAllDonationsByUserId
);
router.put(
  "/user/donations/:donation_id/cancel",
  authorize(["ROLE_USER"]),
  updateDonationById
);

export default router;
