const controllers = require("./controllers.js");
const express = require("express");

const router = express.Router();

router.get("/", controllers.hello);

// write your routes
router.get("/comments", controllers.displayComments);
router.post("/comments", controllers.saveComments);
router.put("/comments", controllers.editComments);
router.delete("/comments", controllers.deleteComments);

module.exports = router;
