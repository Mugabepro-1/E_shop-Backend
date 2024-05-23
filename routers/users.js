const { User } = require("../models/user");
const checkAdmin = require("../helpers/checkAdmin");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const router = express();

router.get("/", checkAdmin, async (req, res) => {
  const userList = await User.find();
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});
router.get("/:id", checkAdmin, async (req, res) => {
  const user = await User.find().select("-passwordHash");
  if (!user) return res.status(400).json({ success: false });

  res.send(user);
});

router.post("/", checkAdmin, async (req, res) => {
  //const hashedPassword = req.body.password
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    //passwordHash:  bcrypt.hashSync(toString(hashedPassword) ,10),
    passwordHash:bcrypt.hashSync(req.body.password,10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(500).send("User cannot be created");
  res.send(user);
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.sec;

  if (!user) return res.status(400).send("User not found");
  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user._id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );
    res.status(200).send({ user: user.email, token });
  } else {
    res.status(400).send("Incorrect password");
  }
});
router.post(`/register`, async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();
  if (!user) {
    res.status(500).json("User cannot be created");
  }
});

router.put("/:id",checkAdmin, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send("Invalid User");
  }
  const category = await User.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid category");

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );
  if (!user) return res.status(400).send("The user can not be updated");
  res.send(user);
});
router.delete('/:id',checkAdmin, async(req,res)=>{
    const user  = await User.findByIdAndDelete(req.params.id)
    .then(user=>{
        if(user) return res.status(200).json({success:false, message:'user deleted successfully'})
        else{
    return res.status(404).json({success:false, message:'The user was not deleted'})
}
    })
    .catch(err=>{
        return res.status(500).json({success:false, error:err})
    })
})

module.exports = router;
