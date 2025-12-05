// routes/agreementRoutes.js
const express = require("express");
const router = express.Router();

const {
  createAgreement,
  getAllAgreements,
  getAgreementByCode,
  deleteAgreement,
  updateAgreement,
} = require("../controllers/agreementController");

// POST /api/agreements/add
router.post("/add", createAgreement);

// GET /api/agreements
router.get("/", getAllAgreements);

// GET /api/agreements/:code
router.get("/:code", getAgreementByCode);

// PUT /api/agreements/:code
router.put("/:code", updateAgreement);

// DELETE /api/agreements/:code
router.delete("/:code", deleteAgreement);

module.exports = router;
