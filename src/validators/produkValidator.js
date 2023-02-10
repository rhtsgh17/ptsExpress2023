const { check } = require("express-validator");
const ProdukModel = require("../models").produk;
const createProdukValidator = [
  check("nama")
    .isLength({
      min: 1,
    })
    .withMessage("Nama Wajib di isi"),

  check("email")
    .isEmail()
    .withMessage("gunakan Format Email")
    .custom((value) => {
      return ProdukModel.findOne({
        where: {
          email: value,
        },
      }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
];

module.exports = { createProdukValidator };