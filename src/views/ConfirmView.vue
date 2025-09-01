<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="main-form-container w-[90vw] max-w-[960px] h-[80vh]">
      <div class="form-header">
        <h2 class="form-title">SOLICITUD DE SUMINISTRO</h2>
      </div>

      <div class="form-content space-y-6 px-4 py-4 overflow-y-auto">
        <div class="border border-gray-200 rounded-lg p-4">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Confirmar Pedido</h2>
          <div v-if="formDataObj" class="space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Serie:</span>
              <span class="font-medium text-gray-900">{{ formDataObj.serie }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Modelo:</span>
              <span class="font-medium text-gray-900">{{ formDataObj.modelo }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tipo de Suministro:</span>
              <span class="font-medium text-gray-900">{{ formDataObj.tipoSuministro }}</span>
            </div>
            <div class="mt-4">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Suministros a solicitar:</h3>
              <ul class="space-y-1">
                <li v-for="(item, index) in formDataObj.suministros" :key="index" class="flex justify-between">
                  <span class="text-gray-600">{{ item.nombre }}:</span>
                  <span class="font-medium text-gray-900">{{ item.porcentaje }}{{ item.type === 'toner' ? '%' : '' }}</span>
                </li>
              </ul>
            </div>
            
            <div class="flex justify-between">
              <span class="text-gray-600">Dirección:</span>
              <span class="font-medium text-gray-900">{{ formDataObj.direccion }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Departamento:</span>
              <span class="font-medium text-gray-900">{{ formDataObj.departamento }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Distrito:</span>
              <span class="font-medium text-gray-900">{{ formDataObj.distrito }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Nombre de Contacto:</span>
              <span class="font-medium text-gray-900">{{ formDataObj.contacto }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Teléfono:</span>
              <span class="font-medium text-gray-900">{{ formDataObj.telefono }}</span>
            </div>
          </div>
          <div v-else class="text-center text-gray-500">
            No se encontraron datos de la solicitud.
          </div>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-4">
          <button 
            class="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
            type="button"
            @click="goBack"
          >
            Atrás
          </button>
          <button 
            @click="register"
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
            :disabled="isRegistering"
            type="button"
          >
            {{ isRegistering ? 'Enviando...' : 'Confirmar Solicitud' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../services/supabase';

// 1. Ya no necesitas defineProps. Quítalo por completo.
// const props = defineProps<{
//   formData: string;
// }>();

const router = useRouter();
const isRegistering = ref(false);
const formDataObj = ref<any>(null);

onMounted(() => {
  // 2. CAMBIO CLAVE: Acceder a 'formData' a través de los query parameters
  const formDataString = router.currentRoute.value.query.formData as string;
  
  if (formDataString) {
    try {
      // Convierte la cadena JSON de vuelta a un objeto
      formDataObj.value = JSON.parse(formDataString);
    } catch (e) {
      console.error('Error al parsear los datos del formulario:', e);
    }
  } else {
    // Manejo de caso en que no hay datos
    console.warn('No se encontraron datos de la solicitud en la URL.');
  }
});

const goBack = () => {
  router.go(-1);
};

// ... (El resto de tu función 'register' es el mismo, ya que usa formDataObj.value) ...
async function register() {
  // ... (código de registro existente) ...
  console.log('Iniciando función de registro...');
  isRegistering.value = true;
  
  if (!formDataObj.value) {
    alert('Error: No se encontraron datos para registrar.');
    isRegistering.value = false;
    return;
  }
  
  try {
    const { data: impresoraData, error: impresoraError } = await supabase
      .from('impresora')
      .select('id_print, id_cliente, id_modelo')
      .eq('serie', formDataObj.value.serie) // Usa formDataObj.value
      .single();
    
    if (impresoraError || !impresoraData) {
      alert('Error: La serie de la impresora no está registrada.');
      isRegistering.value = false;
      return;
    }

    const idPrint = impresoraData.id_print;
    const idCliente = impresoraData.id_cliente;
    
    for (const suministro of formDataObj.value.suministros) { // Itera sobre el objeto
      let idSuministro = null;
      let idStock = null;
      
      let query = supabase.from('suministro').select('id_suministro, cantidad');
      
      if (suministro.type === 'toner') {
        query = query.eq('id_modelo', impresoraData.id_modelo).eq('id_color', suministro.id);
      } else if (suministro.type === 'drum') {
        query = query.eq('id_modelo', impresoraData.id_modelo).eq('id_suministro_type', 5);
      } else {
        console.error('Tipo de suministro desconocido:', suministro.type);
        continue;
      }
      
      const { data: suministroData, error: suministroError } = await query.order('cantidad', { ascending: false });

      if (suministroError || !suministroData || suministroData.length === 0) {
        alert(`Error: No se encontraron suministros compatibles para ${suministro.nombre}.`);
        isRegistering.value = false;
        return;
      }
      
      const suministroConStock = suministroData.find(s => s.cantidad >= 1);
      
      if (!suministroConStock) {
        alert(`Error: El suministro ${suministro.nombre} no tiene stock disponible.`);
        isRegistering.value = false;
        return;
      }
      
      idSuministro = suministroConStock.id_suministro;
      idStock = suministroConStock.cantidad === 1 ? 2 : 1;

      const { error: insertError } = await supabase
        .from('solicitud')
        .insert({
          id_cliente: idCliente,
          id_suministro: idSuministro,
          id_print: idPrint,
          porcentaje_toner: suministro.porcentaje,
          id_stock: idStock,
          id_criticidad: 2,
          id_guia: null,
          id_valida: null,
        });

      if (insertError) {
        alert(`Error al registrar la solicitud para ${suministro.nombre}: ${insertError.message}`);
        isRegistering.value = false;
        return;
      }
    }

    alert('¡Solicitudes registradas con éxito!');
    router.push({ name: 'form' });
  } catch (e) {
    console.error('Excepción en la función de registro:', e);
    alert('Ocurrió un error inesperado al registrar la solicitud.');
  } finally {
    isRegistering.value = false;
  }
}
</script>

<style scoped>
.main-form-container {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.form-header {
  background-color: #007BFF;
  color: #fff;
  padding: 20px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  text-align: center;
  position: sticky;
  top: 0;
  z-index: 10;
}

.form-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.form-content {
  flex-grow: 1;
}

/* Regla para pantallas pequeñas */
@media (max-width: 768px) {
  .main-form-container {
    height: 100vh;
    width: 100vw;
    max-width: none;
    border-radius: 0;
    box-shadow: none;
    padding-bottom: 0;
  }

  .form-header {
    border-radius: 0;
  }

  .form-content {
    padding-top: 20px; 
  }
}
</style>