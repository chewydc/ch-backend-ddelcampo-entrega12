//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const express = require('express')
const session = require('express-session')
const app = express()
const { Server: HttpServer } = require('http')
const { Server: IOServer } = require('socket.io')
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const passport = require('passport');
const {userModel,advancedOptions,mongoUrl} = require('./options/mongoDB');
const MongoStore = require('connect-mongo')

//-------------------------------------------------------------------
// Seteo la Session
const config = require('./config');
app.use(
  session({
      //Persistencias de sesiones en MongoDB Atlas
      store: MongoStore.create({
      mongoUrl: mongoUrl,
      mongoOptions: advancedOptions
      }),
    secret: config.credenciales.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,  
    cookie: {
      maxAge: 60000
    }
  })
);
app.use(passport.initialize())
app.use(passport.session())
//-------------------------------------------------------------------

app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

passport.use(userModel.createStrategy());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


//-------------------------------------------------------------------
//Declaro Router a utilizar
const routerMensajes = require("./router/mensajes")
const routerProductos = require("./router/productos")
const routerProductostest = require("./router/productos-test")
const routerInfo = require("./router/info")
const routerRandom = require("./router/random")
const routerWeb = require("./router/webpage")

app.use('/api/mensajes',routerMensajes)
app.use('/api/productos',routerProductos)
app.use('/api/productos-test',routerProductostest)
app.use('/api/info',routerInfo)
app.use('/api/randoms',routerRandom)
app.use('/',routerWeb)
//-------------------------------------------------------------------

//-------------------------------------------------------------------
//Manejo de websockets
io.on('connection', clientSocket => {
  console.log(`#${clientSocket.id} se conectó`)

  clientSocket.on('nuevoProducto', () => {
    console.log("Llego el evento del tipo Prod update")
    io.sockets.emit('updateProd')
  })
  
  clientSocket.on('nuevoMensaje', () => {
    console.log("Llego el evento del tipo Msj update")
    io.sockets.emit('updateMsj')
  })

})
//----------------------------------------------------------
// Tomo el puerto de los argumentos ingresado por linea de comando
const parseArgs = require('minimist');
const options = {
    alias: {
        p: 'puerto'
        },
    default: {
        puerto: 8080
    }
}
const commandLineArgs = process.argv.slice(2);
const { puerto, _ } = parseArgs(commandLineArgs, options);
console.log({ puerto, otros: _ });

//-------------------------------------------------------------------
// Cargo el server
const server = httpServer.listen(puerto, () => {
console.info(`Servidor HTTP escuchando en el puerto ${server.address().port}`)
})
server.on("error", error => console.log(`Error en servidor ${error}`))

