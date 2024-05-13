import fs from "fs"
export const DeleteFile=async(file)=>{
    try {
        if(!file){
            return
        }
        await fs.promises.unlink(file.path)
    } catch (error) {
        //(error.message)
    }

}