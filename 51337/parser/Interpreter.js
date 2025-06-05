import MyLanguageVisitor from './MyLanguageVisitor.js';

class Interpreter extends MyLanguageVisitor {
    constructor() {
        super();
        this.jsCode = '';
        this.declarations = new Set();
        this.estadoInicialDispositivos = {}; // Nuevo: guarda el estado inicial
    }

    visitPrograma(ctx) {
        ctx.regla().forEach(reglaCtx => this.visit(reglaCtx));
        // Une las declaraciones y el código principal
        return (
            Array.from(this.declarations).join('\n') +
            '\n\n' +
            this.jsCode
        );
    }

    visitRegla(ctx) {
        // Condición
        const condicion = this.visit(ctx.condicion());
        // Guarda el estado inicial del dispositivo según la condición
        if (condicion.estadoInicial !== undefined) {
            this.estadoInicialDispositivos[condicion.dispositivo] = condicion.estadoInicial;
        }
        // Acción
        const accion = this.visit(ctx.accion());

        // Genera declaración para cada dispositivo si no existe
        [condicion.dispositivo, accion.dispositivo].forEach(disp => {
            if (disp && !this.declarations.has(disp)) {
                // Usa el estado inicial si está definido, si no, true por defecto
                const encendidoInicial = this.estadoInicialDispositivos[disp] !== undefined
                    ? this.estadoInicialDispositivos[disp]
                    : true;
                this.declarations.add(
`${disp} = {
  encendido: ${encendidoInicial},
  desactivar: function() { this.encendido = false; }
};`
                );
            }
        });

        // Genera el if en JS
        this.jsCode += `if (${condicion.condicionJS}) ${accion.accionJS}\n`;
    }

    visitCondicion(ctx) {
        const dispositivo = ctx.nombre_dispositivo().getText();
        const estadoCond = ctx.estado_condicion().getText();
        const valorCond = ctx.valor_condicion().getText();
        let condicionJS = 'true';
        let estadoInicial; // Nuevo: para guardar el estado inicial
        if (estadoCond === 'es') {
            if (valorCond === 'encendido') {
                condicionJS = `${dispositivo}.encendido`;
                estadoInicial = true;
            } else if (valorCond === 'apagado') {
                condicionJS = `!${dispositivo}.encendido`;
                estadoInicial = false;
            }
        }
        return { dispositivo, condicionJS, estadoInicial };
    }

    visitAccion(ctx) {
        return this.visit(ctx.accion_simple());
    }

    visitAccion_simple(ctx) {
        if (ctx.activar()) return this.visit(ctx.activar());
        if (ctx.desactivar()) return this.visit(ctx.desactivar());
        if (ctx.ajustar()) return this.visit(ctx.ajustar());
    }

    visitActivar(ctx) {
        const dispositivo = ctx.nombre_dispositivo().getText();
        return {
            dispositivo,
            accionJS: `{ ${dispositivo}.encendido = true; }`
        };
    }

    visitDesactivar(ctx) {
        const dispositivo = ctx.nombre_dispositivo().getText();
        // Usamos el método desactivar
        return {
            dispositivo,
            accionJS: `${dispositivo}.desactivar();`
        };
    }

    visitAjustar(ctx) {
        const dispositivo = ctx.nombre_dispositivo().getText();
        const valor = ctx.NUMERO().getText();
        return {
            dispositivo,
            accionJS: `{ ${dispositivo}.valor = ${valor}; }`
        };
    }
}

export default Interpreter;