<script setup>
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import { axiosCliente } from "@/config/axios.js";

const route = useRoute();
const lecturas = ref([]);
const mostrarAlerta = ref(false);
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
    <div class="paginacion">
      <BButtonGroup>
        <BButton
          pill
          @click="llenarLecturasMostrar(-1)"
          :disabled="paginaActual <= 0"
          >Anterior</BButton
        >
        <BButton
          pill
          @click="cambiarPaginaActual(0)"
          :disabled="paginaActual <= 0"
          >1</BButton
        >
        <BButton pill variant="primary" disabled>{{
          paginaActual + 1
        }}</BButton>
        <BButton
          pill
          @click="cambiarPaginaActual(totalPaginas - 1)"
          :disabled="paginaActual >= totalPaginas - 1"
          >{{ totalPaginas }}</BButton
        >
        <BButton
          pill
          @click="llenarLecturasMostrar(1)"
          :disabled="paginaActual >= totalPaginas - 1"
          >Siguiente</BButton
        >
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
          <BButton type="submit" variant="primary" class="btn-buscar"
            >Buscar</BButton
          >
        </BForm>
      </div>
      <div class="botones-porpagina">
        <p>Número de filas por página:</p>
        <BButtonGroup
          vertical
          class="btn-numelementos"
          v-for="n in [10, 20, 50, 100, 1000]"
        >
          <BButton pill @click="cambiarPorPagina(n)">{{ n }}</BButton>
        </BButtonGroup>
      </div>
    </div>
  </div>
</template>

<style scoped>
#tabla-container {
  display: flex;
  justify-content: space-evenly;
}

#tabla-paginacion {
  width: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#tabla {
  width: 100%;
  height: 80vh;
  overflow: auto;
}

.btn-buscar {
  display: block;
  width: 80%;
  margin: 1rem auto;
}

.paginacion {
  margin: auto auto;
}

.lateral {
  width: 20%;
  display: flex;
  flex-direction: column;
}
</style>
