<template>
  <div>
    <!-- Aquí se renderizará el componente de la vista actual -->
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
// Este componente no necesita lógica, ya que solo actúa como un contenedor.
// Las vistas específicas (LoginView, FormView, etc.) manejan su propia lógica.
</script>

<style>
/* Estilos globales que aplican a todo el componente raíz y sus hijos */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}
</style>
