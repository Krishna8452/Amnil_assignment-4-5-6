const express = require("express");
const router = express.Router();

const {
  addStore,
  newLogo,
  getAllStores,
  getSingleStore,
  deleteStore,
  updateStore,
} = require("../modules/store/storeController");

router.route("/add").post(newLogo, addStore);
router.route("/delete/:id").delete(deleteStore);
router.route("/").get(getAllStores);
router.route("/:id").get(getSingleStore);

module.exports = router;
    