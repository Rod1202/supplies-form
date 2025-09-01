<template>
  <div class="success-view">
    <div class="success-icon">✓</div>
    <div class="success-text">Tu Solicitud fue registrada correctamente</div>
    <button class="btn-new-request" @click="newRequest">Nueva Solicitud</button>
    <div class="footer-text">Power by Rodrigo Carbonel®</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

/**
 * Reinicia el proceso volviendo a la vista de login.
 */
function newRequest() {
  // Limpiar el estado de la aplicación si fuera necesario,
  // por ejemplo, reseteando un store de Pinia.
  router.push({ name: 'LoginView' });
}
</script>

<style scoped>
.success-view {
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px 30px;
  flex: 1;
}

.success-icon {
  width: 80px;
  height: 80px;
  background: #28a745;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  color: white;
  font-size: 40px;
}

.success-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 40px;
}

.btn-new-request {
  width: 100%;
  padding: 16px;
  background: #007BFF;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-new-request:hover {
  background-color: #0056b3;
}

.footer-text {
  position: absolute;
  bottom: 30px;
  left: 0;
  right: 0;
  text-align: center;
  color: #666;
  font-size: 12px;
}
</style>