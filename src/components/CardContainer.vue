<template>
  <div class="card-container">
    <div class="card-header">
      <h2 class="card-title">{{ title }}</h2>
    </div>
    <div class="card-content-wrapper">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.card-container {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  padding: 0;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
}

.card-header {
  background-color: #007BFF;
  color: #fff;
  padding: 20px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  text-align: center;
}

.card-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.card-content-wrapper {
  max-height: 70vh; /* Ajusta esta altura según tu necesidad */
  overflow-y: auto;
  padding: 20px 0;
  box-sizing: border-box;
}

/* Scrollbar styling */
.card-content-wrapper::-webkit-scrollbar {
  width: 8px;
}

.card-content-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.card-content-wrapper::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.card-content-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}

@media (max-width: 700px) {
  .card-container {
    width: 100%;
    max-width: none;
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
  .card-content-wrapper {
    max-height: calc(100vh - 74px); /* Ajusta para la altura del header */
  }
}
</style>