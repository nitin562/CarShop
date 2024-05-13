import multer from "multer"
const Storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"UploadFolder/")
    },
    filename:function(req,file,cb){
        let newName=Date.now()+"-"+file.originalname
        cb(null,newName)
    }
})

export const upload=multer({storage:Storage})