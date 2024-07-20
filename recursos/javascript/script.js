document.getElementById("form-converter").addEventListener("submit", async function (e) {
    e.preventDefault();

    const monedaOrigen = document.getElementById("input-moneda-origen").value;
    const monedaDestino = document.getElementById("input-moneda-destino").value;
    const valor = parseFloat(document.getElementById("input-valor").value);
    const tipoCambio = document.getElementById("select-tipo-cambio").value;

    const data = await fetchData();
    if (!data) {
        return;
    }

    let tasaOrigen, tasaDestino;

    if (tipoCambio === "blue") {
        if (monedaOrigen === "USD") {
            tasaOrigen = data.blue.value_sell;
        } else if (monedaOrigen === "EUR") {
            tasaOrigen = data.blue_euro.value_sell;
        } else {
            tasaOrigen = 1;
        }

        if (monedaDestino === "USD") {
            tasaDestino = data.blue.value_sell;
        } else if (monedaDestino === "EUR") {
            tasaDestino = data.blue_euro.value_sell;
        } else {
            tasaDestino = 1;
        }
    } else {
        if (monedaOrigen === "USD") {
            tasaOrigen = data.oficial.value_sell;
        } else if (monedaOrigen === "EUR") {
            tasaOrigen = data.oficial_euro.value_sell;
        } else {
            tasaOrigen = 1;
        }

        if (monedaDestino === "USD") {
            tasaDestino = data.oficial.value_sell;
        } else if (monedaDestino === "EUR") {
            tasaDestino = data.oficial_euro.value_sell;
        } else {
            tasaDestino = 1;
        }
    }

    const valorConvertido = convertirMoneda(valor, tasaOrigen, tasaDestino);
    document.getElementById("output-valor").value = valorConvertido.toFixed(2);
});

function convertirMoneda(valor, tasaOrigen, tasaDestino) {
    return (valor / tasaDestino) * tasaOrigen;
}

async function fetchData() {
    const url = "https://api.bluelytics.com.ar/v2/latest";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error al obtener los datos:", error.message);
        return null;
    }
}
