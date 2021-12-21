//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const express = require('express')
const {Router} = require('express')
const routerWeb = new Router()
const {userModel} = require('../options/mongoDB');
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport')

routerWeb.use(express.json())
routerWeb.use(express.urlencoded({ extended: true }))

/******************  ROUTES  ******************/
//Estrategia Home Page
routerWeb.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.sendFile('index.html', { root: './public/home' })}
)

//Estrategia API Get User (para mostrar el nombre de usuario en plantillas login/logout)
routerWeb.get('/api/user', (req, res) => {
  res.json(req.user.username)
})

//Estrategia API Get User (para mostrar el nombre de usuario en plantillas login/logout)
routerWeb.get('/info', (req, res) => {
  res.sendFile('info.html', { root: './public/login' })
})

// Estrategia de Login
routerWeb.get('/login', (req, res) => {
  res.sendFile('login.html', { root: './public/login' })
})

routerWeb.post('/login', 
  passport.authenticate('local', { failureRedirect: '/login-error', successRedirect: '/' })
)


// Estrategia de Register
routerWeb.get('/register', (req, res) => {
    res.sendFile('register.html', { root: './public/login' })
})

routerWeb.post('/register', (req, res) => {
  const { username, password } = req.body
  userModel.register({ username: username, active: false }, password, function (err, user) {
    if (err) {
      console.log(`Error al registrar el usuario #${username}`)
      res.redirect('/register-error')
    } else {
      res.redirect('/login')
    }
  })
})

// Estrategia de Register Error
routerWeb.get('/register-error', (req, res) => {
  res.sendFile('register-error.html', { root: './public/login' })
})

// Estrategia de LOGOUT
routerWeb.get('/logout-despedida', (req, res) => {
  res.sendFile('logout.html', { root: './public/login' })
})
routerWeb.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/login')
})

// Estrategia de Login Error
routerWeb.get('/login-error', (req, res) => {
  res.sendFile('login-error.html', { root: './public/login' })
})


module.exports= routerWeb