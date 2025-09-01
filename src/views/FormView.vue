<template>
  <div class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="main-form-container w-[90vw] max-w-[960px] h-[80vh]">
      <div class="form-header">
        <h2 class="form-title">SOLICITUD DE SUMINISTRO</h2>
      </div>

      <div class="form-content space-y-6 px-4 py-4 overflow-y-auto">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="serie">Serie</label>
          <div class="mt-1">
            <input 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
              id="serie" 
              v-model="serie" 
              placeholder="Ingrese el número de serie" 
              type="text" 
            />
          </div>
        </div>

        <div v-if="serie && modelo" class="bg-green-100 border border-green-300 text-green-800 text-sm font-medium px-4 py-3 rounded-lg text-center">
          {{ modelo }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700" for="tipo-suministro">Tipo de Suministro</label>
          <div class="mt-1 flex items-center space-x-3">
            <select 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
              id="tipo-suministro"
              v-model="tipoSuministro"
            >
              <option value="toner">Tóner</option>
              <option value="drum">Drum</option>
            </select>
          </div>
        </div>

        <div v-if="serie && modoId === 2 && tipoSuministro === 'toner'">
          <label class="block text-sm font-medium text-gray-700">Selecciona un color</label>
          <div class="mt-2 p-4 border border-gray-200 rounded-lg">
            <div class="flex justify-around items-center">
              <div 
                class="w-12 h-12 rounded-lg cursor-pointer shadow-sm transition-transform hover:scale-110" 
                :class="{ 'border-2 border-blue-500': selectedSuministroId === 1, 'opacity-50': selectedSuministroId !== 1 }" 
                style="background-color: black;" 
                @click="handleSuministroSelected(1)"
              ></div>
              <div 
                class="w-12 h-12 rounded-lg cursor-pointer shadow-sm transition-transform hover:scale-110" 
                :class="{ 'border-2 border-blue-500': selectedSuministroId === 3, 'opacity-50': selectedSuministroId !== 3 }" 
                style="background-color: #f0f;" 
                @click="handleSuministroSelected(3)"
              ></div>
              <div 
                class="w-12 h-12 rounded-lg cursor-pointer shadow-sm transition-transform hover:scale-110" 
                :class="{ 'border-2 border-blue-500': selectedSuministroId === 4, 'opacity-50': selectedSuministroId !== 4 }" 
                style="background-color: #ff0;" 
                @click="handleSuministroSelected(4)"
              ></div>
              <div 
                class="w-12 h-12 rounded-lg cursor-pointer shadow-sm transition-transform hover:scale-110" 
                :class="{ 'border-2 border-blue-500': selectedSuministroId === 2, 'opacity-50': selectedSuministroId !== 2 }" 
                style="background-color: #0ff;" 
                @click="handleSuministroSelected(2)"
              ></div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700" for="porcentajeInput">
            {{ tipoSuministro === 'toner' ? 'Porcentaje de Tóner' : 'Cantidad de Drum' }}
          </label>
          <div class="mt-1 flex items-center space-x-3">
            <input 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
              id="porcentajeInput" 
              v-model="porcentajeToner" 
              :placeholder="`Ingresa ${tipoSuministro === 'toner' ? 'el porcentaje' : 'la cantidad'} ` " 
              type="text" 
            />
            <button 
              @click="addSuministro"
              class="bg-blue-500 text-white p-3 rounded-full shadow-md flex items-center justify-center transition-colors hover:bg-blue-600" 
              type="button"
            >
              <span class="material-icons">add</span>
            </button>
          </div>
        </div>

        <div v-if="suministrosAgregados.length > 0" class="mt-4">
          <h3 class="text-sm font-medium text-gray-700">Suministros a solicitar:</h3>
          <ul class="mt-2 space-y-2">
            <li v-for="(item, index) in suministrosAgregados" :key="index" class="bg-gray-100 p-3 rounded-md flex justify-between items-center">
              <span>{{ item.nombre }} ({{ item.porcentaje }}{{ item.type === 'toner' ? '%' : '' }})</span>
              <span class="material-icons text-red-500 cursor-pointer" @click="removeSuministro(index)">delete_forever</span>
            </li>
          </ul>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700" for="direccion">Dirección</label>
          <div class="mt-1">
            <input 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
              id="direccion" 
              v-model="direccion" 
              placeholder="" 
              readonly 
              type="text" 
            />
          </div>
        </div>

        <div class="flex space-x-4">
          <div class="w-1/2">
            <label class="block text-sm font-medium text-gray-700" for="departamento">Departamento</label>
            <div class="mt-1">
              <input 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
                id="departamento" 
                v-model="departamento" 
                placeholder="" 
                readonly 
                type="text" 
              />
            </div>
          </div>
          <div class="w-1/2">
            <label class="block text-sm font-medium text-gray-700" for="distrito">Distrito</label>
            <div class="mt-1">
              <input 
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
                id="distrito" 
                v-model="distrito" 
                placeholder="" 
                readonly 
                type="text" 
              />
            </div>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700" for="nombre-contacto">Nombre de Contacto</label>
          <div class="mt-1">
            <input 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
              id="nombre-contacto" 
              v-model="contacto" 
              placeholder="" 
              readonly 
              type="text" 
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700" for="telefono">Teléfono</label>
          <div class="mt-1">
            <input 
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" 
              id="telefono" 
              v-model="telefono" 
              placeholder="" 
              readonly 
              type="tel" 
            />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Adjuntar fotos (máximo 3)</label>
          
          <div class="mt-1 flex flex-wrap gap-4 justify-center">
            
            <div v-for="(image, index) in previewImages" :key="index" class="relative w-full sm:w-1/3 h-48 border border-gray-300 rounded-md overflow-hidden">
              <img :src="image.url" alt="Vista previa" class="w-full h-full object-contain" />
              <button @click="removePhoto(index)" class="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none">
                <span class="material-icons text-lg">close</span>
              </button>
            </div>

            <div v-if="previewImages.length < 3" class="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 flex-grow h-48">
              <span class="material-icons text-gray-400 text-5xl">cloud_upload</span>
              <div class="flex text-sm text-gray-600">
                <label class="relative cursor-pointer rounded-md bg-white font-medium text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 hover:text-blue-500" for="file-upload">
                  <span>Subir un archivo</span>
                  <input class="sr-only" id="file-upload" name="file-upload" type="file" accept="image/*" @change="uploadPhotos" capture="user" multiple />
                </label>
                <p class="pl-1">o arrastrar y soltar</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
            </div>
          </div>
        </div>

        <div class="pb-10">
          <button 
            @click="showConfirmation" 
            class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" 
            type="button"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '../services/supabase';

// Tipos de datos para las imágenes
interface PreviewImage {
  url: string;
  file: File;
}

const router = useRouter();

const serie = ref('');
const modelo = ref('');
const idModelo = ref<number | null>(null);
const modoId = ref<number | null>(null);
const selectedSuministroId = ref<number | null>(null);
const porcentajeToner = ref('');
const direccion = ref('');
const departamento = ref('');
const distrito = ref('');
const telefono = ref('');
const contacto = ref('');
const tipoSuministro = ref('toner');
const suministrosAgregados = ref<{ id: number; nombre: string; porcentaje: number; type: string }[]>([]);
const previewImages = ref<PreviewImage[]>([]); // Arreglo para múltiples imágenes

const suministroColors: { [key: number]: string } = {
  1: 'Negro',
  2: 'Cyan',
  3: 'Magenta',
  4: 'Amarillo'
};

watch(serie, async (newSerie) => {
  if (newSerie) {
    try {
      const { data: impresoraData, error: impresoraError } = await supabase
        .from('impresora')
        .select('id_print, id_modelo, id_ubicacion, id_contacto')
        .eq('serie', newSerie)
        .single();

      if (impresoraError || !impresoraData) {
        console.error('Error al buscar impresora:', impresoraError);
        modelo.value = 'No encontrado';
        resetFormFields();
        return;
      }

      const { data: modeloData, error: modeloError } = await supabase
        .from('modelo')
        .select('name_printer, id_modo')
        .eq('id_modelo', impresoraData.id_modelo)
        .single();
      
      if (modeloError || !modeloData) {
        console.error('Error al buscar modelo:', modeloError);
        modelo.value = 'Error al cargar modelo';
        modoId.value = null;
      } else {
        modelo.value = modeloData.name_printer;
        idModelo.value = impresoraData.id_modelo;
        modoId.value = modeloData.id_modo;
      }

      if (impresoraData.id_ubicacion) {
        const { data: ubicacionData, error: ubicacionError } = await supabase
          .from('ubicacion')
          .select('direccion, id_distrito')
          .eq('id_ubicacion', impresoraData.id_ubicacion)
          .single();

        if (ubicacionError || !ubicacionData) {
          console.error('Error al buscar ubicación:', ubicacionError);
        } else {
          direccion.value = ubicacionData.direccion;

          if (ubicacionData.id_distrito) {
            const { data: distritoData, error: distritoError } = await supabase
              .from('distrito')
              .select('nombre, id_provincia')
              .eq('id_distrito', ubicacionData.id_distrito)
              .single();

            if (distritoError || !distritoData) {
              console.error('Error al buscar distrito:', distritoError);
            } else {
              distrito.value = distritoData.nombre;

              if (distritoData.id_provincia) {
                const { data: provinciaData, error: provinciaError } = await supabase
                  .from('provincia')
                  .select('id_departamento')
                  .eq('id_provincia', distritoData.id_provincia)
                  .single();
                
                if (provinciaError || !provinciaData || !provinciaData.id_departamento) {
                  console.error('Error al buscar provincia:', provinciaError);
                } else {
                  const { data: departamentoData, error: departamentoError } = await supabase
                    .from('departamento')
                    .select('nombre')
                    .eq('id_departamento', provinciaData.id_departamento)
                    .single();
                  
                  if (departamentoError || !departamentoData) {
                    console.error('Error al buscar departamento:', departamentoError);
                  } else {
                    departamento.value = departamentoData.nombre;
                  }
                }
              }
            }
          }
        }
      }

      if (impresoraData.id_contacto) {
        const { data: contactoData, error: contactoError } = await supabase
          .from('contacto')
          .select('nombre, telefono')
          .eq('id_contacto', impresoraData.id_contacto)
          .single();

        if (contactoError || !contactoData) {
          console.error('Error al buscar contacto:', contactoError);
        } else {
          telefono.value = contactoData.telefono;
          contacto.value = contactoData.nombre;
        }
      }
    } catch (e) {
      console.error('Excepción al buscar datos de la serie:', e);
      modelo.value = 'Error';
      resetFormFields();
    }
  } else {
    modelo.value = '';
    resetFormFields();
  }
});

function resetFormFields() {
  idModelo.value = null;
  modoId.value = null;
  direccion.value = '';
  departamento.value = '';
  distrito.value = '';
  telefono.value = '';
  contacto.value = '';
}

function handleSuministroSelected(suministroId: number) {
  selectedSuministroId.value = suministroId;
  console.log('ID de Suministro seleccionado:', suministroId);
}

function addSuministro() {
  const porcentajeNumerico = parseInt(porcentajeToner.value, 10);
  if (isNaN(porcentajeNumerico) || porcentajeToner.value === '') {
    alert(`Por favor, ingresa un valor válido para ${tipoSuministro.value}.`);
    return;
  }
  
  if (tipoSuministro.value === 'toner') {
    if (modoId.value === 1) {
      suministrosAgregados.value.push({
        id: 1,
        nombre: 'Tóner Negro',
        porcentaje: porcentajeNumerico,
        type: 'toner'
      });
    } else if (modoId.value === 2) {
      if (selectedSuministroId.value) {
        const color = suministroColors[selectedSuministroId.value];
        suministrosAgregados.value.push({
          id: selectedSuministroId.value,
          nombre: `Tóner ${color}`,
          porcentaje: porcentajeNumerico,
          type: 'toner'
        });
        selectedSuministroId.value = null;
      } else {
        alert('Por favor, selecciona un color de tóner.');
        return;
      }
    } else {
      alert('Por favor, ingresa una serie válida para habilitar la selección de suministros.');
      return;
    }
  } else if (tipoSuministro.value === 'drum') {
    suministrosAgregados.value.push({
      id: 5,
      nombre: 'Drum',
      porcentaje: porcentajeNumerico,
      type: 'drum'
    });
  }
  porcentajeToner.value = '';
}

function removeSuministro(index: number) {
  suministrosAgregados.value.splice(index, 1);
}

// FUNCIONES DE MANEJO DE IMÁGENES
async function uploadPhotos(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) {
    return;
  }

  // Iterar sobre todos los archivos seleccionados
  const filesToProcess = Array.from(input.files);

  for (const file of filesToProcess) {
    if (previewImages.value.length >= 3) {
      alert('Has alcanzado el límite de 3 imágenes.');
      break;
    }

    try {
      const convertedFile = await convertToWebP(file);
      const url = URL.createObjectURL(convertedFile);
      previewImages.value.push({ url, file: convertedFile });
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert('Error al procesar la imagen. Por favor, inténtalo de nuevo.');
    }
  }

  // Limpiar el input para permitir subir el mismo archivo de nuevo
  if (input) {
    input.value = ''; 
  }
}

function convertToWebP(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            if (blob) {
              const convertedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
              resolve(convertedFile);
            } else {
              reject(new Error("La conversión a WebP falló."));
            }
          }, 'image/webp', 0.8);
        } else {
          reject(new Error("No se pudo obtener el contexto 2D del canvas."));
        }
      };
      img.onerror = (error) => reject(error);
      img.src = e.target?.result as string;
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function removePhoto(index: number) {
  // Limpiar la URL temporal de la memoria
  URL.revokeObjectURL(previewImages.value[index].url);
  // Eliminar la imagen del arreglo
  previewImages.value.splice(index, 1);
}

function showConfirmation() {
  if (!serie.value || !suministrosAgregados.value.length) {
    alert('Por favor, completa los campos requeridos y agrega al menos un suministro.');
    return;
  }

  const formData = {
    serie: serie.value,
    modelo: modelo.value,
    tipoSuministro: tipoSuministro.value === 'toner' ? 'Tóner' : 'Drum',
    suministros: suministrosAgregados.value,
    direccion: direccion.value,
    departamento: departamento.value,
    distrito: distrito.value,
    contacto: contacto.value,
    telefono: telefono.value,
  };
  
  router.push({
    name: 'ConfirmView',
    query: {
      formData: JSON.stringify(formData)
    }
  });
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