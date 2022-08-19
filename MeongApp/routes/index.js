const Controller = require('../controllers/controller')
const isLogin = require('../middlewares/auth')

const router = require('express').Router()

//index
router.get('/', Controller.index)

//register
router.get('/register', Controller.registerForm)
router.post('/register', Controller.postRegister)

//reg Profile
router.get('/regProfile', Controller.profileForm)
router.post('/regProfile', Controller.postRegProfile)

//login
router.get('/login', Controller.loginForm)
router.post('/login', Controller.postLogin)

//logout
router.get('/logout', Controller.logout)

//session
router.use(isLogin)

//home & add Post
router.get('/home', Controller.home)
router.post('/home', Controller.addPost)

//view Profile
router.get('/profile', Controller.profileView)

//edit Profile
router.get('/editProfile', Controller.editProfileForm)
router.post('/editProfile', Controller.postEditProfile)

//like
router.get('/post/:postId/like', Controller.likePost)

//delete
router.get('/post/:postId/delete', Controller.deletePost)

//edit profile

module.exports = router