const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {User} = require('../model/user');
const Joi = require('joi');


//HTTP post
router.post('/', async (req,res)=>{
    
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    let user = await User.findOne({ emailId : req.body.emailId })
    if(!user) return res.status(400).send('Invalid Credentials');

   const validPassword = await bcrypt.compare(req.body.password , user.password);
   if(!validPassword) return res.status(400).send('Invalid Credentials');

   const token = user.generateAuthToken();
   res.send(token);

});


const validate = ((user)=>{
    const schema = {
        emailId : Joi.string().required().email(),
        password : Joi.string().required()
     };
     return Joi.validate(user , schema)
})


module.exports = router;