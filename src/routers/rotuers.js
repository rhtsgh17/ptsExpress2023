const express = require('express')
const routers = express.Router();

 routers.get ("/", (req,res) => {
    res.send({
        status: "success",
        message: "berhasil"
    })
 });

 routers.get("/siswa/:nama", (req,res) => {
        console.log(req.query);
        let {nama} = req.params;
        let {kelas, angkatan} = req.query;
        res.send({
            status: "success",
            message: `siswa atas nama ${nama} di ${kelas} dan angkatan ${angkatan}`
        })
 });

 module.exports = routers;