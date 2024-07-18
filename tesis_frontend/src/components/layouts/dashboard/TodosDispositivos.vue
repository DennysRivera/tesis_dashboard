<script setup>
import { dispositivosStore } from "@/store/store.js";
</script>

<template>
  <div id="tarjetas-container">
    <BCard class="tarjeta-informativa" v-for="dispositivo in dispositivosStore.todosDispositivos">
      <h1 class="tarjeta-informativa-titulo">
        {{ dispositivo.medicion.medicion_fenomeno }}
      </h1>
      <span></span>
      <h2 class="tarjeta-informativa-ubicacion">
        {{ dispositivo.ubicacion.ubicacion_nombre }}
      </h2>
      <BButton
        variant="outline-info"
        size="sm"
        :to="{
          name: 'grafico-detallado',
          params: { dispositivoId: dispositivo.dispositivo_id },
        }"
        >Más información</BButton
      >
    </BCard>
  </div>
</template>

<style scoped>
#tarjetas-container{
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.tarjeta-informativa{
    width: 20%;
}
</style>