const express = require("express");
const { createPoliceMember } = require("../controllers/policeMember.js");
const isAuthenticated = require("../middleware/authentication.js");

const policeMemberRouter = express.Router();

// for creating user
policeMemberRouter.post("/create", createPoliceMember);

module.exports = policeMemberRouter;
