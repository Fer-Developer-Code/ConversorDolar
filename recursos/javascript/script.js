// Cuando el documento se ha cargado completamente, se ejecuta esta función
document.addEventListener("DOMContentLoaded", function () {
  // Obtiene el elemento del campo de entrada de valor
  const inputValor = document.getElementById("input-valor");

  // Función para formatear el número con separadores de miles
  function formatNumber(value) {
    // Elimina todos los caracteres no numéricos del valor ingresado
    const cleanedValue = value.replace(/\D/g, "");

    // Agrega separadores de miles en el número limpio
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // Añade un evento de entrada al campo de valor
  inputValor.addEventListener("input", function () {
    // Formatea el valor del campo de entrada
    const formattedValue = formatNumber(inputValor.value);
    // Actualiza el valor del campo de entrada con el formato adecuado
    inputValor.value = formattedValue;
  });
});

// Añade un evento al formulario para manejar el envío
document
  .getElementById("form-converter")
  .addEventListener("submit", async function (e) {
    // Previene el comportamiento por defecto del formulario (recarga de página)
    e.preventDefault();

    // Obtiene los valores de los campos del formulario
    const monedaOrigen = document.getElementById("input-moneda-origen").value;
    const monedaDestino = document.getElementById("input-moneda-destino").value;
    // Convierte el valor del campo de entrada en un número flotante
    const valor = parseFloat(
      document.getElementById("input-valor").value.replace(/\./g, "")
    );
    const tipoCambio = document.getElementById("select-tipo-cambio").value;

    // Llama a la función para obtener los datos de la API
    const data = await fetchData();
    // Sale de la función si no se pudieron obtener los datos
    if (!data) {
      return;
    }

    // Variables para almacenar las tasas de cambio
    let tasaOrigen, tasaDestino;

    // Determina la tasa de cambio de origen y destino según el tipo de cambio seleccionado
    if (tipoCambio === "blue") {
      // Selecciona las tasas correspondientes para el tipo de cambio "blue"
      if (monedaOrigen === "USD") {
        tasaOrigen = data.blue.value_sell;
      } else if (monedaOrigen === "EUR") {
        tasaOrigen = data.blue_euro.value_sell;
      } else {
        tasaOrigen = 1; // Asume que la tasa es 1 si la moneda de origen no es válida
      }

      if (monedaDestino === "USD") {
        tasaDestino = data.blue.value_sell;
      } else if (monedaDestino === "EUR") {
        tasaDestino = data.blue_euro.value_sell;
      } else {
        tasaDestino = 1; // Asume que la tasa es 1 si la moneda de destino no es válida
      }
    } else {
      // Selecciona las tasas correspondientes para el tipo de cambio "oficial"
      if (monedaOrigen === "USD") {
        tasaOrigen = data.oficial.value_sell;
      } else if (monedaOrigen === "EUR") {
        tasaOrigen = data.oficial_euro.value_sell;
      } else {
        tasaOrigen = 1; // Asume que la tasa es 1 si la moneda de origen no es válida
      }

      if (monedaDestino === "USD") {
        tasaDestino = data.oficial.value_sell;
      } else if (monedaDestino === "EUR") {
        tasaDestino = data.oficial_euro.value_sell;
      } else {
        tasaDestino = 1; // Asume que la tasa es 1 si la moneda de destino no es válida
      }
    }

    // Llama a la función para convertir el valor
    const valorConvertido = convertirMoneda(valor, tasaOrigen, tasaDestino);
    // Muestra el resultado formateado en el campo de salida
    document.getElementById(
      "output-valor"
    ).value = `${valorConvertido.toLocaleString("es-ES", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${monedaDestino} (${tipoCambio})`;
  });

// Función para convertir el valor según las tasas de cambio
function convertirMoneda(valor, tasaOrigen, tasaDestino) {
  return (valor / tasaDestino) * tasaOrigen;
}

// Función para obtener los datos de la API
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
