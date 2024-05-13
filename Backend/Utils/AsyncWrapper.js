export const Wrapper=(func)=>{
    return async(req,res,next)=>{
        try {
            await func(req,res,next)
        } catch (error) {
            //(error)
            res.status(500).json({success:0,errorType:"ServerSide",msg:error.message})
        }
    }
}