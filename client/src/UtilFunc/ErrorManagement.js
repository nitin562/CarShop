export const ErrorManage=(result,fieldsArr)=>{
    let errorObj={}
    if(result.errorType==="ClientSide"){
        fieldsArr.forEach((e)=>{
            //(e)
            if(result.msg?.[e]){
                errorObj={...errorObj,[e]:result.msg[e].msg}
            }
        })
    }
    else if(result.errorType==="ExistedAccount"){
        errorObj={...errorObj,email:result.msg}
    }
    else if(result.errorType==="NoAccount"){
        errorObj={...errorObj,email:result.msg}
    }
    else if(result.errorType==="WrongPassword"){
        errorObj={...errorObj,password:result.msg}
        
    }
    else if(result.errorType==="FileNotUpload"){
        errorObj={...errorObj,file:result.msg}
    }
    else{
        errorObj={...errorObj,server:result.msg}
        
        
    }
    return errorObj
}