const {
  EmailIsPassword,
  verifyToken
} = require("../middleware/shared");
const {
  AdminMailExists,
  AdminPhoneExists,
  userIsAdmin,
} = require("../middleware/admin.validate");
const {
  addAdmin,
  adminSignIn
} = require("../actions/admin.auth.actions");
const {
  getAdminDetails,
  updateAdminDetails,
} = require("../actions/admin.actions");

const {
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  updateUserOrder
} = require("../actions/admin.users.actions");

const {
  getAllProducts
} = require("../actions/public.actions");

const {
  admincreateProduct,
  admineditProduct,
  admindeleteProduct,
} = require("../actions/admin.products.actions");
const multer = require("multer");

let imgMimes = ["image/png", "image/jpg", "image/jpeg"];

let upload = multer({
  dest: "../public/uploads/",
  fileFilter: (req, file, cb) => {
    if (imgMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});

let source = upload.single("imgUrl");
module.exports = function (adminauth) {
  adminauth.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  adminauth.post(
    "/api/admin/auth/signup",
    [AdminMailExists, AdminPhoneExists, EmailIsPassword],
    addAdmin
  );
  adminauth.post(
    "/api/admin/auth/:adminid/add-admin",
    [
      verifyToken,
      userIsAdmin,
      AdminMailExists,
      AdminPhoneExists,
      EmailIsPassword,
    ],
    addAdmin
  );
  adminauth.post("/api/admin/auth/login", adminSignIn);

  adminauth.get(
    "/api/admin/:adminid",
    [verifyToken, userIsAdmin],
    getAdminDetails
  );
  adminauth.put(
    "/api/admin/:adminid",
    [verifyToken, EmailIsPassword],
    updateAdminDetails
  );

  adminauth.get(
    "/api/admin/:adminid/allusers",
    [verifyToken, userIsAdmin],
    getAllUsers
  );
  adminauth.get(
    "/api/admin/:adminid/allusers/user/:userid",
    [verifyToken, userIsAdmin],
    getSingleUser
  );
  adminauth.delete(
    "/api/admin/:adminid/allusers/user/:userid/delete",
    [verifyToken, userIsAdmin],
    deleteSingleUser
  );
  adminauth.put(
    "/api/admin/:adminid/allusers/user/:userid/order/:orderid/update",
    [verifyToken, userIsAdmin],
    updateUserOrder
  ); //order- 5fab5c4228a3eb1394d15476, user-5fa660f8bb07001668c6aa89

  adminauth.get("/api/admin/products/all-products", getAllProducts);
  adminauth.post(
    "/api/admin/:adminid/products/add-product",
    [verifyToken, userIsAdmin],
    source,
    admincreateProduct
  );
  adminauth.put(
    "/api/admin/:adminid/products/:productid/edit-product",
    [verifyToken, userIsAdmin],
    admineditProduct
  );
  adminauth.delete(
    "/api/admin/:adminid/products/:productid/delete",
    [verifyToken, userIsAdmin],
    admindeleteProduct
  );
};