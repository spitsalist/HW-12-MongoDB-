import {Router} from 'express'
import { MongoClient, ObjectId } from 'mongodb'
import {validObjectId} from '../middleware/middleware.js'

export const router = Router()
const uri = process.env.DATABASE_URL
const client = new MongoClient(uri)

const getProductsCollection = async () => {
    await client.connect()
    const database = client.db('testdb')
    return database.collection('products')
}

router.get('/products', async(req, res) => {
    try {
        const products = await getProductsCollection()
        const allProducts = await products.find().toArray()
        res.status(200).json(allProducts)
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
})

router.get('/products/:id', validObjectId, async(req, res) => {
    const {id} = req.params
    try {
        const products = await getProductsCollection()
        const product = await products.findOne({ _id: new ObjectId(id)})

        if (!product) {
            return res.status(404).json({message: 'Product not found'})
            }
            res.status(200).json(product)
    }catch(error){
        console.error('error fetching product', error)
        return res.status(500).json({message: 'Internal server error'})
    }
})

router.post('/products',async(req, res) => {
    const {name, price, description} = req.body
    try {
        const products = await getProductsCollection()
        const newProduct = {name, price, description}
        await products.insertOne(newProduct)
        res.status(201).json(newProduct)
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
    }
    
})
router.put('/products/:id',validObjectId, async (req, res) => {
    const {id} = req.params 
    const {name, price, description} = req.body
    try{
        const products = await getProductsCollection()
        const updateProduct = await products.findOneAndUpdate(
            {_id: new ObjectId(id)},
            {$set: {name, price, description}},
            {returnOriginal: false}
        )
        if(!updateProduct.value){
            return res.status(404).json({message: 'Product not found'})
    }
    res.status(200).json(updateProduct.value)
    }catch(error){
        res.status(500).json({message: 'Internal server error'})
        }
        })

        router.delete('/products/:id',validObjectId,async (req, res) => {
            const {id} = req.params
            try{
                const products = await getProductsCollection()
                const deleteProduct = await products.findOneAndDelete({_id: new ObjectId(id)})
                if(!deleteProduct.value === 0){
                    return res.status(404).json({message: 'Product not found'})
                    }
                    res.status(200).json({message: 'Product deleted'})
                    }catch(error){
                        res.status(500).json({message: 'Internal server error'})
                        }
                })

