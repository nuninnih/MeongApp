const bcrypt = require('bcryptjs');

function encrypt(value){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(value, salt);

    return hash
}

function decrypt(value, salt){
    return bcrypt.compareSync(value, salt)
}

module.exports = {encrypt, decrypt}