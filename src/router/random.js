//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const {Router} = require('express')
const routerRandom = new Router()
const {fork} = require('child_process')
const path = require('path')

routerRandom.get('/', (req,res)=> {
    const scriptPath = path.resolve(__dirname, "../utils/random-child.js");

    const computo = fork(scriptPath)
    const msj = {
        command: "start",
        cant: req.query.cant,
    };
    computo.send(msj);
    computo.on('message', (re) => {
        res.json({resultado: re});
    })
})

module.exports=routerRandom