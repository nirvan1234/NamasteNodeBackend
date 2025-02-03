const validator = require("validator");

const validateSignUpData = (req) =>{
    const {password, email , name} = req.body;

    if(!name){
      throw new Error("Name is not Valid")
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not Valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a strong Password")
    }

}

const validateEditProfileData = (req) =>{
    const { email , name} = req.body;

    if(!name){
      throw new Error("Name is not Valid")
    }else if(!validator.isEmail(email)){
        throw new Error("Email is not Valid")
    }

}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}