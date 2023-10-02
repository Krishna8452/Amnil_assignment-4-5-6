const products = require("../../models/productModel");

exports.getAllProducts = async (req, res) => {
  try {
    const data = await products.find({});
    if (!data) {
      return res.status(404).json({ error: "product not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
   
exports.getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const data = await products.findById(productId);
    if (!data) {
      return res.status(404).json({ error: "product not found" });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

exports.addProduct = async (req, res) => {
  const newProduct = req.body;
  try {
    const data = await products.create(newProduct);
    if (!data) {
      return res.status(404).json({ error: "failed to create product" });
    }
    res.status(200).json({ success: "product created successfully!!" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const updateProducts = await products.findByIdAndUpdate(
      productId,
      updates,
      { new: true }
    );
    if (!updateProducts) {
      return res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  res.status(200).json({ success: "product updated successfully!!" });
};
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleteProduct = await products.findByIdAndRemove(productId);
    if (!deleteProduct) {
      return res.status(404).json({ message: "product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
  res.status(200).json({ message: "product deleted successfully" });
};

exports.outOfStockProduct = async (req, res) => {
  try {
    const quant = req.query.quantity;
    const data = await products.find({ quantity: { $lt: quant } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.filterProduct = async (req, res) => {
  try{
    const value = req.query.product_type;
    const data = await products.find({ product_type: value });
    res.json(data);
  }catch(error){
    res.status(500).json({ error: "An error occurred" });

  }
};
exports.sortProduct = async (req, res) => {
  try{
    const data = await products.find({});
    const sortedProduct = data.sort((a, b) => a.price - b.price);
    res.json(sortedProduct);
  }catch(error){
    res.status(500).json({ error: "An error occurred" });
  }
};

exports.searchProduct = async (req, res) => {
  try {
    const query = req.query.name;
    const data = await products.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
