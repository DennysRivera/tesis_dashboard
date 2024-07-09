<script setup>
const props = defineProps({
  mensaje: String,
});

const mostrarAlerta = defineModel();
</script>

<template>
  <BAlert
    v-model="mostrarAlerta"
    variant="warning"
    dismissible
    class="alerta-error"
  >
  <p v-if="mensaje">{{ mensaje }}</p>
  <p v-else>No se pudo cargar los datos.<br />Por favor, intente más tarde.</p>
  </BAlert>
</template>

<style scoped>
.alerta-error {
  width: 40%;
  margin: auto;
  text-align: center;
}
</style>
