const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
    try{
        const hashedPassword = await bcrypt.hash(password , 10);    // brcypt.hash() hashes the password to keep it keep and secure while stored in backend,   here 10 -> is bascially "salt rounds" which actually means cost factor. i.e it controls how much time is needed to calculate a single bcrypt hash

        return hashedPassword;
    }
    catch(error){
        console.log(error);
    }
}

const comparePassword = async (password , hashedPassword) => {
    const comparedPassword = await bcrypt.compare(password,hashedPassword);         // this compare() compares the password entered with the hased password stored in database

    return comparedPassword;
}

module.exports = {
    hashPassword,
    comparePassword
}