const { Op } = require("sequelize");

const UserModel = require("../models").user;

async function getListUser(req, res) {
  try {
    const users = await UserModel.findAll();
    res.json({
      status: "Success",
      msg: "Data User Di temukan",
      data: users,
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
      err: err,
    });
    
  }
}

// create data ke database

async function createUser(req, res) {
  try {
    const payload = req.body;
    let { nama, email, tempatLahir, tanggalLahir } = payload;
    await UserModel.create({
      nama: nama,
      email: email,
      isActive: true,
      tempatLahir: tanggalLahir,
      tanggalLahir: tanggalLahir,
    });
    res.status(201).json({
      status: "success",
      msg: "Berhasil Tersimpan",
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function getDetailUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(404).json({
        status: "Fail",
        msg: "User Tidak Ditemukan",
      });
    }

    res.json({
      status: "Sucess",
      msg: "User Berhasil",
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function getDetailUserByParams(req, res) {
  try {
    const { email } = req.params;

    const user = await UserModel.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      res.status(404).json({
        status: "Fail",
        msg: "User Tidak Ditemukan",
      });
    }

    res.json({
      status: "Sucess",
      msg: "User Berhasil",
      data: user,
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { nama, tempatLahir, tanggalLahir } = payload;
    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(404).json({
        status: "Fail",
        msg: "User Tidak Ditemukan",
      });
    }
    // await UserModel.update(
    //   {
    //     nama: nama,
    //     tempatLahir: tempatLahir,
    //     tanggalLahir : tanggalLahir,
    //   },
    //   {
    //     where: {
    //       id: id,
    //     },
    //   }
    // );

    await UserModel.update(
      {
        nama,
        tempatLahir,
        tanggalLahir,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.json({
      status: "Success",
      msg: "Update User Berhasil",
      id: id,
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
      err: err,
    });
  }
}

async function deleteUser(req,res) {
  try {
    const {id} = req.params;

    const user = await UserModel.findByPk(id);

    if (user === null) {
      res.status(404).json({
        status: "Fail",
        msg: "User Tidak Ditemukan",
      });
    }
    await UserModel.destroy({
      where: {
        id : id,
      }
    })
    res.json({
      status: "Success",
      msg: "Delete User Berhasil",
    });
  } catch (err) {
    res.status(403).json({
      status: "fail",
      msg: "Ada Kesalahan",
      err: err,
    });
  }
}

// const index = async (req, res) => {
//  try {
//   let {keyword, page, pageSize, orderBy, sortBy, pageActive} = req.query;

//   const users = await UserModel.findAndCountAll({
//     attributes: ["id" ["name", "nama"], "email", "status", "jenisKelamin"],

//     where {
//       ...(keyword !== undefined && {
//         [Op.or] : [
//           {
//             name: {
//               [Op.like]: `%[keyword]%`,
//             },
//           },
//           {
//             email: {
//               [Op.like]: `%[keyword]%`,
//             },
//           },
//           {
//             jenisKelamin: {
//               [Op.like]: `%[keyword]%`,
//             },
//           },
//         ]
//       })
//     },
//     order: [[sortBy, orderBy]],
//     offset: page,
//     limit: pageSize,
//   });
//   console.log("page", page);
//   console.log("pageSize", pageSize);
//   return res.json({
//     status: "Success",
//     msg: "daftar user di temukan",
//     data: users,
//     pagination: {
//       page: pageActive,
//       nextPage: page +1,
//       previousPage: pageActive +1,
//       pageSize: pageSize,
//       jumlah: users.row.length,
//       total : users.count,
//     }
//   });
//  } catch (err) {
//   console.log(err),
//   return res.status(403).json({
//     status: 
//   })
//  } 
// }

module.exports = {
  deleteUser,
  getListUser,
  createUser,
  getDetailUserById,
  getDetailUserByParams,
  updateUser,
};

