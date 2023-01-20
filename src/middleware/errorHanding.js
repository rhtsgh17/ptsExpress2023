const errorHanding = (req,res,next) => {
    res.status(500) .json({
        status : "error",
        msg: "terjadi kesalahan pd server",
    })
}

module.exports = errorHanding;