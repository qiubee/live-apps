const router = require("express").Router();

// controllers
const travel = require("./controllers/travel");

router.get("/", travel);

module.exports = router;