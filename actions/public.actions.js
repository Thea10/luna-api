
const Product = require("../models/product.model");

async function getAllProducts(req, res) {
    try {
      const product = await Product.find();
    
      if (!product || product.length === 0) {
        res.status(404).send({ message: "Products not found." });
        return;
      }
      res.status(200).send(product);
      
    } catch (ex) {
      res.status(403).send({message: ex})
      
    }
  
  }

  const publicActions = {
      getAllProducts
  }

  module.exports = publicActions