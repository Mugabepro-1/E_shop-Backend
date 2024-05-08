const {User} = require('../models/user')
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express()

router.get('/', async(req,res)=>{
    const userList = await User.find()
    if(!userList) {
        res.status(500) .json({success:false}
        )}
     res.send(userList)
});
router.get('/:id', async(req,res)=>{
    const user = await User.find().select('-passwordHash')
    if(!user) return res.status(400).json({success:false})

    res.send(user)
})

router.post('/', async(req,res)=>{
    let user = new User({
        name:req.body.name,
        email:req.body.email,
        passwordHash:bcrypt.hashSync(req.body.passwordHash,10),
        phone:req.body.phone,
        isAdmin:req.body.isAdmin,
        street:req.body.street,
        apartment:req.body.apartment,
        zip:req.body.zip,
        city:req.body.city,
        country:req.body.country
    })
  user = await user.save()
  
  if(!user) return res.status(500).send('User cannot be created')
  res.send(user)
});

router.post('/login', async(req,res)=>{
    const user = await User.findOne({email:req.body.email})
    const secret = process.env.sec

    if(!user) return res.status(400).send('User not found')
    if(user && bcrypt.compareSync(req.body.password,user.passwordHash)){
        const token = jwt.sign(
            {
            userId:user._id
            },
            secret,
            {expiresIn:'1d'}
  )
        res.status(200).send({user:user.email, token})
    }else{
        res.status(400).send('Incorrect password')
    }
})

module.exports =router