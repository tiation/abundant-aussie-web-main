<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Departments</h1>
      <div class="mb-8">
        <input type="text" v-model="searchQuery" placeholder="Search departments..." class="w-full p-2 border border-gray-300 rounded mb-4" />
        <button @click="showAddDepartmentModal = true" class="bg-blue-500 text-white px-4 py-2 rounded">Add Department</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="department in filteredDepartments" :key="department.id" class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-2">{{ department.name }}</h2>
          <p class="text-gray-700 mb-4">{{ department.description }}</p>
          <p class="text-gray-600">Manager ID: {{ department.managerId }}</p>
          <p class="text-gray-600">Employees: {{ department.employeeCount }}</p>
          <button @click="viewDepartment(department.id)" class="text-blue-500 mt-4">View Details</button>
        </div>
      </div>
    </div>

    <!-- Department Detail Modal -->
    <div v-if="showDetailModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">{{ selectedDepartment?.name }}</h3>
            <p class="mt-2 text-sm text-gray-500">Manager ID: {{ selectedDepartment?.managerId }}</p>
            <p class="mt-2 text-sm text-gray-500">Employees: {{ selectedDepartment?.employeeCount }}</p>
            <p class="mt-2 text-sm text-gray-500">Description: {{ selectedDepartment?.description }}</p>
          </div>
          <div class="mt-5 sm:mt-6">
            <button type="button" @click="showDetailModal = false" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Department Modal -->
    <div v-if="showAddDepartmentModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">Add New Department</h3>
            <div class="mt-2">
              <input v-model="newDepartment.name" placeholder="Department Name" class="w-full p-2 border border-gray-300 rounded mb-2" />
              <textarea v-model="newDepartment.description" placeholder="Department Description" class="w-full p-2 border border-gray-300 rounded mb-2"></textarea>
              <input v-model="newDepartment.managerId" placeholder="Manager ID" class="w-full p-2 border border-gray-300 rounded mb-2" />
            </div>
          </div>
          <div class="mt-5 sm:mt-6">
            <button type="button" @click="addDepartment" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm">
              Add Department
            </button>
            <button type="button" @click="showAddDepartmentModal = false" class="ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Department } from '../types';

const searchQuery = ref('');
const showDetailModal = ref(false);
const showAddDepartmentModal = ref(false);
const departments = ref<Department[]>([
  { id: '1', name: 'Engineering', description: 'Handles software development.', managerId: '123', employeeCount: 20 },
  { id: '2', name: 'Human Resources', description: 'Manages hiring and employee processes.', managerId: '456', employeeCount: 10 }
]);
const selectedDepartment = ref<Department | null>(null);
const newDepartment = ref({ id: '', name: '', description: '', managerId: '', employeeCount: 0 });

const filteredDepartments = computed(() => {
  return departments.value.filter((department: Department) =>
    department.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function viewDepartment(id: string) {
  selectedDepartment.value = departments.value.find((dept: Department) => dept.id === id) || null;
  showDetailModal.value = true;
}

function addDepartment() {
  if (!newDepartment.value.name) return alert('Name is required.');
  const newId = String(departments.value.length + 1);
  departments.value.push({ ...newDepartment.value, id: newId, employeeCount: 0 });
  showAddDepartmentModal.value = false;
  newDepartment.value = { id: '', name: '', description: '', managerId: '', employeeCount: 0 };
}
</script>
