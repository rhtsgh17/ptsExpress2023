const log = (req,res,next) => {
    console.log(Date.now() + "" + req.ip + "" + req.originalUrl );
    next()
};

module.exports = log;