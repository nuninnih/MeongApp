const { User, Profile, Post } = require('../models')
const { decrypt } = require('../helpers/helper')
const dateFormat = require('../helpers/dateFormat')
const { Op } = require('sequelize')
const GetLocation = require('location-by-ip')

class Controller {
    static index(req, res){
        res.render('index')
    }

    static registerForm(req, res){
        res.render('register')
    }

    static postRegister(req, res){
        const { email, username, password } = req.body
        User.create({
            email,
            username,
            password
        })
        .then(newUser => {
            res.redirect(`/regProfile?username=${username}`)
        })
        .catch(err => {
            let errors = err
            if(err.name === 'SequelizeValidationError'){
                errors = err.errors.map(el => el.message)
            }
            res.send(errors)
        })
    }

    static profileForm(req, res){
        const username = req.query.username
        User.findOne({where : {username : username}})
        .then(result => {
            res.render('profileAddForm', {user: result})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static postRegProfile(req, res){
        let { email, username, phone, fullName, gender, location, dateOfBirth } = req.body
        console.log(email, username, phone, fullName, gender, location, dateOfBirth);

        let userId = ''
        
        User.findOne({where : {username : username}})
        .then(user => {    
            userId = user.id 
            return User.update({
                email :email,
                username : username,
                phone : phone
            }, {
                where:  {id : user.id}
            })
        })
        .then(prof => {
            return Profile.create({ fullName, gender, location, dateOfBirth, UserId : userId })
        })
        .then(result => {
            res.redirect('/login')
        })
        .catch(err => {
            let errors = err
            if(err.name === 'SequelizeValidationError'){
                errors = err.errors.map(el => el.message)
            }
            res.send(errors)
        })
    }

    static loginForm(req, res){
        const { error } = req.query
        res.render('login', {error})
    }

    static postLogin(req, res){
        const { username, password } = req.body

        User.findOne({
            where : {
                username
            }
        })
        .then(user => {
            if(user){
                const isValidPassword = decrypt(password, user.password)

                if(isValidPassword){
                    req.session.userId = user.id
                    res.redirect('/home')
                }else{
                    const error = 'Invalid Username or Password'
                    res.redirect(`/login?error=${error}`)
                }
            }else{
                const error = 'Invalid Username or Password'
                    res.redirect(`/login?error=${error}`)
            }
        })
        .catch(err => {
            res.send(err)
        })
    }

    static logout(req, res){
        req.session.destroy(err => {
            if(err){
                res.send(err)
            }else{
                res.redirect('/login')
            }
        })
    }

    static editProfileForm(req, res){
        User.findOne({
            where: {id : req.session.userId},
            include : Profile
        })
        .then(result => {
            res.render('profileEditForm', {user : result})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static postEditProfile(req, res){
        const {email, username, phone, fullName, gender, location, dateOfBirth} = req.body
        
        User.update({
            email,
            username,
            phone
        }, {
            where: {
                id : req.session.userId
            }
        })
        .then(user => {
            Profile.update({
                fullName,
                gender,
                location,
                dateOfBirth
            }, {
                where: {
                    UserId : req.session.userId
                }
            })
        })
        .then(prof => {
            res.redirect('/profile')
        })
        .catch(err => {
            let errors = err
            if(err.name === 'SequelizeValidationError'){
                errors = err.errors.map(el => el.message)
            }
            res.send(errors)
        })

    }

    static profileView(req, res){
        let search = req.query.search
        if(!search) search = ''

        Profile.findOne({ 
            where: {UserId : req.session.userId},
            include : [{
                model: User,
                include : [{
                    model: Post,
                    order: [['createdAt', 'DESC']],
                    where: { post: {
                        [Op.iLike] : `%${search}%`
                    } }
                }]
            }]
        })
        .then(result => {
            if(!result){
                throw new Error('No Post Found')
            }
            res.render('profile', {profile: result, dateFormat})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static home(req, res){
        const dataProfile = ''
        Post.findAll({
            order: [['createdAt', 'DESC']],
            include : [{
                model: User,
                include : [{
                    model: Profile
                }]
            }
        ]
        })
        .then(result => {
            res.render('home', {post: result, profile: dataProfile, userId: req.session.userId, dateFormat})
        })
        .catch(err => {
            let errors = err
            if(err.name === 'SequelizeValidationError'){
                errors = err.errors.map(el => el.message)
            }
            res.send(errors)
        })
    }

    static addPost(req, res){
        const id = req.session.userId
        const { post } = req.body
        let location = ''
        
        const SPOTT_API_KEY = 'c061bd9c51msh227937cd442427bp1be0a6jsn905df7c9cdd3'
        const getLocation = new GetLocation(SPOTT_API_KEY)
        getLocation.byMyIp()
        .then(loc => {
            location = loc.name
            Post.create({
                post: post,
                UserId: id,
                like: 0,
                loc: location
            })
        })
        .then(result => {
            res.redirect('/home')
        })
        .catch(err => {
            let errors = err
            if(err.name === 'SequelizeValidationError'){
                errors = err.errors.map(el => el.message)
            }
            res.send(errors)
        })
    }

    static likePost(req, res){
        const postId = req.params.postId
        Post.increment({like : 1}, {where: { id : postId}})
        .then(result => {
            res.redirect('/home')
        })
        .catch(err => {
            let errors = err
            if(err.name === 'SequelizeValidationError'){
                errors = err.errors.map(el => el.message)
            }
            res.send(errors)
        })
    }

    static deletePost(req, res){
        const postId = req.params.postId
        Post.destroy({where : {id : postId}})
        .then(result => {
            res.redirect('/home')
        })
        .catch(err => {
            let errors = err
            if(err.name === 'SequelizeValidationError'){
                errors = err.errors.map(el => el.message)
            }
            res.send(errors)
        })
    }
}

module.exports = Controller