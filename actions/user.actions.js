//const bcrypt = require('bcrypt');
const User = require("../models/user-model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const { hashPassword } = require("./user.auth.actions");
const WishList = require("../models/wishlist.model");
const Order = require("../models/order.model");

async function getUserDetails(req, res) {
  // 5f82d9a52d2659087082897b
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).send({ message: "User not found." });
      return;
    }
    res.status(201).send(user);
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function updateDetails(req, res) {
  const user = await User.findById({ _id: req.params.id }).select("-password");
  if (!user) {
    res.status(404).send({ message: "User not found." });
    return;
  }

  try {
    let source = req.body;
    for (let key in source) {
      if (key === "password") {
        source[key] = hashPassword(source[key]);
      }
      user[key] = source[key];
    }
    user.save();

    res.status(201).send({
      message: "User Updated",
      user: user,
    });
  } catch (ex) {
    // let error
    // // let error;
    // // ex.message = "";
    // // for(error in ex.errors){
    // // res.status(403).send({message: ex.errors[error].message})  ex.message += `${ex.errors[error].properties.path} ${ex.errors[error].properties.type}   `
    // // }
    //  for(error in ex.errors){
    // res.status(403).send({message: ex.errors[error].message})
    // }
    res.status(403).send({ message: ex });
  }
}

async function userAddToCart(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const product = await Product.findById(req.params.productid);
   // console.log(product);

    if (user.cart !==null) {
      user.cart.products.filter((item) =>
        item.id === product.id
          ? (item.count += 1)
          : user.cart.products.push(product)
      );
      user.cart.productCount = getCount(user.cart.products);
      user.cart.totalPrice = getPrice(user.cart.products);
      user.save();
      res.status(201).send({
        message: `${product.count} ${product.name} added to cart `,
        user: user,
      });
    } else {
      const cart = new Cart({
        products: product,
        productCount: product.count,
        totalPrice: product.count * product.price,
      });
      let result = await user
        .set({
          cart: cart,
        })
        .save();
      res.status(201).send({
        message: `${product.count} ${product.name} added to cart `,
        user: result,
      });
    }
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function userRemoveFromCart(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const product = await Product.findById(req.params.productid);

    if (user.cart.products.length > 1) {
      user.cart.products.filter((item) =>
        item.id === product.id && item.count > 1
          ? (item.count -= 1)
          : user.cart.products.pop(item)
      );
    } else {
      user.cart.products.filter((item) =>
        item.count > 1 ? (item.count -= 1) : (user.cart = null)
      );
    }

    if (user.cart !== null) {
      user.cart.productCount = getCount(user.cart.products);
      user.cart.totalPrice = getPrice(user.cart.products);
    }

    user.save();
    res.status(201).send({
      message: `${product.count} ${product.name}  removed from cart `,
      user: user,
    });
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function userAddToWish(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const product = await Product.findById(req.params.productid);

    if (user.wishlist) {
      if (user.wishlist.products.length > 1) {
        user.wishlist.products.filter((item) =>
          item.id === product.id
            ? user.wishlist.products.pop(item)
            : user.wishlist.products.push(product)
        );
      } else {
        user.wishlist.products.filter((item) => {
          if (item.id === product.id) {
            user.wishlist.products.pop(item);
            return (user.wishlist = null);
          } else return user.wishlist.products.push(product);
        });
      }

      user.save();
      res.status(201).send({
        message: "Wishlist Updated",
        user: user,
      });
    } else {
      const wishlist = new WishList({ products: product });
      let result = await user
        .set({
          wishlist: wishlist,
        })
        .save();
      res.status(201).send({
        message: `${product.count} ${product.name} added to wishlist `,
        user: result,
      });
    }
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function userPlaceOrder(req, res) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    // if (!user.address){  res.status(403).send({ message: "Please add an address" }); return }

    if (user.cart !== null) {
      const order = new Order({
        products: [...user.cart.products],
        productCount: user.cart.productCount,
        totalPrice: user.cart.totalPrice,
      });
      if (user.order) {
        user.order.push(order);
        user.cart = null;
        user.save();
        res.status(201).send({
          message: "Order Placed",
          user: user,
        });
      } else {
        let result = await user
          .set({
            order: order,
            cart: null,
          })
          .save();
        res.status(201).send({
          message: "Order Placedd",
          user: result,
        });
      }
    } else {
      res.status(403).send({
        message: "Error, There are no items in your cart",
        user: user,
      });
    }
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

function getCount(item) {
 return item.reduce((acc, items) => acc + items.count, 0);
}

function getPrice(item) {
  return item.reduce((acc, items) => acc + items.count * items.price, 0);
}
//updatecart, updatewishlist, updateorder

const userActions = {
  getUserDetails,
  updateDetails,
  userAddToCart,
  userRemoveFromCart,
  userAddToWish,
  userPlaceOrder,
};

module.exports = userActions;
