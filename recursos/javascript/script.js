// 1. Función para obtener los datos de la API
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

// 2. Función para realizar la conversión de moneda
function convertirMoneda(valor, tasaOrigen, tasaDestino) {
    return (valor / tasaDestino) * tasaOrigen;
}

// 3. Función para procesar los datos y realizar la conversión
async function procesarValoresCambio(event) {
    event.preventDefault();

    const data = await fetchData();
    if (!data) {
        return; // Salir si no hay datos
    }

    const valorUSDOficial = data.oficial.value_sell;
    const valorUSDBlue = data.blue.value_sell;
    const valorEUROOficial = data.oficial_euro.value_sell;
    const valorEUROBlue = data.blue_euro.value_sell;

    const monedaOrigen = document.getElementById('input-moneda-origen').value;
    const monedaDestino = document.getElementById('input-moneda-destino').value;
    const valor = parseFloat(document.getElementById('input-valor').value);
    const tipoCambio = document.getElementById('select-tipo-cambio').value;

    let tasaOrigen = 1, tasaDestino = 1;

    if (monedaOrigen === 'ARS') {
        tasaOrigen = 1;
        if (monedaDestino === 'USD' && tipoCambio === 'blue') {
            tasaDestino = valorUSDBlue;
        } else if (monedaDestino === 'USD_OF' && tipoCambio === 'oficial') {
            tasaDestino = valorUSDOficial;
        } else if (monedaDestino === 'EUR' && tipoCambio === 'blue') {
            tasaDestino = valorEUROBlue;
        } else if (monedaDestino === 'EUR_OF' && tipoCambio === 'oficial') {
            tasaDestino = valorEUROOficial;
        }
    } else if (monedaDestino === 'ARS') {
        tasaDestino = 1;
        if (monedaOrigen === 'USD' && tipoCambio === 'blue') {
            tasaOrigen = valorUSDBlue;
        } else if (monedaOrigen === 'USD_OF' && tipoCambio === 'oficial') {
            tasaOrigen = valorUSDOficial;
        } else if (monedaOrigen === 'EUR' && tipoCambio === 'blue') {
            tasaOrigen = valorEUROBlue;
        } else if (monedaOrigen === 'EUR_OF' && tipoCambio === 'oficial') {
            tasaOrigen = valorEUROOficial;
        }
    } else {
        alert("Conversión no soportada");
        return;
    }

    const valorConvertido = convertirMoneda(valor, tasaOrigen, tasaDestino);
    document.getElementById('output-valor').value = valorConvertido.toFixed(2);
}

// 4. Event listener para el formulario
document.getElementById('form-converter').addEventListener('submit', procesarValoresCambio);