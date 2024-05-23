module.exports = function errorHandler(err, req,res, next){
    if(err.name === 'authorizationError'){
        return res.status(401).json({message:'The user is not authorized'})
    }
    if(err.name === 'validationError'){
        return res.status(401).json({message:'Validation error'})
    }
    return res.status(500).json(err)
}