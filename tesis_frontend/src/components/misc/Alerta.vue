<script setup>
const mostrarAlerta = defineModel();
</script>

<template>
      <BAlert v-model="mostrarAlerta" variant="warning" dismissible class="alerta-error">
    No se pudo cargar los datos<br />Por favor, intente más tarde
  </BAlert>
</template>

<style scoped>
.alerta-error{
    width: 40%;
    margin: auto;
    text-align: center;
}
</style>