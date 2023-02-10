const ArtikelModel = require("../models").artikels;
const { Op } = require("sequelize");
// async function getArtikel(req, res) {
//   try {
//     const artikels = await ArtikelModel.findAll({
//       where: {
//         userId: req.id,
//       },
//     });
//     if (artikels === null) {
//       return res.status(404).json({
//         status: "Fail",
//         message: "artikel not found",
//       });
//     }
//     // if (artikels.userId != req.id) {
//     //   return res.status(404).json({
//     //     status: "Fail",
//     //     message: "artikel  bukan punya kamu!!!!",
//     //   });
//     // }
//     res.json({
//       status: "success",
//       message: "Data Artikel Ditemukan",
//       data: artikels,
//     });
//     console.log(artikels);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({
//       status: "Fail",
//       message: "Rute tidak ditemukan",
//     });
//   }
// }

// async function getArtikel(req, res) {
//   const {tittle, dari_tahun, sampai_tahun} = req.query
//   try {
//     const artikels = await ArtikelModel.findAll({
//       // atributs: [
//       //   "id",
//       //   "userId",
//       //   ["tittle", "judul"],
//       //   ["year", "tahun"],
//       //   ["description", "deskripsi"],
//       // ],
//       atributes  : {
//         exlude: ["creatAd", "updateAd"]
//       },
//       // where: {
//       //   tittle: {
//       //     [Op.eq]: req.id,
//       //   }

//       // },
//       where : {
//         tittle : {
//           [Op.substring] : tittle
//         },
//         year : {
//           [Op.between] : [dari_tahun, sampai_tahun]
//         }
//       }
//     });

//     res.json({
//       status: "success",
//       message: "Data Artikel Ditemukan",
//       data: artikels,
//       query : {
//         tittle,
//         dari_tahun,
//         sampai_tahun
//       }
//     });
//     console.log(artikels);
//   } catch (error) {
//     console.log(error);
//     res.status(404).json({
//       status: "Fail",
//       message: "Rute tidak ditemukan",
//     });
//   }
// }
async function getArtikel(req, res) {
  try {
    let {
      keyword,
      year,
      offset,
      page,
      pageSize,
      sortBuy = "id",
      orderBuy = "desc",
    } = req.query;
    
    const artikels = await ArtikelModel.findAndCountAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },

      // where: {
      //   [Op.or]: [
      //     {
      //       tittle: {
      //         [Op.substring]: keyword,
      //       },
      //     },
      //     {
      //       description: {
      //         [Op.substring]: keyword,
      //       },
      //     },
      //   ],
      //   year: {
      //     [Op.gte]: year,
      //   },
      // },

      order: [[sortBuy, orderBuy]],

      limit: pageSize,
      offset: offset,
    });

    res.json({
      status: "success",
      message: "Data Artikel Ditemukan",
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalData: artikels.count,
      },
      data: artikels,
    });
    console.log(artikels);
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "Fail",
      message: "artikel tidak ditemukan",
      clg: error,
    });
  }
}
async function createArtikel(req, res) {
  try {
    const payload = req.body;

    const { tittle, year, description } = payload;

    await ArtikelModel.create({
      tittle,
      year,
      description,
      userId: req.id,
    });

    res.status(201).json({
      status: "Success",
      msg: "Berhasil",
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "Ada Kesalahan",
    });
  }
}

async function updateArtikel(req, res) {
  try {
    const { id } = req.params;
    const payload = req.body;
    const { tittle, year, description } = payload;
    const artikel = await ArtikelModel.findByPk(id);
    if (artikel === null) {
      return res.status(404).json({
        status: "Fail",
        message: "artikel not found",
      });
    }
    if (artikel.userId != req.id) {
      return res.status(422).json({
        status: "Fail",
        message: "artikel is not belong to you, you can't update it",
      });
    }
    await ArtikelModel.update(
      {
        tittle,
        year,
        description,
      },
      {
        where: {
          userId: req.id,
          id: id,
        },
      }
    );
    res.json({
      status: "Success",
      message: "Updated Artikel Berhasil",
      id: id,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Fail",
      message: "There is something wrong",
    });
  }
}

async function deleteArtikel(req, res) {
  try {
    const { id } = req.params;
    const artikel = await ArtikelModel.findByPk(id);
    if (artikel === null) {
      res.status(404).json({
        status: "Fail",
        message: "artikel tdk di temukan",
      });
    }
    if (artikel.userId != req.id) {
      return res.status(422).json({
        status: "Fail",
        message: "artikel is not belong to you, you can't delete it",
      });
    }
    await ArtikelModel.destroy({
      where: {
        userId: req.id,
        id: id,
      },
    });
    res.json({
      status: "Success",
      message: "artikel berhasil dihapus",
      id: id,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Fail",
      message: "There is something wrong",
    });
  }
}

async function updatePasswordUser(req, res) {
  try {
    const payload = req.body;
    let { email, oldPssword, newPassword } = payload;
    const users = await UserModel.findOne({
      where: {
        email: req.email,
      },
    });
    const verify = await bcrypt.compareSync(oldPssword, users.passpord);

    if (users === null) {
      return res.json({
        status: 404,
        msg: "email not found",
      });
    }

    if (verify) {
      let hashPassword = await bcrypt.hash(newPassword, 10);
      await UserModel.update(
        { passpord: hashPassword },
        {
          where: {
            id: users.id,
          },
        }
      );
      res.json({
        status: "200 ok",
        msg: "Password update",
      });
    } else {
      res.json({
        msg: "pasword lama tdk sesuai",
      });
    }
  } catch (err) {
    console.log("err", err);
    res.status(403).json({
      status: "failed",
      msg: "ada kesalahan update password",
      err: err,
    });
  }
}
async function createArtikelBulk(req, res) {
  try {
    // const payload = req.body.payload
    const { payload } = req.body;
    payload.map((item, index) => {
      item.userId = req.id;
    });
    await ArtikelModel.bulkCreate(payload);

    res.status(201).json({
      status: "succces",
      msg: "Create artikel berhasil",
      // payload,
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "ada kesalahan",
      err,
    });
  }
}
async function createArtikelMulti(req, res) {
  try {
    // const payload = req.body.payload
    const { payload } = req.body;

    let succces = 0;
    let fail = 0;
    let jumlah = payload.length;

    await Promise.all(
      payload.map(async (item) => {
        try {
          await ArtikelModel.create({
            tittle: item.tittle,
            year: item.year,
            description: item.description,
            userId: req.id,
          });

          success = success = +1;
        } catch (err) {
          fail = fail + 1;
        }
      })
    );
    res.status(201).json({
      status: "succces",
      msg: `Berhasil menambahkan ${success} dari ${jumlah} dan gagal ${fail}`,
      // payload,
    });
  } catch (err) {
    res.status(403).json({
      status: "Fail",
      msg: "ada kesalahan",
      err,
    });
  }
}
async function deleteMulti(req, res) {
  try {
    const { payload } = req.body;
    let success = 0;
    let fail = 0;
    let jumlah = payload.length;
    await Promise.all(
      payload.map(async (items, index) => {
        try {
          const tittle = await ArtikelModel.findOne({
            where: { id: items.id },
          });
          if (tittle.userId !== req.id) {
            // return res.json({
            //   status: "Fail",
            //   msg: `ada kesalahan`,
            // });

            return (fail = fail + 1);
          }
          await ArtikelModel.destroy({
            where: { id: items.id },
          });
          console.log(items.id);
          console.log(tittle);
          success = success + 1;
        } catch (error) {
          console.log(error);
          // fail = fail + 1;
        }
      })
    );
    res.status(201).json({
      status: "Success",
      msg: `Success delete ${success} artikel dari ${jumlah} artikel dengan ${fail} gagal`,
    });
  } catch (error) {
    console.log(error);
    res.status(403).json({
      status: "Fail",
      msg: "ada kesalahan",
      err: error,
    });
  }
}

module.exports = {
  createArtikel,
  getArtikel,
  deleteArtikel,
  updateArtikel,
  updatePasswordUser,
  createArtikelBulk,
  createArtikelMulti,
  deleteMulti,
};
