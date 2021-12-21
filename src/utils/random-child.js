const randomNumbers = (cant = 100000000) => {
    let resultado = {};
    for (let i = 0; i < cant; i++) {
        let numero_aleatorio = Math.floor((Math.random() * (1000)) + 1);
        if (resultado[numero_aleatorio]) {
            resultado[numero_aleatorio] += 1;
        } else {
            resultado[numero_aleatorio] = 1;
        }
    }
    return resultado;
};

process.on("message", (msj) => {
    if (msj.command == "start") {
        const resultado = randomNumbers(msj.cant);
        process.send(resultado);
    }
});