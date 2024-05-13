export const CheckFile=(req,res,next)=>{
    if(!req?.file){
        return res.status(400).json({success:0,errorType:"FileNotUpload",msg:"File is not uploaded"})
    }
    next()
}