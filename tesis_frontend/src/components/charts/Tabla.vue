<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { axiosCliente } from "@/config/axios.js";
import { lecturasToCsv } from "./funcionesGraficos.js";

const route = useRoute();
const lecturas = ref([]);
const mostrarAlerta = ref(false);
const mensajeAlerta = ref("");
const lecturasAMostrar = ref([]);
const paginaActual = ref(0);
const porPagina = ref(10);
const totalPaginas = ref(1);
const fechas = reactive({
  inicio: null,
  fin: null,
});

const obtenerDatosFecha = () => {
  let fechaFin = new Date(fechas.fin || fechas.inicio);
  fechaFin.setDate(fechaFin.getDate() + 1);
  fechaFin = fechaFin.toISOString().slice(0, 10);

  axiosCliente
    .get(`${route.params.dispositivoId}/tabla`, {
      params: {
        fechaInicio: fechas.inicio,
        fechaFin,
      },
    })
    .then((response) => {
      lecturas.value = response.data;
      convertirFechaIso(lecturas.value);
      totalPaginas.value = Math.ceil(lecturas.value.length / porPagina.value);
      llenarLecturasMostrar(0);
    })
    .catch((error) => {
      if (error.response.status >= 400 && error.response.status < 500) {
        mensajeAlerta.value = error.response.data;
      }
      mostrarAlerta.value = true;
    });
};

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

function llenarLecturasMostrar(cambiarPagina) {
  paginaActual.value =
    paginaActual.value + cambiarPagina >= 0 &&
    paginaActual.value + cambiarPagina <= totalPaginas.value
      ? paginaActual.value + cambiarPagina
      : cambiarPagina;
  let arreglo = [];
  let min = paginaActual.value * porPagina.value;
  let max =
    paginaActual.value * porPagina.value + porPagina.value >
    lecturas.value.length
      ? lecturas.value.length
      : paginaActual.value * porPagina.value + porPagina.value;
  for (let i = min; i < max; i++) {
    arreglo.push(lecturas.value[i]);
  }
  lecturasAMostrar.value = arreglo;
}

function cambiarPaginaActual(pagina) {
  paginaActual.value = pagina;
  llenarLecturasMostrar(0);
}

function cambiarPorPagina(cantidad) {
  porPagina.value = cantidad;
  totalPaginas.value = Math.ceil(lecturas.value.length / porPagina.value);
  llenarLecturasMostrar(0);
}
</script>

<template>
  <Alerta v-model="mostrarAlerta" :mensaje="mensajeAlerta" class="alerta" />
  <div id="tabla-container">
    <div id="tabla-paginacion">
      <div id="tabla">
        <BTableSimple>
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
          <button variant="primary" disabled class="btn-pagina pantone">
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
          <button type="submit" class="btn-buscar pantone">Buscar</button>
        </BForm>
      </div>
      <div class="botones-porpagina">
        <p>Número de filas por página:</p>
        <BButtonGroup
          vertical
          class="btn-numelementos"
          v-for="n in [10, 20, 50, 100, 1000]"
        >
          <button class="pantone" @click="cambiarPorPagina(n)">{{ n }}</button>
        </BButtonGroup>
      </div>
      <button
        v-if="lecturas.length"
        @click="lecturasToCsv(lecturas)"
        class="btn-descargar pantone"
      >
        Descargar historial
      </button>
    </div>
  </div>
</template>

<style scoped>
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

#calendario p {
  margin: 0;
}

.btn-buscar {
  display: block;
  width: 80%;
  margin: 1rem auto;
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
  border: none;
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
