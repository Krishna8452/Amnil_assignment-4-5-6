const users = require("../../models/userModel");
const products = require("../../models/productModel");
const stores = require("../../models/storeModel");

const multer = require("multer");
const path = require("path");
const fs = require("fs"); 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../images/'));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});

const upload = multer({ storage: storage });
exports.newLogo = upload.single('logo')
exports.addStore = async (req, res) => {
  let storeCreated = null; 
  try {
    const { userId, store_name } = req.body;
    const existingStore = await stores.findOne({ store_name });
    if (existingStore) {
      return res.status(400).json({ message: 'Store with the same name already exists' });
    }
    if (!req.body.longitude || !req.body.latitude) {
      return res.status(400).json({ message: 'please enter longitude and latitude' });
    }
    const newStore = {
      store_name: store_name,
      product_type: req.body.product_type,
      userId: userId,
      location: {
        type: 'Point',
        coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
      },
      logo: req.file.filename
    }
    storeCreated = await stores.create(newStore);
    if (!storeCreated) { 
      throw new Error("Store creation failed");
    }
  } catch (error) {
    console.error("Error in addStore:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    if (req.file && storeCreated === null) {
      fs.unlinkSync(path.join(__dirname, '../../images/' + req.file.filename));
    }
  }
  if (storeCreated) {
    res.status(201).json({ storeCreated, message: "Store added successfully" });
  }
};

exports.getAllStores = async (req, res) => {
    try{
    const allStores = await stores.find({}).populate('userId')
    res.status(200).json({ allStores, message: "all lists of stores are listed above"});
    }catch(error){
    res.status(500).json({ error: "Internal Server Error" });
    }

};

exports.getSingleStore = async (req, res) =>{
  try {
    const store_id = req.params.id;
    const store_Id = await stores.findById(store_id).populate("userId");
    if (!store_Id) {
      res.status(404).json({ message: "store not found...." });
    }
    res.status(200).json({ message: "store is", store_Id });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
exports.deleteStore = async(req,res)=>{
  try {
    const store_id = req.params.id;
    if(!store_id)
    {
      res.status(404).json({error:"store id not found..."})
    }
    const deletedStore = await stores.findByIdAndDelete(store_id);
    res.status(200).json({message:"store deleted...",deletedStore})
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });

  }
}

