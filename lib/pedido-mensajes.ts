export type EstadoPedido =
    | "ordenado"
    | "procesando"
    | "en_envio"
    | "completado"
    | "cancelado"

export type FormaPago = "efectivo" | "nequi" | "llave"

type Opts = {
    nombre: string
    estado: EstadoPedido
    formaPago: FormaPago
    demoraCocina?: string
    demoraRepartidor?: string
    nequiNumero?: string
    llaveNumero?: string
}

export function armarMensajePedido(o: Opts): string {
    const saludo = `Hola ${o.nombre}, te escribimos de *AlitasNOA*.`

    if (o.estado === "ordenado") {
        const lineas = [saludo, "", "Recibimos tu pedido correctamente."]

        if (o.formaPago === "efectivo") {
            lineas.push(
                "",
                "Pagos en *efectivo*: tu orden ya puede prepararse.",
                "El cobro se hace al entregar."
            )
        } else {
            const medio = o.formaPago === "nequi" ? "Nequi" : "Llave"
            const numero =
                o.formaPago === "nequi"
                    ? o.nequiNumero || "—"
                    : o.llaveNumero || "—"

            lineas.push(
                "",
                `Pagos por *${medio}*: envía el pago al número *${numero}* y respóndenos con el *comprobante* (anticipo).`,
                "Tu orden *comenzará a prepararse* cuando el pago se confirme con éxito."
            )
        }

        if (o.demoraCocina) {
            lineas.push("", `Tiempo estimado de preparación: *${o.demoraCocina}*.`)
        }

        lineas.push("", "¡Gracias por preferirnos!")
        return lineas.join("\n")
    }

    if (o.estado === "procesando") {
        return [
            saludo,
            "",
            "Tu pedido está *en preparación*.",
            o.demoraCocina
                ? `Tiempo estimado: *${o.demoraCocina}*.`
                : "Te avisamos cuando salga a domicilio.",
            "",
            "¡Gracias por tu paciencia!",
        ].join("\n")
    }

    if (o.estado === "en_envio") {
        return [
            saludo,
            "",
            "Tu pedido ya va *en camino*.",
            o.demoraRepartidor
                ? `El repartidor puede demorar aprox. *${o.demoraRepartidor}* en llegar a tu domicilio.`
                : "El repartidor se dirige a tu dirección.",
            "",
            "¡Que lo disfrutes!",
        ].join("\n")
    }

    if (o.estado === "completado") {
        return [
            saludo,
            "",
            "Tu pedido fue *entregado*. ¡Gracias por comprar en AlitasNOA!",
            "Si te gustó, puedes dejar una reseña en la web del producto.",
            "",
            "Esperamos verte pronto.",
        ].join("\n")
    }

    return [saludo, "", "Hubo un cambio en tu pedido. Contáctanos si necesitas ayuda."].join("\n")
}