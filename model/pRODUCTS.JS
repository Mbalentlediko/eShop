import { connection as db } from './config/index.js'
import{compare, hash} from 'bcrypt'

class Products {
fetchProducts(req,res) {
   
        try {
            const strQry = `
            SELECT productID,prodName,category,prodDescription,prodURL,amount
            FROM Products;
            `
            db.query(strQry, (err, results) => {
                if (err) throw new Error('There was a problem fetching all products.') 
                res.json({
                    status: res.statusCode,
                    results
                })
            })
        } catch (e) {
            res.json({
                status: 404,
                msg: e.message
            })
        }
      
}
fetchProduct(req,res) {
    try {
        const strQry = `
        SELECT productID,prodName,category,prodDescription,prodURL,amount
        FROM Products
        WHERE productID = ${req.params.id};
        `
        db.query(strQry, (err, result) => { 
            if (err) throw new Error('There was a problem fetching your product.')
            res.json({
                status: res.statusCode,
                result: result[0]
            })
        })
    } catch (e) { 
        res.json({
            status: 404,
            msg: e.message
        })
    }
}
async registerProduct(req,res) {
    try {
        let data = req.body
        data.pwd = await hash(data.pwd, 12)
        // Payload
        let product = {
            prodName: data.prodName,
            category: data.category
        }
        let strQry = `
        INSERT INTO Products
        SET ?;
        `
        db.query(strQry, [data], (err) => {
            if (err) {
                res.json({
                    status: res.statusCode,
                    msg: 'This product already exists'
                })
            } else {
                    msg: 'You are now registered.'
                
            }
        })
    } catch (e) {
        // 'Unable to add a new product.'
        res.json({
            status: 404,
            msg: e.message
        })
    }
}
async updateProducts(req,res) {
    try {
        let data = req.body;
        if (data.prodName) {
          data.prodName = await hash(data.prodName, 12);
        }
        const strQry = `
        update Products
        SET ?
        where productID = ${req.params.id};
        `;
        db.query(strQry, [data], (err) => {
          if (err) throw new Error('Unable to update product');
          res.json({
            status: res.statusCode,
            msg: 'Congratulations you have successfully updated the product!'
          })
        })
      } catch (e) {
        res.json({
          status: 404,
          msg: e.message
        })
      }
}
deleteProduct(req,res) {
    try {
        const strQry = `
        DELETE FROM Products
        WHERE productID = ${req.params.id};
        `
        db.query(strQry, (err) => {
          if (err) throw new Error('To delete a product, please review your delete query.')
            res.json({
          status: res.statusCode,
        msg: 'A product \'s information was removed '})
        })
      }catch(e){
        res.json({
          status:404,
          msg:e.message
        })
      }
}
}
export{Products};
