


exports.login = (req, res) => {
    try {
        let refreshId = req.body.userId + jwtSecret;
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
        req.body.refreshKey = salt;
        let token = jwt.sign(req.body, jwtSecret);
        let b = Buffer.from(hash);
        let refresh_token = b.toString('base64');
        res.status(201).send({accessToken: token, refreshToken: refresh_token});
    } catch (err) {
        res.status(500).send({errors: err});
    }
 };

 

 exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByEmail(req.body.email)
        .then((user)=>{
            if(!user[0]){
                res.status(404).send({});
            }
            else{
                let passwordFields = user[0].password.split('$');
                let salt = passwordFields[0];
                let hash = crypto.createHmac('sha512', salt)
                                 .update(req.body.password)
                                 .digest("base64");
                                 
                if (hash === passwordFields[1]) {
                    req.body = {
                        userId: user[0]._id,
                        email: user[0].email,
                        permissionLevel: user[0].permissionLevel,
                        provider: 'email',
                        name: user[0].firstName + ' ' + user[0].lastName,
                    };
                    return next();
                } else {
                    return res.status(400).send({errors: ['Invalid email or password']});
                }
            }
        });
 };


 /*


exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512',salt)
                                     .update(req.body.password)
                                     .digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.permissionLevel = 1;
    UserModel.createUser(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
  };
  


exports.patchById = (req, res) => {
    if (req.body.password){
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }
    UserModel.patchUser(req.params.userId, req.body).then((result) => {
            res.status(204).send({});
    });
 };



 exports.removeById = (req, res) => {
    UserModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
 };


 */