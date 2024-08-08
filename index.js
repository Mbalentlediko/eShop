import express from 'express'
import path from 'path'
import { connection as db } from './config/index.js'

// Create an express app
const app = express()
const port = +process.env.port
const router = express.Router()

// Middleware 
app.use(router,
 express.static('./static'),
express.json(),
express.urlencoded({
    extended:true
}))

// Endpoint
router.get("^/$|/eShop", (req, res) => {
    res.status(200).sendFile(path.resolve("./static/html/index.html"));
  });
  router.get("/users", (req, res) => {
    try {
      const strQry = `
              select firstName, lastName, age, emailAdd
              from Users;
              `;
      db.query(strQry, (err, results) => {
        if (err) throw new Error(`Unable to fetch all users`);
        res.json({
          status: res.statusCode,
          results,
        });
      });
    } catch (e) {
      res.json({
        status: 404,
        msg: e.message,
      });
    }
  });
  //listen is a function that starts the server
  app.listen(port, () => {
    console.log(`Server is running on ${port}`);
  });







