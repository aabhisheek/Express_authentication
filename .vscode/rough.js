exports.restrict=(role)=>{
    return (req,res,next)=>{
         if(req.user.role!==role){
            const error = new CustomError('You do not have permission to perform this action',403);
               next(error);
           } 
       next();     
    }
}