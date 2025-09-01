<template>
  <div class="main-container">
    <CardContainer>
      <!-- Se ha actualizado la ruta para importar la imagen correctamente -->
      <img :src="logo" alt="IIIT Logo" class="login-logo" />
      <div class="login-form-center-group">
        <form @submit.prevent="goToForm">
          <div class="form-group">
            <label for="clientInput" class="form-label">Cliente</label>
            <div class="autocomplete-container">
              <input
                type="text"
                id="clientInput"
                v-model="clientSearch"
                @input="filterClients"
                @focus="showSuggestions = true"
                @blur="hideSuggestions"
                class="form-input"
                placeholder="Busca un cliente"
              />
              <ul v-if="showSuggestions && filteredClients.length" class="suggestions-list">
                <li
                  v-for="c in filteredClients"
                  :key="c.id_cliente"
                  @mousedown.prevent="selectClient(c)"
                >
                  {{ c.nombre }}
                </li>
              </ul>
            </div>
          </div>
          <div class="form-group">
            <label for="supplyTypeSelect" class="form-label">Tipo de Suministro</label>
            <div class="select-container">
              <select v-model="supplyType" id="supplyTypeSelect" class="form-input">
                <option disabled value="">Selecciona un suministro</option>
                <option v-for="category in supplyCategories" :key="category.id_suministro_categoria" :value="category.id_suministro_categoria">{{ category.nombre }}</option>
              </select>
            </div>
          </div>
          <button type="submit" class="login-button">
            Siguiente
          </button>
        </form>
      </div>
      <div class="login-footer">
        Power by Rodrigo Carbonel®
      </div>
    </CardContainer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// Importamos el nuevo componente del contenedor con la ruta corregida
import CardContainer from '../components/CardContainer.vue';
// Importamos la imagen usando una ruta relativa
import logo from '../assets/logo.png';
import { supabase } from '../services/supabase'; // Importar la instancia de Supabase

const router = useRouter();

// Reactive variables to store selections
const client = ref<number | null>(null); // Cambiado a number | null para id_cliente
const clientName = ref<string>(''); // Para mostrar el nombre del cliente seleccionado
const clientSearch = ref<string>(''); // Para el input de búsqueda
const supplyType = ref<string>('');
const clients = ref<{ id_cliente: number; nombre: string }[]>([]); // Nuevo ref para almacenar los clientes
const supplyCategories = ref<{ id_suministro_categoria: number; nombre: string }[]>([]); // Nuevo ref para almacenar las categorías de suministro
const showSuggestions = ref(false); // Controla la visibilidad de las sugerencias

// Propiedad computada para filtrar clientes
const filteredClients = computed(() => {
  if (!clientSearch.value) {
    return clients.value;
  }
  const searchTerm = clientSearch.value.toLowerCase();
  return clients.value.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm)
  );
});

// Función para manejar la entrada del usuario y filtrar
function filterClients() {
  showSuggestions.value = true;
}

// Función para seleccionar un cliente de la lista de sugerencias
function selectClient(selectedClient: { id_cliente: number; nombre: string }) {
  client.value = selectedClient.id_cliente;
  clientName.value = selectedClient.nombre;
  clientSearch.value = selectedClient.nombre; // Actualiza el input con el nombre completo
  showSuggestions.value = false;
}

// Ocultar sugerencias después de un pequeño retraso para permitir el click
function hideSuggestions() {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 150);
}

// Función para cargar los clientes desde Supabase
async function fetchClients() {
  try {
    const { data, error } = await supabase
      .from('cliente')
      .select('id_cliente, nombre');

    if (error) {
      console.error('Error al cargar clientes:', error);
    } else {
      clients.value = data || [];
    }
  } catch (e) {
    console.error('Excepción al cargar clientes:', e);
  }
}

// Función para cargar las categorías de suministro desde Supabase
async function fetchSupplyCategories() {
  try {
    const { data, error } = await supabase
      .from('suministrocategoria')
      .select('id_suministro_categoria, nombre');

    if (error) {
      console.error('Error al cargar categorías de suministro:', error);
    } else {
      supplyCategories.value = data || [];
    }
  } catch (e) {
    console.error('Excepción al cargar categorías de suministro:', e);
  }
}

// Cargar datos cuando el componente se monta
onMounted(() => {
  fetchClients();
  fetchSupplyCategories();
});

/**
 * Navigates to the form if a valid client and supply type have been selected.
 */
function goToForm() {
  if (!client.value || !supplyType.value) {
    // Alerta temporal, se podría usar un modal o mensaje en la UI
    alert('Por favor, seleccione un cliente y un tipo de suministro.');
    return;
  }
  
  console.log('Cliente seleccionado (ID):', client.value);
  console.log('Cliente seleccionado (Nombre):', clientName.value);
  console.log('Tipo de suministro seleccionado:', supplyType.value);
  
  router.push({ name: 'FormView' });
}

/**
 * Navigates to the admin view.
 */

</script>

<style scoped>
.main-container {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  margin: 0;
  padding: 0;
}

.login-logo {
  max-width: 220px;
  width: 60%;
  height: auto;
  opacity: 0.98;
  object-fit: contain;
  margin: 80px auto 24px auto;
  display: block;
}

.login-form-center-group {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  padding: 0 40px;
  margin-top: 30px;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.form-group {
  margin-bottom: 24px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
}

.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.form-input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #000;
  border-radius: 10px;
  font-size: 1.1rem;
  background: #fff;
  transition: border 0.2s;
  color: #333;
  margin: 0;
}

.form-input:focus {
  border-color: #007BFF;
  outline: none;
}

.autocomplete-container {
  position: relative;
  width: 100%;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #fff;
  border: 1px solid #d3d3d3;
  border-radius: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.suggestions-list li {
  padding: 12px 14px;
  cursor: pointer;
  font-size: 1.1rem;
  color: #333;
}

.suggestions-list li:hover {
  background-color: #f0f0f0;
}

/* Mantener el estilo del select-container para otros selects si los hay */
.select-container select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23666666'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 20px;
}

.login-button {
  width: 100%;
  padding: 13px;
  background: #007BFF;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 24px;
  cursor: pointer;
  transition: background 0.2s;
  display: block;
  text-align: center;
}

.login-button:hover:not(:disabled) {
  background: #0056b3;
}

.login-footer {
  width: 100%;
  text-align: center;
  font-size: 0.95em;
  color: #333;
  opacity: 0.7;
  margin-top: 24px;
  margin-bottom: 30px;
}

@media (max-width: 700px) {
  .main-container {
    background: #fff; /* Cambio el fondo a blanco en móvil */
    align-items: flex-start;
  }
  .login-logo {
    max-width: 250px;
    width: 140vw;
    margin: 80px auto 18px auto;
  }
  .login-form-center-group {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    min-height: 0;
    height: calc(100vh - 180px);
  }
}
</style>
