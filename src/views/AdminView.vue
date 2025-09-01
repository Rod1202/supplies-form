<template>
  <div class="admin-view min-h-screen bg-gray-100 font-sans text-gray-800">
    <!-- Header - Ocupa todo el ancho de la pantalla -->
    <div class="header-gradient">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div class="text-3xl font-bold tracking-tight">
          Panel de Suministros
        </div>
        <div class="flex flex-wrap justify-center gap-6">
          <div class="stat-item bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl p-4 shadow-inner text-center transform transition duration-300 hover:scale-105">
            <span class="stat-number text-2xl font-extrabold block">{{ pendingCount }}</span>
            <span class="text-sm">Pendientes</span>
          </div>
          <div class="stat-item bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl p-4 shadow-inner text-center transform transition duration-300 hover:scale-105">
            <span class="stat-number text-2xl font-extrabold block">{{ approvedCount }}</span>
            <span class="text-sm">Aprobadas</span>
          </div>
          <div class="stat-item bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm rounded-xl p-4 shadow-inner text-center transform transition duration-300 hover:scale-105">
            <span class="stat-number text-2xl font-extrabold block">{{ rejectedCount }}</span>
            <span class="text-sm">Rechazadas</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal - Ocupa todo el ancho con padding horizontal -->
    <div class="mx-auto px-4 py-8">
      <!-- Filtros -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <div class="text-xl font-semibold text-gray-700">Filtros de Búsqueda</div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div class="filter-group flex flex-col">
            <label class="text-xs font-semibold text-gray-500 uppercase mb-1">Estado</label>
            <select v-model="filters.status" class="p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
              <option value="">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="aprobado">Aprobadas</option>
              <option value="rechazado">Rechazadas</option>
            </select>
          </div>
          <div class="filter-group flex flex-col">
            <label class="text-xs font-semibold text-gray-500 uppercase mb-1">Cliente</label>
            <select v-model="filters.client" class="p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
              <option value="">Todos los clientes</option>
              <option value="empresa1">BELMOND PERU MANAGEMENT S.A.</option>
              <option value="empresa2">AUNA</option>
              <option value="empresa3">SANTANDER</option>
              <option value="empresa4">QROMA</option>
            </select>
          </div>
          <div class="filter-group flex flex-col">
            <label class="text-xs font-semibold text-gray-500 uppercase mb-1">Tipo de Suministro</label>
            <select v-model="filters.supplyType" class="p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200">
              <option value="">Todos los tipos</option>
              <option value="toner">Tóner</option>
              <option value="cartridge">Cartucho de Tinta</option>
              <option value="papel">Papel</option>
              <option value="mantenimiento">Kit de Mantenimiento</option>
            </select>
          </div>
          <div class="filter-group flex flex-col">
            <label class="text-xs font-semibold text-gray-500 uppercase mb-1">Serie</label>
            <input v-model="filters.serie" placeholder="Buscar por serie" class="p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div class="flex space-x-2 w-full sm:w-auto">
            <button class="btn btn-primary bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 w-1/2 sm:w-auto" @click="applyFilters">
              Aplicar Filtros
            </button>
            <button class="btn btn-clear bg-gray-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-600 transition duration-300 w-1/2 sm:w-auto" @click="clearFilters">
              Limpiar
            </button>
          </div>
          <div class="table-info text-gray-600 text-sm">
            Mostrando <span class="font-bold text-blue-600">{{ filteredRequests.length }}</span> de
            <span class="font-bold text-blue-600">{{ requests.length }}</span> solicitudes
          </div>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <div class="text-xl font-semibold text-gray-700">Solicitudes de Suministros</div>
          <div class="table-info text-sm text-gray-500">Última actualización: Hace 2 minutos</div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-4">ID</th>
                <th scope="col" class="px-6 py-4">Empresa</th>
                <th scope="col" class="px-6 py-4">Usuario</th>
                <th scope="col" class="px-6 py-4">Telefono</th>
                <th scope="col" class="px-6 py-4">Impresora</th>
                <th scope="col" class="px-6 py-4">Tipo Suministro</th>
                <th scope="col" class="px-6 py-4">Color</th>
                <th scope="col" class="px-6 py-4">Direccion</th>
                <th scope="col" class="px-6 py-4">Fotos</th>
                <th scope="col" class="px-6 py-4">Criticidad</th>
                <th scope="col" class="px-6 py-4">Estado</th>
                <th scope="col" class="px-6 py-4">Acciones</th>
                
              </tr>
            </thead>
            <tbody>
              <tr v-for="req in filteredRequests" :key="req.id" class="bg-white border-b hover:bg-gray-50 transition-colors duration-200">
                <td class="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">{{ req.id }}</td>
                
                <td class="px-6 py-4">{{ req.cliente }}</td>
                <td class="px-6 py-4">{{ req.contacto }}</td>
                <td class="px-6 py-4">{{ req.telefono }}</td>
                <td class="px-6 py-4">
                  <div class="font-semibold">{{ req.serie }}</div>
                  <div class="text-xs text-gray-500">{{ req.modelo }}</div>
                </td>
                <td class="px-6 py-4">{{ formatSupplyType(req.tipoSuministro) }}</td>
                <td class="px-6 py-4 flex items-center">
                  <span v-if="req.colorSeleccionado" class="color-indicator w-3 h-3 rounded-full mr-2" :class="'bg-' + req.colorSeleccionado"></span>
                  {{ req.colorSeleccionado || "N/A" }}
                </td>
                <td class="px-6 py-4 max-w-xs truncate" :title="req.direccion">
                  {{ req.direccion }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex space-x-1">
                    <img
                      v-for="(foto, index) in req.fotos"
                      :key="index"
                      :src="`https://picsum.photos/100/100?random=${req.id}-${index}`"
                      class="w-8 h-8 rounded-md object-cover cursor-pointer hover:ring-2 hover:ring-blue-500 transition-shadow duration-200"
                      @click="viewPhoto(foto)"
                    />
                  </div>
                </td>
                <td class="px-6 py-4">
                  <select
                    class="criticality-select p-2 rounded-lg text-xs font-semibold"
                    :class="'bg-' + req.criticidad"
                    v-model="req.criticidad"
                    @change="updateCriticality(req.id, req.criticidad)"
                  >
                    <option value="alta">ALTA</option>
                    <option value="media">MEDIA</option>
                    <option value="baja">BAJA</option>
                  </select>
                </td>
                <td class="px-6 py-4">
                  <span class="status-badge px-3 py-1 rounded-full text-xs font-semibold" :class="'bg-' + req.estado">
                    {{ formatStatus(req.estado) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center space-x-2">
                    <button class="btn btn-info bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors duration-200" @click="viewDetails(req.id)">
                      Ver
                    </button>
                    <template v-if="req.estado === 'pendiente'">
                      <button class="btn btn-success bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors duration-200" @click="approveRequest(req.id)">
                        Aprobar
                      </button>
                      <button class="btn btn-danger bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200" @click="rejectRequest(req.id)">
                        Rechazar
                      </button>
                    </template>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Paginación -->
      <div class="flex justify-center items-center space-x-2 mt-8">
        <button class="pagination-btn px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 transition duration-200" @click="changePage(-1)">
          &larr; Anterior
        </button>
        <button class="pagination-btn px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold shadow-md">1</button>
        <button class="pagination-btn px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 transition duration-200">2</button>
        <button class="pagination-btn px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 transition duration-200">3</button>
        <button class="pagination-btn px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 transition duration-200" @click="changePage(1)">
          Siguiente &rarr;
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center border-b pb-4 mb-4">
          <div class="text-2xl font-bold text-gray-800">Detalles de Solicitud</div>
          <button class="text-gray-500 hover:text-gray-800 text-3xl transition-colors duration-200" @click="closeModal">&times;</button>
        </div>
        <div v-if="selectedRequest" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">ID Solicitud</div>
            <div class="text-base font-medium text-gray-900">{{ selectedRequest.id }}</div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Cliente</div>
            <div class="text-base font-medium text-gray-900">{{ selectedRequest.cliente }}</div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Contacto</div>
            <div class="text-base font-medium text-gray-900">{{ selectedRequest.contacto }}</div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Teléfono</div>
            <div class="text-base font-medium text-gray-900">{{ selectedRequest.telefono }}</div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Serie Impresora</div>
            <div class="text-base font-medium text-gray-900">{{ selectedRequest.serie }}</div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Modelo</div>
            <div class="text-base font-medium text-gray-900">{{ selectedRequest.modelo }}</div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Tipo Suministro</div>
            <div class="text-base font-medium text-gray-900">
              {{ formatSupplyType(selectedRequest.tipoSuministro) }}
            </div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Color Solicitado</div>
            <div class="text-base font-medium text-gray-900 flex items-center">
              <span v-if="selectedRequest.colorSeleccionado" class="color-indicator w-4 h-4 rounded-full mr-2" :class="'bg-' + selectedRequest.colorSeleccionado"></span>
              {{ selectedRequest.colorSeleccionado || "N/A" }}
            </div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Criticidad</div>
            <div class="text-base font-medium text-gray-900">{{ selectedRequest.criticidad.toUpperCase() }}</div>
          </div>
          <div class="detail-item bg-gray-50 p-4 rounded-lg md:col-span-2">
            <div class="text-xs font-semibold text-gray-500 uppercase mb-1">Dirección</div>
            <div class="text-base font-medium text-gray-900">{{ selectedRequest.direccion }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

interface Request {
  id: string;
  fecha: string;
  cliente: string;
  contacto: string;
  telefono: string;
  serie: string;
  modelo: string;
  marca: string;
  esColor: boolean;
  tipoSuministro: string;
  colorSeleccionado: string | null;
  direccion: string;
  fotos: string[];
  estado: string;
  prioridad: string;
  criticidad: string;
}

const requests = ref<Request[]>([
  {
    id: "REQ-001",
    fecha: "2024-08-09",
    cliente: "BELMOND PERU MANAGEMENT S.A.",
    contacto: "Juan Pérez",
    telefono: "+51 987654321",
    serie: "BRDSQ1K0WB",
    modelo: "HP LASERJET PRO MFP M428FDW",
    marca: "HP",
    esColor: true,
    tipoSuministro: "toner",
    colorSeleccionado: "negro",
    direccion: "Av. Arequipa 123, Lima",
    fotos: ["foto1.jpg", "foto2.jpg"],
    estado: "pendiente",
    prioridad: "normal",
    criticidad: "alta",
  },
  {
    id: "REQ-002",
    fecha: "2024-08-09",
    cliente: "BELMOND PERU MANAGEMENT S.A.",
    contacto: "María García",
    telefono: "+51 912345678",
    serie: "BRDSQ1K0WB",
    modelo: "HP LASERJET PRO MFP M428FDW",
    marca: "Canon",
    esColor: true,
    tipoSuministro: "Toner",
    colorSeleccionado: "cyan",
    direccion: "Jr. Lima 456, Miraflores",
    fotos: ["foto3.jpg"],
    estado: "pendiente",
    prioridad: "high",
    criticidad: "media",
  },
  {
    id: "REQ-003",
    fecha: "2024-08-08",
    cliente: "BELMOND PERU MANAGEMENT S.A.",
    contacto: "Pedro Gomez",
    telefono: "+51 911223344",
    serie: "BRDSQ1K0WB",
    modelo: "HP LASERJET PRO MFP M428FDW",
    marca: "Xerox",
    esColor: true,
    tipoSuministro: "Toner",
    colorSeleccionado: null,
    direccion: "Av. La Molina 789, Lima",
    fotos: [],
    estado: "aprobado",
    prioridad: "normal",
    criticidad: "baja",
  },
  {
    id: "REQ-004",
    fecha: "2024-08-07",
    cliente: "BELMOND PERU MANAGEMENT S.A.",
    contacto: "Ana Torres",
    telefono: "+51 944556677",
    serie: "CNBRP8B75X",
    modelo: "COLOR LASERJET MANAGED MFP E47528F",
    marca: "HP",
    esColor: false,
    tipoSuministro: "Toner",
    colorSeleccionado: null,
    direccion: "Calle Los Pinos 101, San Borja",
    fotos: ["foto4.jpg"],
    estado: "rechazado",
    prioridad: "low",
    criticidad: "baja",
  },
]);

const filters = ref({
  status: "pendiente",
  client: "",
  supplyType: "",
  serie: "",
});

const selectedRequest = ref<Request | null>(null);
const showModal = ref(false);

const pendingCount = computed(() => requests.value.filter(r => r.estado === "pendiente").length);
const approvedCount = computed(() => requests.value.filter(r => r.estado === "aprobado").length);
const rejectedCount = computed(() => requests.value.filter(r => r.estado === "rechazado").length);

const filteredRequests = computed(() => {
  return requests.value.filter(r => {
    return (
      (!filters.value.status || r.estado === filters.value.status) &&
      (!filters.value.client || r.cliente.includes(filters.value.client)) &&
      (!filters.value.supplyType || r.tipoSuministro === filters.value.supplyType) &&
      (!filters.value.serie || r.serie.includes(filters.value.serie))
    );
  });
});


function formatSupplyType(type: string) {
  const types: Record<string, string> = {
    toner: "Tóner",
    cartridge: "Cartucho",
    papel: "Papel",
    mantenimiento: "Mantenimiento",
  };
  return types[type] || type;
}
function formatStatus(status: string) {
  const statuses: Record<string, string> = {
    pendiente: "Pendiente",
    aprobado: "Aprobado",
    rechazado: "Rechazado",
  };
  return statuses[status] || status;
}
function applyFilters() {
  console.log("Aplicando filtros", filters.value);
}
function clearFilters() {
  filters.value = { status: "", client: "", supplyType: "", serie: "" };
}
function changePage(dir: number) {
  console.log("Cambio de página", dir);
}
function viewPhoto(photo: string) {
  // Aquí se usaría un modal para mostrar la foto en lugar de un alert
  // alert("Mostrando foto: " + photo);
  // Por ahora, solo logueamos para evitar el alert()
  console.log("Mostrando foto: " + photo);
}
function updateCriticality(id: string, newCrit: string) {
  console.log(`Actualizar criticidad de ${id} a ${newCrit}`);
}
function viewDetails(id: string) {
  selectedRequest.value = requests.value.find(r => r.id === id) || null;
  showModal.value = true;
}
function closeModal() {
  showModal.value = false;
}
function approveRequest(id: string) {
  // alert(`Aprobado: ${id}`);
  console.log(`Aprobando: ${id}`);
}
function rejectRequest(id: string) {
  // alert(`Rechazado: ${id}`);
  console.log(`Rechazando: ${id}`);
}
</script>

<style scoped>

.header-gradient {
  background: linear-gradient(to right, #007BFF, #007BFF); /* azul 700 → azul 900 */
  color: white;
  padding: 1rem;
}

.admin-view {
  font-family: 'Inter', sans-serif;
}

/* Color classes for different statuses and criticality */
.bg-pendiente {
  background-color: #fefcbf;
  color: #78350f;
}

.bg-aprobado {
  background-color: #d1fae5;
  color: #065f46;
}

.bg-rechazado {
  background-color: #fee2e2;
  color: #991b1b;
}

.bg-alta {
  background-color: #fecaca;
  color: #b91c1c;
}

.bg-media {
  background-color: #fef9c3;
  color: #a16207;
}

.bg-baja {
  background-color: #dcfce7;
  color: #166534;
}

/* Color indicators for supplies */
.bg-negro {
  background-color: #1f2937;
}

.bg-naranja {
  background-color: #f97316;
}

.bg-amarillo {
  background-color: #facc15;
}

.bg-azul {
  background-color: #3b82f6;
}
</style>
