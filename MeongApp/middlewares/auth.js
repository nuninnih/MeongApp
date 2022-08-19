const router = require('express').Router()

const isLogin = router.use((req, res, next) => {
    if(!req.session.userId){
        const error = 'Login required'
        res.redirect(`/login?error=${error}`)
    }else{
        next()
    }
  })

  module.exports = isLogin