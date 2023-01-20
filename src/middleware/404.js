const notFound = (req,res,next) => {
    res.status(404) .json({
        status : "error",
        msg: "Routing tdk di temukan",
    })
}

module.exports = notFound;