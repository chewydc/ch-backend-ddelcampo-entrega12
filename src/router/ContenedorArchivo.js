//-------------------------------------------------------------------
// Entregable 12: Variables de Entorno
// Fecha de entrega: 22-12-21
// Alumno: Damian del Campo
//-------------------------------------------------------------------
const fs = require("fs")

class ContenedorArchivo {
  constructor(path) {
    this.path = path;
  }

  async save(producto) {
    try {
      let productos = await this.getAll();
      const array = productos.map((x) => x.id);
      if (array.length == 0) {
        producto.id = 1;
      } else {
        producto.id = Math.max(...array) + 1;
      }
      const time = new Date()
      const newElem = { ...producto, fyh: time.toLocaleString() }
      productos.push(newElem);
      productos = JSON.stringify(productos, null, 2);
      await fs.promises.writeFile(this.path, productos);
      return producto.id;
    } catch (error) {
      this.MuestroError(error, "save");
    }
  }


  async getAll() {
    try {
      let contenido = await fs.readFileSync(this.path, this.encoding);
      if (contenido == "") {
        return [];
      }
      const array = JSON.parse(contenido);
      return array;
    } catch (error) {
      this.MuestroError(error, "getAll");
      return [];
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.path, "");
      console.log("Borrado Completo ok!");
    } catch (error) {
      this.MuestroError(error, "deleteAll");
    }
  }

  MuestroError(error, fnName) {
    console.log(`#!% --> Error en funcion ${fnName}:\n#!% --> ${error}`);
  }
}

module.exports = ContenedorArchivo;