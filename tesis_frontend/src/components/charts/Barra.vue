<script setup>
import { onUpdated, ref } from "vue";
import { valoresEnArreglo } from "./funcionesGraficos.js";

const props = defineProps({
  dispositivo: Object,
});

const promedio = ref(0);
promedio.value = promedioValores(props.dispositivo.lecturasRecientes);

const chartOptions = ref({
  chart: {
    id: "realtime",
    height: 350,
    type: "bar",
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 2,
      borderRadiusApplication: "end",
    },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1,
  },
  title: {
    text: props.dispositivo.medicion.medicion_fenomeno,
    align: "left",
    margin: 0,
    style: {
      fontSize: "20px",
      color: "black",
    },
  },
  subtitle: {
    text:
      `en ${props.dispositivo.ubicacion.ubicacion_nombre} (` +
      (props.dispositivo.lecturasRecientes[0].createdAt.fecha ==
      props.dispositivo.lecturasRecientes[
        props.dispositivo.lecturasRecientes.length - 1
      ].createdAt.fecha
        ? `${props.dispositivo.lecturasRecientes[0].createdAt.fecha})`
        : `${props.dispositivo.lecturasRecientes[0].createdAt.fecha} - ${
            props.dispositivo.lecturasRecientes[
              props.dispositivo.lecturasRecientes.length - 1
            ].createdAt.fecha
          })`),
    align: "left",
    margin: 0,
    style: {
      fontSize: "15px",
    },
  },
  /*xaxis: {
    categories: tiemposEnArreglo(props.dispositivo.lecturasRecientes),
    title: {
      text: "Hora de medición",
      style: {
        fontSize: "15px",
        color: "black",
      },
    },
  },
  yaxis: {
    title: {
      text: "Valor de la medición",
      style: {
        fontSize: "15px",
        color: "black",
      },
    },
  },*/
  legend: {
    customLegendItems: [
      "Mediciones recientes",
      "Mediciones 24 horas antes",
      "Promedio actual",
    ],
    markers: {
      fillColors: ["#000080", "#ffa500", "#0b6623"],
    },
  },
  tooltip: {
    y: {
      title: {
        formatter: () =>
          props.dispositivo.medicion.medicion_unidad_abreviatura
            ? props.dispositivo.medicion.medicion_unidad_abreviatura
            : props.dispositivo.medicion.medicion_unidad,
      },
    },
  },
});

const series = ref([]);
if (!props.dispositivo.lecturasAnteriores) {
  series.value = [
    {
      name: "Mediciones recientes",
      data: valoresEnArregloGoals(props.dispositivo.lecturasRecientes),
      color: "#000080",
    },
  ];
} else {
  series.value = [
    {
      name: "Mediciones recientes",
      data: valoresEnArregloGoals(props.dispositivo.lecturasRecientes),
      color: "#000080",
    },
    {
      name: "Mediciones 24 horas antes",
      data: valoresEnArregloGoals(props.dispositivo.lecturasAnteriores),
      color: "#ffa500",
    },
  ];
}

function valoresEnArregloGoals(lecturas) {
  let arregloValores = [];
  lecturas.forEach((lectura) => {
    arregloValores.push({
      x: lectura.createdAt.hora,
      y: lectura.lectura_valor,
      goals: [
        {
          name: "Promedio actual",
          value: promedio.value,
          strokeWidth: 5,
          strokeHeight: 10,
          strokeColor: "#0b6623",
        },
      ],
    });
  });
  return arregloValores;
}

function tiemposEnArreglo(lecturas) {
  let arregloTiempos = [];
  lecturas.forEach((lectura) => {
    arregloTiempos.push(lectura.createdAt.hora);
  });
  return arregloTiempos;
}

function promedioValores(lecturas) {
  let promedio = 0;
  let valores = valoresEnArreglo(lecturas);
  for (let i = 0; i < valores.length; i++) {
    promedio += valores[i];
  }
  promedio = promedio / valores.length;

  return promedio;
}

onUpdated(() => {
  ApexCharts.exec("realtime", "updateSeries", [
    {
      name: "Mediciones recientes",
      data: valoresEnArregloGoals(props.dispositivo.lecturasRecientes),
      color: "#000080",
    },
    {
      name: "Mediciones 24 horas antes",
      data: valoresEnArregloGoals(props.dispositivo.lecturasAnteriores),
      color: "#ffa500",
    },
  ]);
});
</script>

<template>
  <apexchart
    type="bar"
    :options="chartOptions"
    :series="series"
    height="350"
  ></apexchart>
</template>
