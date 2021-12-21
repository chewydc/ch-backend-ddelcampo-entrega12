//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const mongoose = require('mongoose');
const config = require('../config');
const passportLocalMongoose = require('passport-local-mongoose');

//const mongoUrl= 'mongodb+srv://admin:<PASSWORD>@cluster0.e47it.mongodb.net/ecommerce?retryWrites=true&w=majority'
const mongoUrl= `mongodb+srv://${config.credenciales.MONGO_ATLAS_USER}:${config.credenciales.MONGO_ATLAS_PASSWORD}@${config.credenciales.MONGO_ATLAS_CLUSTER}/${config.credenciales.MONGO_ATLAS_DBNAME}?retryWrites=true&w=majority`
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true }

// Connecting Mongoose
mongoose.connect(mongoUrl, advancedOptions)

// Setting up the schema
const User = new mongoose.Schema({
  username: String,
  password: String,
});

// Setting up the passport plugin
User.plugin(passportLocalMongoose);

let userModel =  mongoose.model('User', User);
module.exports= {mongoUrl,advancedOptions,userModel};