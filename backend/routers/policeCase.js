const express = require("express");
const {
  createCase,
  updateCase,
  addSuspect,
  uploadEvidence,
  getCaseDetails,
} = require("../controllers/policeCase.js");
const { upload } = require("../utils/multerConfig.js");

const isAuthenticated = require("../middleware/authentication.js");

const policeCaseRouter = express.Router();

// 📌 Create a police case
policeCaseRouter.post("/create", createCase);

// 📌 Update case details
policeCaseRouter.put("/update/:caseId", updateCase);

// 📌 Add suspect to a case
policeCaseRouter.post("/add_suspect/:caseId", addSuspect);

// 📌 Upload evidence (images/videos/documents)
policeCaseRouter.post(
  "/upload_evidence/:caseId",
  upload.single("file"),
  uploadEvidence
);

policeCaseRouter.get("/:caseId", getCaseDetails);

module.exports = policeCaseRouter;
