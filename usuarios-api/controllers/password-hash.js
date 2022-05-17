const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.hashPassword = (password) => {
    console.log(password);
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(password, salt, function (err, hash) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(hash);
                return;
            });
        });
    });
};

exports.passwordVerify = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
            return;
        });
    });
};
