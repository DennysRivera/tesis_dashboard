<script setup>
import { shallowRef, ref } from "vue";
import Dashboard from "./Dashboard.vue";
import TodosDispositivos from "./TodosDispositivos.vue";

const vistaActual = shallowRef([Dashboard, TodosDispositivos]);
const index = ref(0);
</script>

<template>
  <div id="vista-general-container">
    <aside>
      <button @click="index = 0" :disabled="index === 0">Dispositivos activos</button>
      <button @click="index = 1" :disabled="index === 1">Todos los dispositivos</button>
    </aside>
    <div id="cuerpo-principal">
      <component :is="vistaActual[index]" />
    </div>
  </div>
</template>

<style scoped>
#vista-general-container {
  display: flex;
  width: 100%;
  height: 100%;
}

#cuerpo-principal {
  width: 100%;
  height: 100%;
}

aside {
  width: 20%;
  height: 75vh;
  position: absolute;
  left: 0;
  top: 15vh;
  padding-top: 40px;
  box-shadow: 3px 0 rgb(182, 171, 171, 0.7);
  background-color: white;
  z-index: 3;
}

aside button {
  width: 100%;
  display: block;
  background: none;
  padding: 10px;
  border: none;
}

aside button:hover, aside button:disabled{
    background-color: #00449e;
    color: white;
}
</style>
