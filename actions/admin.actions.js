const { hashPassword } = require("./user.auth.actions");
const Admin = require("../models/admin.model");

async function getAdminDetails(req, res) {
  try {
    const user = await Admin.findById(req.params.adminid).select([
      "firstname",
      "lastname",
      "email",
      "phone",
      "address",
      "role",
    ]);

    if (!user) return res.status(404).send({ message: "User not found." });

    res.status(201).send(user);
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

async function updateAdminDetails(req, res) {
  const user = await Admin.findById(req.params.adminid);
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
      message: "Admininstrator Details Updated",
      user: user.select("-password"),
    });
  } catch (ex) {
    res.status(403).send({ message: ex });
  }
}

const AdminActions = {
  getAdminDetails,
  updateAdminDetails
};

module.exports = AdminActions;
