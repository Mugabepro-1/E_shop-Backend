const {Product} = require('../models/product')
const {Category}  =require('../models/category')
const checkAdmin = require('../helpers/checkAdmin')

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const { Order } = require('../models/order')

router.get(`/`, async (req, res) => {
    try {
        let filter = {}; 
        if (req.query.categories) {
            const categories = req.query.categories.split(',');
            filter = { category: { $in: categories } };
        }

        const productList = await Product.find(filter).select('name image -_id').populate('category');

        if (productList.length === 0) {
            return res.status(404).json({ success: false, message: 'No products found for the specified categories.' });
        }

        return res.status(200).json({ success: true, data: productList });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

router.get('/:id', async(req,res)=>{
    const product = await Product
    .findById(req.params.id)
    //.select('name image -_id')
    .populate('category')
    if(!product) return res.status(500) .json({success:false})

    res.send(product)
})

router.post('/',checkAdmin, async(req,res)=>{
  

    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid category')

    let product = new Product({
        name:req.body.name,
        description:req.body.description,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured
    })
    product = await product.save()
    if(!product) return res.status(500).send('Product cannot be created')
    
    res.send(product)
})

router.put('/:id',checkAdmin, async(req,res)=>{

    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product id')
    }
   
    const category = await Category.findById(req.body.category)
    if(!category) return res.status(400).send('Invalid category')

    const product = await Product.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name,
            description:req.body.description,
            richDescription:req.body.richDescription,
            image:req.body.image,
            brand:req.body.brand,
            price:req.body.price,
            category:req.body.category,
            countInStock:req.body.countInStock,
            rating:req.body.rating,
            numReviews:req.body.numReviews,
            isFeatured:req.body.isFeatured 
        },
        {new:true}
    )

    if(!product) return res.status(400) .send('The product can not be update')

    res.send(product)
});

router.delete('/:id',checkAdmin, (req,res)=>{
    const product = Product.findByIdAndDelete(req.params.id)
    .then(product=>{
        if(product) return res.status(200).json({success:false, message:'Product deleted successfully'})
        else{
    return res.status(404).json({success:false, message:'The product was not deleted'})
}
    })
    .catch(err=>{
        return res.status(500).json({success:false, error:err})
    })
});

router.get('/get/count', async(req,res)=>{
    const productCount = await Product.countDocuments()

    if(!productCount) return res.status(500).json({success:false})
    res.send({
      NumberofProducts:productCount
 })
    
});

router.get('/get/featured/:count', async(req,res)=>{
    const count = req.params.count ? req.params.count:0
    const productCount = await Product.find({isFeatured:true}).limit(+count)

    if(!productCount) return res.status(500).json({success:false})
    
    res.send(productCount)
});


router.get('/get/totalsales', async(req,res)=>{
    const totalSales = await Order.aggregate([
        {$group :{ _id:null, totalSales: {$sum:'$totalPrice'}}}
    ])
})
module.exports = router;
