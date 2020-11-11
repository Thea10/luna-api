const User = require("../models/user-model");

async function getAllUsers(req, res) {
  try {
    const user = await User.find().select("-password");
    //  .populate("wishlist", "cart", "order" )

    if (!user) {
      res.status(404).send({ message: "Users not found." });
      return;
    }
    res.status(201).send(user);
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function getSingleUser(req, res) {
  try {
    const user = await User.findById(req.params.userid).select("-password");
    if (!user) {
      res.status(404).send({ message: "User not found." });
      return;
    }
    res.status(201).send(user);
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function deleteSingleUser(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.params.userid);
    if (!user) {
      res.status(404).send({ message: "User not found." });
      return;
    }
    res.status(201).send({ message: "User Deleted" });
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function updateUserOrder(req, res) {
  try {
    const user = await User.findById(req.params.userid).select("-password");
    if (!user) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    user.order.filter((orderItem) => {
      if (orderItem._id == req.params.orderid) {
        orderItem.fulfilled = true;
        orderItem.dateFulfilled = Date.now();
      }

      return orderItem;
    });

    user.save();
    res.status(201).send({
      message: "Order Updated",
      user: user,
    });
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

//delete user 5f82f07f5020b927e4618f7e

const AdminUsersActions = {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  updateUserOrder,
};

module.exports = AdminUsersActions;
