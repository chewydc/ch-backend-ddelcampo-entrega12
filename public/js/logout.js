//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------

bannerUsuario() 

async function bannerUsuario() {
    let user = await buscarUsuario()
    const plantillaUser = await buscarPlantillaUsuario()
    const htmluser = armarHTMLuser(plantillaUser,user)
    document.getElementById('user').innerHTML = htmluser
}
function buscarPlantillaUsuario() {
    return fetch('/plantillas/logout-user.hbs')
        .then(respuesta3 => respuesta3.text())
}
function buscarUsuario() {
    return fetch('/api/user')
        .then(msjs => msjs.json())
}
function armarHTMLuser(plantillaUser,user) {
    const render = Handlebars.compile(plantillaUser,user);
    const html = render({ user })
   return html
}