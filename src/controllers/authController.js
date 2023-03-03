const UserModel = require("../models").user;
const ForgotPasswordModel = require("../models").password;
// const resetPasswordDgnEmailModel = require("../models").resetPasswordDgnEmail;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailHandle = require("../mail");
const crypto = require("crypto");
const dayjs = require("dayjs");
require("dotenv").config;

async function register(req, res) {
  try {
    let payload = req.body;
    let { nama, email, password } = req.body;
        let hashPassword = await bcrypt.hashSync(password, 10);
    console.log(password);
        await UserModel.create({
          nama: nama,
          email: email,
          password: hashPassword,
        });
    console.log("Payload", nama, email, password);
    res.json({
      status: "Success",
      msg: "Register Berhasil",
      // payload: [nama, email, password],
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
      // n: ` nama ${nama}`
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
        msg: "Email Tidak ditemukan, Silahkan Register",
      });
    }

    if (password === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email dan Password Tidak Cocok",
      });
    }

    const verify = await bcrypt.compareSync(password, user.password);

    if (verify === false) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email dan Password Tidak Cocok",
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
      user: user,
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

module.exports = { register, login };
