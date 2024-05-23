const checkAdmin = async (req,res,next) => {
        try {
            if (req.auth) {
                if (req.auth.isAdmin) {
                    next()
                } else {
                    throw new Error("NOT AUTHENTICATED")
                }
            } else {
                throw new Error("NOT AUTHENTICATED")
            }
        } catch (error) {
            next(error)
        }
    }


module.exports = checkAdmin