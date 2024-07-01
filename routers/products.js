const express = require("express");
const checkAdmin = require("../helpers/checkAdmin");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
  getFeaturedProducts,
  uploadGalleryImages,
  uploadOptions,
} = require("../controllers/product");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", checkAdmin, uploadOptions.single("image"), createProduct);
router.put("/:id", checkAdmin, updateProduct);
router.delete("/:id", checkAdmin, deleteProduct);
router.get("/get/count", getProductCount);
router.get("/get/featured/:count", getFeaturedProducts);
router.put("/gallery-images/:id", uploadOptions.array("images", 3), uploadGalleryImages);

module.exports = router;
