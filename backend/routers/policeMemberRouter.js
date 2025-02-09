const express = require("express");
const {
  createPoliceMember,
  searchPoliceMember,
} = require("../controllers/policeMember.js");
const isAuthenticated = require("../middleware/authentication.js");

const policeMemberRouter = express.Router();

// for creating user
policeMemberRouter.post("/create", createPoliceMember);

// route for searching
policeMemberRouter.post("/search", searchPoliceMember);

module.exports = policeMemberRouter;
