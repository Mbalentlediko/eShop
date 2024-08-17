import express from 'express'
import bodyParser from 'body-parser'
import { products } from '../model/Index.js'
// import { verifyToken } from '../middleware/authenticateuser.js'

const productRouter = express.Router()

productRouter.use(bodyParser.json())

productRouter.get('/',  (req, res) => {
    products.fetchProducts(req, res)
})

productRouter.get('/recent', (req, res) => {
    products.recentProducts(req, res)
})

productRouter.get('/:id',  (req, res) => {
    products.fetchProduct(req, res)
})

productRouter.post('/add',  (req, res) => {
    products.addProduct(req, res)
})

productRouter.patch('/:id',  (req, res) => {
    products.updateProducts(req, res)
})

productRouter.delete('/:id',  (req, res) => {
    products.deleteProduct(req, res)
})

export {
    productRouter
}