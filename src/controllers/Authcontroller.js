const UserModel = require("../models").user;
const ForgotPasswordModel = require("../models").password;
const resetPasswordDgnEmailModel = require("../models").resetPasswordDgnEmail;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmailHandle = require("../mail");
const crypto = require("crypto");
const dayjs = require("dayjs");
require("dotenv").config;
async function register(req, res) {
  try {
    const payload = req.body;
    const { nama, email, password } = payload;

    let hashPassword = await bcrypt.hashSync(password, 10);

    await UserModel.create({
      nama,
      email,
      password: hashPassword,
    });

    res.json({
      status: "Success",
      msg: "Register Berhasil",
    });
  } catch (err) {
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

async function lupaPassword(req, res) {
  try {
    const { email } = req.body;

    //cek apakah user dengan email tsb terdaftar
    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });
    //jika tidak terdaftar berikan response dengan msg email tidak terdaftar

    if (user === null) {
      return res.status(422).json({
        status: "Fail",
        msg: "Email tidak ditemukan, Silahkan gunakan email yg terdaftar",
      });
    }
    // cek apakah token sudah pernah dibuat pada user tsb di table forgot password
    const currentToken = await ForgotPasswordModel.findOne({
      where: {
        userId: user.id,
      },
    });
    // jika ada hapus token lama

    if (currentToken !== null) {
      await ForgotPasswordModel.destroy({
        where: {
          userId: user.id,
        },
      });
    }
    // jika belum buat token

    const token = crypto.randomBytes(32).toString("hex"); // membuat token dgn string acak
    const date = new Date();
    const expire = date.setHours(date.getHours() + 1);

    await ForgotPasswordModel.create({
      userId: user.id,
      token: token,
      expireDate: dayjs(expire).format("yyyy,zzzzz,aaaaaaaaa"),
    });

    const context = {
      link: `${process.env.MAIL_CLIENT_URL}/reset-password/${user.id}/${token}`,
    };
    const sendEmail = await sendEmailHandle(
      email,
      "lupa password",
      "lupaPassword",
      context
    );
    if (sendEmail == "Success") {
      res.json({
        status: "Success",
        msg: "silahkan check email",
      });
    } else {
      res.status(403).json({
        status: "fail",
        msg: "Gunakan email yg terdaftar",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
      err,
    });
  }
}

async function resetPassword(req, res) {
  try {
    let { newPassword } = req.body;
    let { userId, token } = req.params;
    const currentToken = await ForgotPasswordModel.findOne({
      where: { userId: userId, token: token },
    });
    const user = await UserModel.findOne({
      where: {
        id: userId,
      },
    });

    if (currentToken === null) {
      res.status(403).json({
        msg: "token tidak valid",
      });
    } else {
      let userExpired = currentToken.expiredDate;
      let expire = dayjs(Date());
      let difference = expire.diff(userExpired, "hour");
      if (difference !== 0) {
        res.json({
          status: "Fail",
          msg: "Token has expired",
        });
      } else {
        let hashPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.update(
          { password: hashPassword },
          {
            where: {
              id: user.id,
            },
          }
        );
        await ForgotPasswordModel.destroy({ where: { token: token } });
        res.json({
          status: "200 OK",
          msg: "password berhasil di perbarui",
        });
      }
    }
  } catch (err) {
    console.log("err", err);
    res.status(403).json({
      status: "error 403",
      msg: "ada error",
      err: err,
    });
  }
}



module.exports = {
  register,
  login,
  lupaPassword,
  resetPassword,

};
