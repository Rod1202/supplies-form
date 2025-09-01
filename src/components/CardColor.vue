<template>
  <div class="card-color-container">

<div class="color-options">
      <div
        v-for="colorOption in colors"
        :key="colorOption.id_color"
        :class="['color-box', { selected: colorOption.id_color === selectedColor }]"
        :style="{ backgroundColor: colorOption.nombre }"
        @click="selectColor(colorOption.id_color)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineEmits } from 'vue'; // Importar defineEmits
import { supabase } from '../services/supabase'; // Importar la instancia de Supabase

const emit = defineEmits(['color-selected']); // Definir el evento a emitir

const colors = ref<{ id_color: number; nombre: string }[]>([]);
const selectedColor = ref<number | null>(null); // Para almacenar el color seleccionado

async function fetchColors() {
  try {
    const { data, error } = await supabase
      .from('color')
      .select('id_color, nombre');

    if (error) {
      console.error('Error al cargar colores:', error);
    } else {
      colors.value = data || [];
    }
  } catch (e) {
    console.error('Excepción al cargar colores:', e);
  }
}

function selectColor(colorId: number) {
  selectedColor.value = colorId;
  console.log('Color seleccionado:', colorId);
  emit('color-selected', colorId); // Emitir el evento con el id_color
}

onMounted(() => {
  fetchColors();
});
</script>

<style scoped>
.card-color-container {
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  padding: 15px;
  background-color: #f9f9f9;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card-color-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: #555;
  margin-bottom: 15px;
  text-transform: uppercase;
}

.color-options {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.color-box {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.2s, border-color 0.2s;
}

.color-box:hover {
  transform: scale(1.1);
  border-color: #007BFF;
}

.color-box.selected {
  border-color: #007BFF; /* Highlight selected color */
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5); /* Optional: add a glow effect */
}

</style>
