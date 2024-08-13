import express from 'express'
import path from 'path'
import { connection as db } from './config/index.js'
import {createToken} from './middleware/authenticateuser.js'
import{compare, hash} from 'bcrypt'
import bodyParser  from 'body-parser'
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
router.use(bodyParser.json())

// Endpoint
router.get('^/$|/eShop', (req, res) => {
  res.status(200).sendFile(path.resolve('./static/html/index.html'))
})
router.get('/users', (req, res) => {
  try {
      const strQry = `
      SELECT firstName, lastName, age, emailAdd ,UserRole,ProfileURL
      FROM Users;
      `
      db.query(strQry, (err, results) => {
          if (err) throw new Error('Issue when retrieving all users.') 
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
})


router.get('/user/:id', (req, res) => { 
  try {
      const strQry = `
      SELECT userID, firstName, lastName, age, emailAdd, UserRole,ProfileURL
      FROM Users
      WHERE userID = ${req.params.id};
      `
      db.query(strQry, (err, result) => { 
          if (err) throw new Error('Issue when retrieving a user.')
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
})

router.post('/register', async (req, res) => {
  try {
      let data = req.body
      data.pwd = await hash(data.pwd, 12)
      // Payload
      let user = {
          emailAdd: data.emailAdd,
          pwd: data.pwd
      }
      let strQry = `
      INSERT INTO Users
      SET ?;
      `
      db.query(strQry, [data], (err) => {
          if (err) {
              res.json({
                  status: res.statusCode,
                  msg: 'This email has already been taken'
              })
          } else {
              const token = createToken(user)
              res.json({
                  token,
                  msg: 'You are now registered.'
              })
          }
      })
  } catch (e) {
      // 'Unable to add a new user.'
      res.json({
          status: 404,
          msg: e.message
      })
  }
})


router.patch('/user/:id', async (req, res) => {
  try {
    let data = req.body;
    if (data.pwd) {
      data.pwd = await hash(data.pwd, 12);
    }
    const strQry = `
    update Users
    SET ?
    where userID = ${req.params.id};
    `;
    db.query(strQry, [data], (err) => {
      if (err) throw new Error('Unable to update user');
      res.json({
        status: res.statusCode,
        msg: 'Congartulations you have successfully updated the user!'
      })
    })
  } catch (e) {
    res.json({
      status: 404,
      msg: e.message
    })
  }
})

router.delete('/user/:id', (req,res) => {
  try {
    const strQry = `
    DELETE FROM Users
    WHERE userID = ${req.params.id};
    `
    db.query(strQry, (err) => {
      if (err) throw new Error('To delete a user, please review your delete query.')
        res.json({
      status: res.statusCode,
    msg: 'A user \'s information was removed '})
    })
  }catch(e){
    res.json({
      status:404,
      msg:e.message
    })
  }
})


router.get('*', (req, res) => { 
  res.json({
      status: 404,
      msg: 'Resource not found'
  })
})

router.post('/login', (req, res) => {
  try {
      const { emailAdd, pwd } = req.body
      const strQry = `
      SELECT userID, firstName, lastName, age, emailAdd, pwd , UserRole,ProfileURL
      FROM Users
      WHERE emailAdd = '${emailAdd}';
      `
      db.query(strQry, async (err, result) => {
          if (err) throw new Error('To login, please review your query.')
          if (!result?.length) {
              res.json(
                  {
                      status: 401,
                      msg: 'You provided a wrong email.'
                  }
              )
          } else {
              const isValidPass = await compare(pwd, result[0].pwd)
              if (isValidPass) {
                  const token = createToken({
                      emailAdd,
                      pwd
                  })
                  res.json({
                      status: res.statusCode,
                      token,
                      result: result[0]
                  })
              } else {
                  res.json({
                      status: 401,
                      msg: 'Invalid password or you have not registered'
                  })
              }
          }
      })
  } catch (e) {
      res.json({
          status: 404,
          msg: e.message
      })
  }
})



app.listen(port, () => {
  console.log(`Server is running on ${port}`);
})
