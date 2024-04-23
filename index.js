// Definición de algunas muestras de texto para probar el modelo de toxicidad
const samples = [
  {
    id: "002261b0415c4f9d",
    text: "We're dudes on computers, moron.  You are quite astonishingly stupid.",
  },
  {
    id: "0027160ca62626bc",
    text: "You mom is a stupid.",
  },
  {
    id: "002fb627b19c4c0b",
    text: "Stupid person, you are bitch",
  },
];

// Variables para almacenar el modelo de toxicidad y las etiquetas de clasificación
let model, labels;

// Función para clasificar los textos utilizando el modelo de toxicidad
const classify = async (inputs) => {
  // Clasificar los textos utilizando el modelo de toxicidad
  const results = await model.classify(inputs);
  // Mapear los resultados de la clasificación y retornarlos
  return inputs.map((d, i) => {
    const obj = { text: d };
    results.forEach((classification) => {
      obj[classification.label] = classification.results[i].match;
    });
    return obj;
  });
};

// Función para agregar las predicciones al DOM
const addPredictions = (predictions) => {
  // Seleccionar el contenedor de la tabla
  const tableWrapper = document.querySelector("#table-wrapper");

  // Iterar sobre las predicciones y agregarlas al DOM como filas de la tabla
  predictions.forEach((d) => {
    // Crear el HTML para mostrar cada predicción
    const predictionDom = `<div class="row">
      <div class="text">${d.text}</div>
      ${labels
        .map((label) => {
          // Crear elementos HTML para mostrar las predicciones
          return `<div class="${
            "label" + (d[label] === true ? " positive" : "")
          }">${d[label]}</div>`;
        })
        .join("")}
    </div>`;
    // Insertar la predicción en el contenedor de la tabla
    tableWrapper.insertAdjacentHTML("beforeEnd", predictionDom);
  });
};

// Función para realizar las predicciones utilizando el modelo de toxicidad y mostrarlas en el DOM
const predict = async () => {
  // Alerta para indicar que la función predict ha sido llamada
  alert("Entramos");
  // Cargar el modelo de toxicidad
  model = await toxicity.load();
  // Obtener las etiquetas de clasificación del modelo
  labels = model.model.outputNodes.map((d) => d.split("/")[0]);

  // Insertar encabezados de la tabla para las etiquetas de clasificación
  const tableWrapper = document.querySelector("#table-wrapper");
  tableWrapper.insertAdjacentHTML(
    "beforeend",
    `<div class="row">
      <div class="text">TEXT</div>
      ${labels
        .map((label) => {
          // Crear elementos HTML para mostrar las etiquetas de clasificación
          return `<div class="label">${label.replace("_", " ")}</div>`;
        })
        .join("")}
    </div>`
  );

  // Realizar predicciones para las muestras de texto definidas anteriormente
  const predictions = await classify(samples.map((d) => d.text));
  // Agregar las predicciones a la tabla
  addPredictions(predictions);

  // Agregar un evento de escucha al formulario para clasificar nuevos textos
  document.querySelector("#classify-new").addEventListener("submit", (e) => {
    // Obtener el texto ingresado por el usuario
    const text = document.querySelector("#classify-new-text-input").value;
    // Realizar predicciones para el nuevo texto
    const predictions = classify([text]).then((d) => {
      // Agregar las predicciones al DOM
      addPredictions(d);
    });

    // Prevenir el envío del formulario que causaría una recarga de la página
    e.preventDefault();
  });
};

// Llamar a la función predict para iniciar el proceso de clasificación
predict();
