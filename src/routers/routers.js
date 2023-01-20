const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const routers = express.Router();
const uploadMulti = require("../storage/multiUpload");
const uploadSingle = require("../storage/fileUploadSingle");

routers.post("/upload/single", uploadSingle, (req, res) => {
  res.send({
    status: "Succes",
    msg: "Upload Succes",
    file: req.file,
    fileUrl: `${req.protocol}://${req.get("host")}/${req.file.filename}`,
  });
});

routers.post("/upload/multi", uploadMulti, (req, res) => {
  const files = req.files;
  const url = files.map((file, index) => {
    return ` ${req.protocol}://${req.get("host")}/${
      req.files[index].filename
    };`;
  });

  res.send({
    status: 200,
    message: "Upload Success",
    data: {
      file: req.files,
      fileURL: [url],
    },
  });
});
routers.post("/user/create", (req, res) => {
  const payload = req.body;

  res.json({
    status: "Succes",
    msg: "Latihan Request Body",
    payload: payload,
  });
});

routers.get("/", (req, res) => {
  res.send("Hello gaiis welcome back");
});
routers.post("/", (req, res) => {
  res.send({
    status: "succes",
    msg: "ini adalah method post",
  });
});

// routers.use(authMiddleware);

routers.put("/put", (req, res) => {
  res.send({
    status: "success",
    msg: "ini adalah method put",
  });
});
routers.patch("/", (req, res) => {
  res.send({
    status: "success",
    msg: "ini adalah method patch",
  });
});
routers.delete("/", (req, res) => {
  res.send({
    status: "success",
    msg: "ini adalah method delete",
  });
});

routers.get("/siswa/:nama/:sekolah", (req, res) => {
  // let nama = req.params.nama;
  // let sekolah = req.params.sekolah;

  let { nama, sekolah } = req.params;
  res.send({
    status: "Succes",
    msg: `Nama Siswa adalah ${nama} dan bersekolah di ${sekolah}`,
  });
});

// latihan query string

routers.get("/siswa/:nama", (req, res) => {
  // let nama = req.params.nama;
  // let sekolah = req.params.sekolah;

  let { nama } = req.params;
  let { kelas = "xi", sekolah = "mq" } = req.query;
  res.send({
    status: "Succes",
    msg: `Nama Siswa adalah ${nama} duduk di kelas ${kelas} di ${sekolah}`,
  });
});

routers.get("/absensi/:nama", (req, res) => {
  let { nama } = req.params;
  let { dari_tanggal = "2023-01-02" } = req.query;
  let { sampai_tanggal = "2023-01-15" } = req.query;
  let { status } = req.query;
  res.send({
    status: "success",
    msg: {
      nama: nama,
      dari_tanggal: dari_tanggal,
      sampai_tanggal: sampai_tanggal,
      status: status,
    },
  });
});

module.exports = routers;
