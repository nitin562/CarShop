import jwt from "jsonwebtoken"
export const DecodeToken=(req,res,next)=>{
    const token=req.header("token")
    if(!token){
        return res.status(400).json({success:0,errorType:"NoToken",msg:"Token is absent"})
    }
    try {
        const TokenData=jwt.verify(token,process.env.JWT_KEY)
        req.user=TokenData.id
    
        next()
    } catch (error) {
        return res.status(400).json({success:0,errorType:"WrongToken",msg:"Token is wrong"})
    }
}