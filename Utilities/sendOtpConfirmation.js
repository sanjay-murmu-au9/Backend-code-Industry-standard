const request = require('./request');

module.exports = async (mobileNumber, otpBody, otp, tmpId, expiryTime) => {
    try {
        //generate the otp;
        let baseUrl = process.env.smsUrl,
            authkey = process.env.authkey,
            otpType = process.env.otpType,
            otpBalUrl = process.env.otpBalUrl;

        //check the balance
        otpBalUrl = `${otpBalUrl}?authkey=${authkey}&type=${otpType}`;

        // fetching the otp balance;
        let fetchOtpBal = await request.get(otpBalUrl)
            .timeout({
                response: 99999, // wait a min for the server to start sending;
                deadline: 99999 // but allow minutes for the file to finish loading
            }).retry(1)
            .then((res) => {
                return { success: true, data: !isNaN(res.text) ? parseInt(res.text) : 0 }
            }, (err) => {
                if (err.timeout) {
                    return {
                        success: false,
                        error: 'API timeout'
                    }
                } else {
                    return {
                        success: false,
                        error: er
                    }
                }
            })


        //getting the otp balance
        if (fetchOtpBal.success && fetchOtpBal.data > 0) {
            //extra params;
            let extraParams = {
                'Company_Name': "Sasta Lens",
                'OTP_Expiry': expiryTime,
                "OTP": otp
            }
            // generating the otp url
            baseUrl = `${baseUrl}?authkey=${authkey}&mobiles=${parseInt(mobileNumber)}&country=91&invisible=1&extra_param=${JSON.stringify(extraParams)}&message=${otpBody}&sender=WAYCOL&route=4&DLT_TE_ID=${tmpId}`;

            console.log(baseUrl)

            return request.get(baseUrl)
                .timeout({
                    response: 99999,
                    deadline: 99999
                })
                .retry(1)
                .then((res) => {
                    return {
                        success: true,
                        data: { 'request_id': res.text } //JSON.parse(res.text)
                    }
                }, (err) => {
                    if (err.timeout) {
                        return {
                            success: false,
                            error: 'API timeout'
                        }
                    } else {
                        return {
                            success: false,
                            error: err
                        }
                    }
                })

        } else {
            return {
                success: false,
                error: `Kindly recharge your OTP Account, Bal Left : ${fetchOtpBal.data}`
            }
        }


    } catch (e) {
        error(e);
        return {
            success: false,
            error: e
        }
    }
}