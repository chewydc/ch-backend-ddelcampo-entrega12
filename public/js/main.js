//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const socket = io.connect();

//Denormalize
const authorNormalizerSchema = new normalizr.schema.Entity('author',{},{
    idAttribute: 'mail'
})
const textNormalizerSchema = new normalizr.schema.Entity('text',{author: authorNormalizerSchema}, {idAttribute: 'id'} )
const messagesNormalizerSchema = [textNormalizerSchema];

bannerUsuario()
listarMensajes()
listarProductos()
//---------------------------------------
//Si recibo un evento update refresco la lista de productos.
socket.on('updateProd', () => {
    console.log("evento updateProd llego al cliente")
    listarProductos() 
});

//---------------------------------------
//Leo el formulario de carga productos y envio los datos a la API  
const form = document.querySelector('form');
form.addEventListener('submit', () => {
    const data = { title: form[0].value, price: form[1].value, thumbnail: form[2].value };
    fetch('/api/productos', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        // cuando guardo el producto, emito un evento de "nuevoProducto" al servidor.
        .then(socket.emit('nuevoProducto', 'Se cargo nuevo Producto!'))
        .catch(error => console.error(error))
})


//---------------------------------------
//Si recibo un evento update refresco la lista de productos.
socket.on('updateMsj', () => {
    console.log("evento updateMsj llego al cliente")
    listarMensajes() 
});

const botnEnviar = document.getElementById('enviar')
botnEnviar.addEventListener('click', () => {
    const mail = document.getElementById('mail')
    const nombre = document.getElementById('nombre')
    const apellido = document.getElementById('apellido')
    const edad = document.getElementById('edad')
    const alias = document.getElementById('alias')
    const avatar = document.getElementById('avatar')
    const msj = document.getElementById('mensaje')
    const data = {
        author:{ 
        mail: mail.value, 
        nombre: nombre.value, 
        apellido: apellido.value,
        edad: edad.value,
        alias: alias.value,
        avatar: avatar.value
        },
        mensaje: msj.value
    };
    fetch('/api/mensajes', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(socket.emit('nuevoMensaje', 'Se cargo nuevo Mensaje!'))
        .catch(error => console.error(error))
})
//---------------------------------------
//Armo el listado de productos para mostrar 
async function listarProductos() {
    const plantilla = await buscarPlantillaProducto()
    const productos = await buscarProductos()
    const html = armarHTML(plantilla, productos)
    document.getElementById('productos').innerHTML = html
}
async function listarProductosFake(mostrar) {
    const plantilla1 = await buscarPlantillaProductoFake()
    const productos_fake = await buscarProductosFake()
    const htmlfake = armarHTMLfake(plantilla1, productos_fake,mostrar)
    document.getElementById('productos_fake').innerHTML = htmlfake
}
async function listarMensajes() {
    const plantillaMsj = await buscarPlantillaMensaje()
    const mensajesNormalizado = await buscarMensajes()
    //console.log(JSON.stringify(mensajesNormalizado))
    const mensajes = normalizr.denormalize(mensajesNormalizado.result,messagesNormalizerSchema, mensajesNormalizado.entities)
    //console.log(JSON.stringify(mensajes))
    let rate = JSON.stringify(mensajesNormalizado).length/JSON.stringify(mensajes).length;
    const htmlMsj = armarHTMLmsj(plantillaMsj, mensajes, rate.toFixed(2)*100)
    document.getElementById('mensajes').innerHTML = htmlMsj
}
async function bannerUsuario() {
    const plantillaUser = await buscarPlantillaUsuario()
    const user = await buscarUsuario()
    const htmluser = armarHTMLuser(plantillaUser,user)
    document.getElementById('usuario').innerHTML = htmluser
}

//---------------------------------------
//Ejecuto API del lado del cliente
function buscarProductos() {
    return fetch('/api/productos')
        .then(prod => prod.json())
}
function buscarProductosFake() {
    return fetch('/api/productos-test')
        .then(prodfake => prodfake.json())
}
function buscarMensajes() {
    return fetch('/api/mensajes')
        .then(msjs => msjs.json())
}
function buscarUsuario() {
    return fetch('/api/user')
        .then(msjs => msjs.json())
}
//---------------------------------------
//Busco plantilla Handlebars
function buscarPlantillaProducto() {
     return fetch('/plantillas/productos.hbs')
         .then(respuesta => respuesta.text())
 }
function buscarPlantillaProductoFake() {
    return fetch('/plantillas/productos_fake.hbs')
        .then(respuesta1 => respuesta1.text())
}
function buscarPlantillaMensaje() {
    return fetch('/plantillas/mensajes.hbs')
        .then(respuesta2 => respuesta2.text())
}
function buscarPlantillaUsuario() {
    return fetch('/plantillas/usuario.hbs')
        .then(respuesta3 => respuesta3.text())
}
//---------------------------------------
//Armo Html
function armarHTML(plantilla, productos) {
     const render = Handlebars.compile(plantilla);
     const html = render({ productos })
    return html
}
function armarHTMLfake(plantilla1, productos_fake,mostrar) {
    const render = Handlebars.compile(plantilla1);
    const html = render({ productos_fake, mostrar })
   return html
}
function armarHTMLmsj(plantillaMsj, mensajes, rate) {
    const render = Handlebars.compile(plantillaMsj);
    const html = render({ mensajes, rate })
   return html
}
function armarHTMLuser(plantillaUser,user) {
    const render = Handlebars.compile(plantillaUser,user);
    const html = render({ user })
   return html
}
