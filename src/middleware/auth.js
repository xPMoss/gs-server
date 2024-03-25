

// middleware/authMiddleware.js
require('dotenv').config()
//const env = require('./src/environment/environment');
const env = process.env;

function verifyToken(req, res, next) {
    const token = req.header('Authorization');
    console.log("token", token)


    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }



    try {
        
        console.log("ACCESS", env.ACCESS)

        if (token == env.ACCESS) {
            console.log("token passed")
            next();
        }
        else{
            return res.status(401).json({ error: 'Access denied' });

        }
       

    }
    catch (error) {  
        res.status(401).json({ error: 'Invalid token' });

    }

    
 };

module.exports = verifyToken;





exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try{
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(401).send();

            } 
            else{
                req.jwt = jwt.verify(authorization[1], secret);
                return next();

            }

        }
        catch (err) {
            return res.status(403).send();

        }
    }
    else{
        return res.status(401).send();

    }

}; 


exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.permission_level);
        let user_id = req.jwt.user_id;

        if(user_permission_level & required_permission_level){
            return next();

        }
        else{
            return res.status(403).send();

        }

    };
    
 };