function errorHandler(error,request,response,next){

  if(error.code === 'LIMIT_FILE_SIZE') {
    return response.status(500).json({
        error:{
            status: 1001,
            message : 'File is too big'
        }
    }) 
  }else{
    return response.status(error.status || 500).json({
        error:{
             status : error.errorStatus || 500,
             message : error.message || "service unavailable"
        }
    })
  }
}
module.exports = errorHandler;