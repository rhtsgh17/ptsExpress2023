const UserModel = require("../models").user;
// const ForgotPasswordModel = require("../models").password;
// const resetPasswordDgnEmailModel = require("../models").resetPasswordDgnEmail;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailHandle = require("../mail");
const crypto = require("crypto");
const dayjs = require("dayjs");
require("dotenv").config;

async function register(req, res) {
  try {
    let { nama, email, password, role } = req.body;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama: nama,
      email: email,
      password: hashPassword,
      role: role,
    });
    console.log(nama);
    //   console.log(email);
    //   console.log(password);
    //   console.log(role);

    res.json({
      status: "Success",
      msg: "Register Berhasil",
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
      err: err,
    });
  }
}

async function login(req, res) {
  try {
    const payload = req.body;
    const { email, password } = payload;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email tidak ditemukan, Silahkan register",
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email dan password tidak ditemukan",
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email dan passwor tidak ditemukan",
      });
    }

    const token = jwt.sign(
      {
        id: user?.id,
        email: user?.email,
        nama: user?.nama,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }
    );

    res.json({
      status: "Success",
      msg: "Login Berhasil",
      token: token,
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
      err: err,
    });
  }
}

module.exports = { register, login };
