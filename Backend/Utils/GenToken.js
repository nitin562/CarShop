import jwt from "jsonwebtoken"
export const GenToken=(payload)=>{
    return jwt.sign(payload,process.env.JWT_KEY)
}