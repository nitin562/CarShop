export const parseObject=(obj)=>{
    try {
        if(!obj){
            return false
        }
        

        const parsed=JSON.parse(obj)
        return true
    } catch (error) {
        //(error.message)
        return false
    }
}