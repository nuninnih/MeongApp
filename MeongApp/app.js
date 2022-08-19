const express = require('express')
const app = express()
const port = 3000
const session = require('express-session')
const router = require('./routes')

app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))
app.use(session({
  secret: 'meongmeong',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    sameSite: true
   } 
}))

app.use('/', router)


app.listen(port, () => {
  console.log(`I love you ${port}`)
})