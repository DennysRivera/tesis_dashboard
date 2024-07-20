<script setup>
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { axiosCliente } from "@/config/axios.js";
import { lecturasToCsv } from "./funcionesGraficos.js";

// Variables necesarias para el funcionamiento de la tabla

// useRoute permite usar el atributo params de la URL
const route = useRoute();

// Arreglo con todas las lecturas encontradas en la tabla de datos
const lecturas = ref([]);

// Variable booleana para mostrar una alerta en caso de error
// y un mensaje de error personalizado recibido de la API, si envía uno
// En caso contrario se utiliza uno general
const mostrarAlerta = ref(false);
const mensajeAlerta = ref("");

// Lecturas que se deben mostrar en la página actual de la paginación
const lecturasAMostrar = ref([]);

// Muestra la página actual de la paginación
const paginaActual = ref(0);

// Cantidad de lecturas que se deben mostrar en cada página
const porPagina = ref(10);

// Total de páginas que contendrá la paginación
const totalPaginas = ref(1);

// Rango de fechas a buscar en la base de datos
const fechas = reactive({
  inicio: null,
  fin: null,
});

const busquedaActivada = ref(true);

// Función para realizar una petición
const obtenerDatosFecha = () => {
  desactivarBusqueda();
  // Si no se ingresa un fecha final para el rango (Hasta:),
  // se entenderá que se quiere lecturas de un solo día (Desde:)
  let fechaFin = new Date(fechas.fin || fechas.inicio);

  axiosCliente
    .get(`${route.params.dispositivoId}/tabla`, {
      // Las fechas se envían como query string
      params: {
        fechaInicio: fechas.inicio,
        fechaFin,
      },
    })
    .then((response) => {
      lecturas.value = response.data;
      // Se separa la fecha de la hora para cada lectura
      convertirFechaIso(lecturas.value);

      // Se calcula el total de páginas para la paginación
      totalPaginas.value = Math.ceil(lecturas.value.length / porPagina.value);

      // Se llena un arreglo con las lecturas a mostrar por cada página
      llenarLecturasMostrar(0);
    })
    .catch((error) => {
      // Si se recibe un mensaje de error personalizado, se muestra en una alerta
      if (error.response.status >= 400 && error.response.status < 500) {
        mensajeAlerta.value = error.response.data;
      }
      mostrarAlerta.value = true;
    });
};

// Función para convertir la fecha ISO a fecha y hora local
// y separarlas
function convertirFechaIso(lecturas) {
  lecturas.forEach((lectura) => {
    lectura.createdAt = {
      hora: new Date(lectura.createdAt).toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }),
      fecha: new Date(lectura.createdAt).toLocaleDateString("es-SV"),
    };
  });
}

// Función para llenar un arreglo con las lecturas para mostrar en cada página
// Se recibe como parámetro una cantidad de páginas a aumentar o disminuir
function llenarLecturasMostrar(cambiarPagina) {
  // Muestra la página en la que nos encontramos en la paginación
  // Se verifica que no sobrepase los límites de la primera y la última página
  paginaActual.value =
    paginaActual.value + cambiarPagina >= 0 &&
    paginaActual.value + cambiarPagina <= totalPaginas.value
      ? paginaActual.value + cambiarPagina
      : cambiarPagina;

  // Arreglo para las leecturas a mostrar
  let arreglo = [];

  // Se calcula a partir de cual índice comenzar a buscar
  let min = paginaActual.value * porPagina.value;

  // Se calcula hasta cual índice buscar, evitando que sobrepase
  // el número de elementos en el arreglo
  let max =
    paginaActual.value * porPagina.value + porPagina.value >
    lecturas.value.length
      ? lecturas.value.length
      : paginaActual.value * porPagina.value + porPagina.value;

  // Las lecturas por página se extraen del arreglo con todas las lecturas
  for (let i = min; i < max; i++) {
    arreglo.push(lecturas.value[i]);
  }
  lecturasAMostrar.value = arreglo;
}

// Función para ir a la primera o última página
function cambiarPaginaActual(pagina) {
  paginaActual.value = pagina;

  // Se llena las lecturas a mostrar en la página
  llenarLecturasMostrar(0);
}

// Función para cambiar el número de lecturas a mostrar por cada página
function cambiarPorPagina(cantidad) {
  // Se actualiza el número de lecturas a mostrar
  porPagina.value = cantidad;

  // Se calcula el nuevo total de páginas
  totalPaginas.value = Math.ceil(lecturas.value.length / porPagina.value);

  // Se llena las lecturas con la nueva cantidad de lecturas por cada página
  llenarLecturasMostrar(0);
}

function desactivarBusqueda() {
  busquedaActivada.value = false;
  setTimeout(() => {
    busquedaActivada.value = true;
  }, 60000);
}
</script>

<template>
  <Alerta v-model="mostrarAlerta" :mensaje="mensajeAlerta" class="alerta" />
  <div id="tabla-container">
    <div id="tabla-paginacion">
      <div id="tabla">
        <BTableSimple hover>
          <BThead>
            <BTr>
              <BTh>Fecha</BTh>
              <BTh>Hora</BTh>
              <BTh>Valor</BTh>
            </BTr>
          </BThead>
          <BTbody>
            <BTr v-for="lectura in lecturasAMostrar">
              <BTd>{{ lectura.createdAt.fecha }}</BTd>
              <BTd>{{ lectura.createdAt.hora }}</BTd>
              <BTd>{{ lectura.lectura_valor }}</BTd>
            </BTr>
          </BTbody>
        </BTableSimple>
      </div>
      <div class="paginacion" v-if="lecturas.length">
        <BButtonGroup>
          <button
            @click="llenarLecturasMostrar(-1)"
            :disabled="paginaActual <= 0"
            class="btn-pagina pantone"
          >
            Anterior
          </button>
          <button
            @click="cambiarPaginaActual(0)"
            :disabled="paginaActual <= 0"
            class="btn-pagina pantone"
          >
            1
          </button>
          <button disabled class="btn-pagina pagina-actual pantone">
            {{ paginaActual + 1 }}
          </button>
          <button
            @click="cambiarPaginaActual(totalPaginas - 1)"
            :disabled="paginaActual >= totalPaginas - 1"
            class="btn-pagina pantone"
          >
            {{ totalPaginas }}
          </button>
          <button
            @click="llenarLecturasMostrar(1)"
            :disabled="paginaActual >= totalPaginas - 1"
            class="btn-pagina pantone"
          >
            Siguiente
          </button>
        </BButtonGroup>
      </div>
    </div>
    <div class="lateral">
      <div id="calendario">
        <BForm @submit="obtenerDatosFecha">
          <p>Desde:</p>
          <BFormInput type="date" v-model="fechas.inicio" />
          <p>Hasta:</p>
          <BFormInput type="date" v-model="fechas.fin" />
          <button
            type="submit"
            class="btn-buscar pantone"
            :class="{ cargando: !busquedaActivada }"
            :disabled="!fechas.inicio || !busquedaActivada"
          >
            <span id="btn-buscar-progreso"></span>
            <span id="btn-buscar-texto">Buscar</span>
          </button>
        </BForm>
      </div>
      <div class="botones-porpagina">
        <p>Número de filas por página:</p>
        <BButtonGroup
          vertical
          class="btn-numelementos"
          v-for="n in [10, 20, 50, 100, 1000]"
        >
          <button
            class="pantone"
            @click="cambiarPorPagina(n)"
            :disabled="n == porPagina"
          >
            {{ n }}
          </button>
        </BButtonGroup>
      </div>
      <button
        v-if="lecturas.length"
        @click="lecturasToCsv(lecturas)"
        class="btn-descargar pantone"
      >
        Descargar historial
      </button>
      <p id="cantidad-registros">Total: {{ lecturas.length }}</p>
    </div>
  </div>
</template>

<style scoped>
button.pantone {
  border: 1px solid #00459e;
}

button.pantone:hover {
  background-color: transparent;
  border: 1px solid #00459e;
  color: #00459e;
}

button.pantone:disabled:hover {
  background-color: #00459ecc;
  color: white;
}

#tabla-container {
  height: 100%;
  display: flex;
  justify-content: space-evenly;
}

#tabla-paginacion {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#tabla {
  width: 90%;
  min-height: 70vh;
  max-height: 70vh;
  overflow: auto;
}

tr:hover{
  background-color: red;
}

#calendario p {
  margin: 0;
}

.btn-buscar {
  display: block;
  width: 80%;
  margin: 1rem auto;
  position: relative;
  overflow: hidden;
}

#btn-buscar-progreso {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background-color: #00459e;
}

.btn-buscar.cargando #btn-buscar-progreso{
  width: 100%;
  transition: width 60s linear;
}

#btn-buscar-texto{
  position: relative;
  z-index: 2;
}

.btn-descargar {
  display: block;
  width: 80%;
  margin: 1rem auto;
}

.botones-porpagina {
  margin: 0 auto 10px auto;
}

.btn-numelementos {
  margin: 0 5px 5px 0;
}

.btn-buscar,
.botones-porpagina button,
.btn-pagina,
.btn-descargar {
  padding: 10px;
  border-radius: 10px;
  color: white;
}

.btn-pagina,
.botones-porpagina button {
  padding: 5px 12px;
  border-radius: 50px;
}

.paginacion {
  margin: 0 auto;
}

.btn-pagina {
  margin: 5px;
}

.btn-pagina:disabled,
.btn-buscar:disabled {
  background-color: #00459ecc;
}

.botones-porpagina button:disabled,
.pagina-actual:disabled {
  background-color: transparent;
  border: 1px solid #00459e;
  color: #00459e;
}

#cantidad-registros {
  text-align: center;
}

.lateral {
  width: 20%;
  display: flex;
  flex-direction: column;
}

.alerta {
  position: absolute;
  top: 20%;
  left: 30%;
}

@media (max-width: 500px) {
  #tabla-container {
    flex-direction: column-reverse;
  }

  #tabla {
    margin-top: 20px;
  }

  .lateral {
    width: 100%;
  }

  #calendario {
    width: 70%;
    margin: 0 auto;
  }

  .botones-porpagina {
    margin: 0 auto 10px auto;
  }

  .btn-pagina {
    margin: 0 1px;
  }

  .alerta {
    left: 15%;
  }
}

@media (width > 500px) and (width <= 600px) {
  .btn-pagina {
    margin: 0 3px 10px auto;
  }

  .btn-buscar {
    margin: 0.6rem auto;
  }

  .btn-descargar {
    padding: 5px 0;
  }
}

@media (width > 500px) and (width <= 800px) {
  #tabla-paginacion {
    width: 70%;
  }

  .lateral {
    width: 30%;
  }
}

@media (min-height: 845px) {
  #tabla {
    max-height: 60vh;
  }
}
</style>
