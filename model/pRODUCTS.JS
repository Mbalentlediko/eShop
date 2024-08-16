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
recentProducts(req,res){
    try {
        const strQry = `
        SELECT productID,prodName,category,prodDescription,prodURL,amount
        FROM Products
        ORDER BY productID DESC
        LIMIT 5;
        ` 
        db.query(strQry,(err,results)=>{
            if (err) throw new Error('Unable to retrieve recent products') 
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
addProduct(req, res) {
    try {
      let strQry = `
        INSERT INTO Products
          SET ?
          `;
      db.query(strQry, [req,body], (err) => {
        if (err) throw new Error("Unable to add a new Product");{
          res.json({
            status: res.statusCode,
            msg: "Product was added successfully",
          });
        }
      });
    } catch (e) {
      res.json({
        status: 404,
        msg: e.message,
      });
    }
  }
 updateProducts(req,res) {
    try {
        const strQry = `
        update Products
        SET ?
        where productID = ${req.params.id};
        `;
        db.query(strQry, [req.data], (err) => {
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
