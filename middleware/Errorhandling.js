function ErrorHandling(err, req, res, next){
    if (err || res.statusCode >= 400) {
        res.json(
        {
        status: err.status|| 
        res.statusCode || 500,
        err : "Ann error occured. Please try again later."
        }       
     )
    } 
    next()
    
}
export {

    ErrorHandling
}