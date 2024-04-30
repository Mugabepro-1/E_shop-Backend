const {Category} = require('../models/category')
const express = require('express')
const router = express()

router.get('/', async(req,res)=>{
    const categoryList = await Category.find()
    if(!categoryList){
        res.status(500) .json({suceess:false})
    }
    res.status(200).send(categoryList)
});


router.get('/:id', async(req,res)=>{
    const category = await Category.findById(req.params.id)
    if(!category){
        res.status(404).json({message:'Category with this id'})
    }
    res.status(200).send(category)
});

router.post('/',async(req,res)=>{
    let category = new Category({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color
    })
    category = await category.save()
    if(!category){
        res.status(400) .send('The category can not be created')
    }
    res.send(category)
});

router.put('/:id', async(req,res)=>{
    const category = await Category.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            icon:req.body.icon || category.icon,
            color:req.body.color
        },
        {new:true}
    )
    if(!category){
        res.status(400).send('The category can not be updated')
    }
    res.send(category)
})

router.delete('/:id', (req,res)=>{
    Category.findByIdAndDelete(req.params.id).then(category => {
        if(category){
            res.status(200).json({suceess:true, message:'This category was deleted'})
        }
        else{
            res.status(404).json({success:false, message:'Failed to delete this category'})
        }
    }).catch((err) => {
        res.status(400).json({success:false, error:err})
    });
});



module.exports = router
