const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {User,validate} = require('../model/user');
const multer = require('multer');
const bcrypt = require('bcrypt');


const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb){ 
    cb(null, Date.now() + file.originalname); }
})
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png')
        cb(null,true);
    else{
        cb(new Error('File Type not supported'),false);
    }    
};

const upload = multer({
    storage : storage,
    fileFilter : fileFilter
});




/**
 * Get a particular User
 */
router.get('/get/:id', [auth,admin], async (req, res) => {
    
    const user = await User.findById(req.params.id).select('-password');
    if(!user) 
        return res.status('404').send(`The genre with given Id ${req.params.id} not found`);
    else 
        return res.status(201).send(user);  

})

/**
 * Get list of pending users
 */
router.get('/pendingList', [auth,admin], async (req, res) => {
    
    const doc = await User.find({status:"Pending"});
    res.status(200).send(doc);  
})


/**
 * Approve an user
 */
router.put('/approve/:userId', [auth,admin], async (req, res) => {
    
    const admin = await User.findById({_id : req.user._id});
    if(!admin) 
        return res.status(400).send('Admin not found');
    
    const user = await User.findById({_id : req.params.userId}).select('-password');
    if(!user) 
        return res.status(400).send('User not found');

    user.status = "Approved";
    
    await user.save();
    return res.status(200).send({
        message : 'User Approved',
        user : user
    });    

})




/**
 * Get list of approved users
 */
router.get('/approvedList', [auth,admin], async (req, res) => {
    
    const doc = await User.find({status:"Approved"}).select('-password');
    return res.status(200).send(doc);  
})



/**
 * Create an user
 */
router.post('/create', upload.single('profilePicture'), async (req,res)=>{
    
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    let dupUser = await User.findOne({ emailId : req.body.emailId })
    if(dupUser) return res.status(400).send('User EmailId Already exist');
    
    let user = new User({
        name : req.body.name,
        caption : req.body.caption,
        phoneNumber : req.body.phoneNumber,
        password : req.body.password,
        emailId : req.body.emailId,
        isAdmin : req.body.isAdmin,
        address : req.body.address,
        occupation : req.body.occupation,
    })
    if(req.file){
        user.profilePicture = req.file.path
    }
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);

    //If its the first user make it admin
    const doc = await User.find();
    if(doc.length == 0 ){
        user.isAdmin = true;
        user.status = "Approved";
    }

    await user.save();
    res.status(200).send({
        message : "User created",
        user : user
    }); 
});





/**
 * Edit an user
 */
router.put('/edit/:id', [auth,admin], async function (req, res, next) {
    const result = validate(req.body);
    if(result.error) return res.status(400).send(result.error.details[0].message);

    const dupUser = await User.findOne({ emailId: req.body.emailId, _id:{'$ne':req.params.id} });
    if(dupUser) return res.status(400).send('User Already exist');

    else {
      let user = await User.findByIdAndUpdate(req.params.id,{
        name : req.body.name,
        caption : req.body.caption,
        phoneNumber : req.body.phoneNumber,
        password : req.body.password,
        emailId : req.body.emailId,
        isAdmin : req.body.isAdmin,
        address : req.body.address,
        age : req.body.age,
        occupation : req.body.occupation,
      },{
          new : true
      });  
      
      if(!user) return res.status('404').send(`The user with given Id not found`)

      res.status(201).json({
            message : 'edited successfully',
            user: user
        });
    }
  });


/**
 * Delete a particular User
 */
router.delete('/delete/:id',[auth,admin], async (req, res) => {
    
    const user = await User.findByIdAndRemove(req.params.id);
    if(!user) 
        return res.status('404').send(`The genre with given Id ${req.params.id} not found`)
    else
        res.status(200).send({
            message : "Deleted Successfully",
            user
        });

})

 


module.exports = router;
