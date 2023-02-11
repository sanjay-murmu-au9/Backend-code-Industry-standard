
class SendResponse {
    errorMsg(req, res, status, message, error, scope) {
        res.status(status).json({ status: status, message: message })
    };

    successMsg(req, res, status, data, message) {
        res.json({ status: status, message: message, data: data })
    };

    customMsg(req, res, status, data, message) {
        res.json({ status: status, message: message, data: data })
    };

    joiErrorMsg(req, res, err) {
        // console.log(err, "mesJOI")
        let error = err.details.reduce((prev, curr) => {
            // console.log(prev, "<prev", curr, "<<cur")
            prev[curr.path[0]] = curr.message.replace(/"/g, '');
            return prev;
        }, {});
        let message = 'Bad Request';
        let status = 400;
        return res.status(status).json({ status, message, error })
    }
}

module.exports = new SendResponse();