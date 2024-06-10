const mongoose = require('mongoose')
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


const userSchema =  mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    requried:true,
    validate:{
      validator:function(v){
        return emailRegex.test(v)
      },
      message: props=>'This is not a valid email'
    }
  },
  passwordHash:{
    type:String,
    requried:true
  },
  phone:{
    type:String,
    requried:true
  },
  isAdmin:{
    type:Boolean,
    default:false  
  },
  street:{
    type:String,
    default:''
  },
  apartment:{
    type:String,
    default:''
  },
  zip:{
    type:String,
    default:''
  },
  city:{
    type:String,
    default:''
  },
  country:{
    type:String,
    default:''
  }
})

 
userSchema.virtual('id').get(function(){
  return this._id.toHexString()
 })
userSchema.set('toJSON',{
  virtuals:true
})

exports.User = mongoose.model('User', userSchema)