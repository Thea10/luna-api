const fs = require("fs");
const path = require("path");
const Product = require("../models/product.model");

async function admincreateProduct(req, res) {
  try {
    const product = new Product({
      name: req.body.name,
      price: req.body.price,
      size: req.body.size,
      imgUrl:  {
        data: fs.readFileSync(path.join('../public/uploads/' + req.file.filename)), 
      },
      count: req.body.count,
    });

    await product.save((err, product) => {
      if (err) {
        res.status(403).send({ message: err });
        return;
      }
      res.status(201).send({
        message: "Product added successfully!",
        product: product,
      });
    });
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function admineditProduct(req, res) {
  const product = await Product.findById({ _id: req.params.productid });
  if (!product) {
    res.status(404).send({ message: "Product not found." });
    return;
  }

  try {
    let result = await product
      .set({
        name: req.body.name,
        price: req.body.price,
        size: req.body.size,
        imgUrl: req.body.imgUrl,
        count: req.body.count,
      })
      .save();

    res.status(201).send({
      message: "Product Updated",
      product: result,
    });
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}
async function admindeleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete({
      _id: req.params.productid,
    });
    if (!product) {
      res.status(404).send({ message: "Product not found." });
      return;
    }
    res.status(201).send({ message: "Product Deleted" });
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

// async function getAllProducts(req, res) {
//     try {
//       const product = await Product.find();

//       if (!product) {
//         res.status(404).send({ message: "Products not found." });
//         return;
//       }
//       res.status(201).send(product);

//     } catch (ex) {
//       res.status(403).send({message: ex})

//     }

//   }

const adminProductActions = {
  admincreateProduct,
  admineditProduct,
  admindeleteProduct,
};

module.exports = adminProductActions;
