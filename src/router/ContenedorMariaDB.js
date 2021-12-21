//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
class ContenedorMariaDB {
  constructor(configDB,tablaDB) {
    this.productos = [];
    this.configDB = configDB;
    this.tablaDB = tablaDB; 
  }

  async save(prod) {
    const knex = require('knex')(this.configDB)
    return knex.from(this.tablaDB).insert(prod)
      .then((row)=> row)
    .catch((err)=> {      
      this.MuestroError(err, "save")
      return []})
    .finally(()=> {
      knex.destroy()
    })
  }

  async getAll() {
    const knex = require('knex')(this.configDB)
    return knex.from(this.tablaDB).select("*").then((rows)=> {
      this.productos = JSON.stringify(rows);
      return JSON.parse(this.productos)})
    .catch((err)=> {      
      this.MuestroError(err, "getAll")
      return []})
    .finally(()=> {
      knex.destroy()
    })
  }

  async getById(number) {
    const knex = require('knex')(this.configDB)
    return knex.from(this.tablaDB).select("*").where('id','=',number).then((rows)=> {
      let prod = JSON.stringify(rows);
      return JSON.parse(prod)})
    .catch((err)=> {      
      this.MuestroError(err, "getById")
      return [] })
    .finally(()=> {
      knex.destroy()
    })
  }

  async deleteById(number) {
    const knex = require('knex')(this.configDB)
    return knex.from(this.tablaDB).where('id','=',number).del()
      .then(() => console.log(`Borrado id: ${number} ok!`))
      .catch((err)=> {      
        this.MuestroError(err, "deleteById")
        return [] })
      .finally(()=> {
        knex.destroy()
    })
  }

  async deleteAll() {
    const knex = require('knex')(this.configDB)
    //Opte por este camino para que reinicie los IDs (si solo borraba filas la columna ID seguia auto escalando)
    return knex.raw('truncate table ' + this.tablaDB) 
      .then(()=> console.log("Borrado Completo ok!"))
      .catch((err)=> {      
        this.MuestroError(err, "deleteAll")
        return [] })
      .finally(()=> {
        knex.destroy()
    })
  }

  MuestroError(error, fnName) {
    console.log(`#!% --> Error en funcion ${fnName}:\n#!% --> ${error}`);
  }
}

module.exports = ContenedorMariaDB;