const { Product } = require("../models/product");
const { Category } = require("../models/category");
const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("Unsupported file type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(" ", "-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});
const uploadOptions = multer({ storage: storage });

const getAllProducts = async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      const categories = req.query.categories.split(",");
      filter = { category: { $in: categories } };
    }

    const productList = await Product.find(filter)
      .select("name image -_id")
      .populate("category");

    if (productList.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found for the specified categories.",
      });
    }

    return res.status(200).json({ success: true, data: productList });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");
  if (!product) return res.status(500).json({ success: false });

  res.send(product);
};

const createProduct = async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");

  const file = req.file;
  if (!file) return res.status(400).send("There is no image file in this request");

  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: `${basePath}${fileName}`,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();
  if (!product) return res.status(500).send("Product cannot be created");

  res.send(product);
};

const updateProduct = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product ID");
  }

  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) return res.status(400).send("The product cannot be updated");

  res.send(product);
};

const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (product) {
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } else {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
};

const getProductCount = async (req, res) => {
  const productCount = await Product.countDocuments();

  if (!productCount) return res.status(500).json({ success: false });
  res.send({ NumberofProducts: productCount });
};

const getFeaturedProducts = async (req, res) => {
  const count = req.params.count ? req.params.count : 0;
  const productCount = await Product.find({ isFeatured: true }).limit(+count);

  if (!productCount) return res.status(500).json({ success: false });

  res.send(productCount);
};

const uploadGalleryImages = async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid product ID");
  }
  try {
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

    if (files) {
      imagesPaths = files.map((file) => {
        return `${basePath}${file.filename}`;
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          images: imagesPaths,
        },
      },
      { new: true }
    );
    if (!product) {
      return res.status(400).send("Failed to upload the product");
    }
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCount,
  getFeaturedProducts,
  uploadGalleryImages,
  uploadOptions,
};
