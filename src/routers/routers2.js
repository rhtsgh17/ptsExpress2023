const express = require("express");
const routers = express.Router();

routers.post("/ngaran", (req,res) => {
    const {nama , kelas} = req.body
    res.send({
        status : "success",
        msg : "Berhasil",
        data : {
            nama : nama,
            kelas : kelas
        }
    })
})