
const jwt=require('jsonwebtoken')
function verifyAuthenticatedUser(req, res, next) {
    let token = req.headers.authorization
    jwt.verify(token, process.env.JWT_SECRET_KEY, (error) => {
        if (error) {
            res.status(401).send({ result: "Fail", reason: "You Are Not An Authorized User to Access this API" })
        } else
            next()
    })
}

module.exports = verifyAuthenticatedUser