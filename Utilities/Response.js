
class SendResponse{
    errorMsg(req,res,status,message, error,scope){
        res.status(status).json({message:message})
    };

    successMsg(req,res,status,data,message){
        res.status(status).json({message:message,data:data})
    };

    customMsg(req,res,status,data,message){
        res.status(status).json({message:message,data:data})
    };
}

module.exports = new SendResponse();