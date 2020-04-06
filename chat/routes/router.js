const router = require("express").Router();

// controllers
const home = require("./controllers/home");

router.get("/", home);

module.exports = router;