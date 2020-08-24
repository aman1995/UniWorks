const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({

    name : {
        type:String,
        required:true
    },
    profilePicture : {
        type:String
    },
    caption : {
        type:String
    },
    phoneNumber : {
        type:Number,
    },
    emailId:{
        type:String,
        unique:true,
        required:true
    },
    password : {
        type : String,
        required : true,
    },
    isAdmin:{
        type : Boolean,
        default: false,
    },
    status : {
        type : String,
        default : "Pending"
    },
    occupation : {
        type : String
    },
    address : {
        type : String
    },

})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ _id : this._id, isAdmin : this.isAdmin} , config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('User', userSchema);

const validate = ((user)=>{
    const schema = {
        name : Joi.string().required(),
        emailId : Joi.string().required().email(),
        password : Joi.string().required(),
        isAdmin : Joi.boolean(),
        phoneNumber : Joi.number(),
        occupation : Joi.string(),
        caption : Joi.string()
     };
     return Joi.validate(user , schema)
})

module.exports.userSchema = userSchema;
module.exports.User = User;
module.exports.validate = validate;