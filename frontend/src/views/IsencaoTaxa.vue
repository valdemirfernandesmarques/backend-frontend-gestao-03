<template>
  <div class="isencao-page">
    <h1>Gerenciar Isenção de Taxa</h1>

    <button @click="openModal">Conceder Isenção</button>

    <Table :data="isencoes" :columns="columns" :actions="tableActions" @action="handleAction" />

    <Modal v-if="isModalOpen" @close="closeModal">
      <h2>{{ editMode ? 'Editar Isenção' : 'Nova Isenção' }}</h2>
      <form @submit.prevent="submitForm">
        <div>
          <label>Escola:</label>
          <input v-model="form.escola" placeholder="Nome da escola" required />
        </div>
        <div>
          <label>Data de Início:</label>
          <input type="date" v-model="form.dataInicio" required />
        </div>
        <div>
          <label>Data de Fim:</label>
          <input type="date" v-model="form.dataFim" required />
        </div>
        <button type="submit">{{ editMode ? 'Atualizar' : 'Salvar' }}</button>
      </form>
    </Modal>

    <p v-if="success" class="success">{{ success }}</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
  </template>

<script>
// A linha abaixo que importava o SuperAdminLayout foi REMOVIDA
// import SuperAdminLayout from '../layouts/SuperAdminLayout.vue'
import Table from '../components/Table.vue'
import Modal from '../components/Modal.vue'
import { ref, onMounted } from 'vue'
import api from '../api/api.js' // 🔹 Usando nosso api.js

export default {
  name: 'IsencaoTaxa',
  // O 'SuperAdminLayout' foi REMOVIDO da lista de componentes abaixo
  components: { Table, Modal },
  setup() {
    const isencoes = ref([])
    const columns = ['Escola', 'Data de Início', 'Data de Fim']
    const tableActions = ['edit', 'delete']

    const isModalOpen = ref(false)
    const editMode = ref(false)
    const form = ref({ id: null, escola: '', dataInicio: '', dataFim: '' })

    const success = ref('')
    const error = ref('')

    // ==============================
    // API - Buscar todas as isenções
    // ==============================
    async function fetchIsencoes() {
      try {
        const response = await api.get('/isencaoTaxa')
        isencoes.value = response.data
      } catch (err) {
        error.value = 'Erro ao carregar isenções.'
      }
    }

    // ==============================
    // Abrir Modal
    // ==============================
    function openModal(item = null) {
      isModalOpen.value = true
      if (item) {
        editMode.value = true
        form.value = { ...item }
      } else {
        editMode.value = false
        form.value = { id: null, escola: '', dataInicio: '', dataFim: '' }
      }
    }

    function closeModal() {
      isModalOpen.value = false
    }

    // ==============================
    // Criar ou atualizar isenção
    // ==============================
    async function submitForm() {
      try {
        if (editMode.value) {
          await api.put(`/isencaoTaxa/${form.value.id}`, form.value)
          success.value = 'Isenção atualizada com sucesso!'
        } else {
          await api.post('/isencaoTaxa', form.value)
          success.value = 'Isenção criada com sucesso!'
        }
        closeModal()
        fetchIsencoes()
      } catch (err) {
        error.value = err.response?.data?.error || 'Erro ao salvar isenção.'
      }
    }

    // ==============================
    // Excluir isenção
    // ==============================
    async function deleteIsencao(id) {
      if (confirm('Tem certeza que deseja excluir esta isenção?')) {
        try {
          await api.delete(`/isencaoTaxa/${id}`)
          success.value = 'Isenção removida com sucesso!'
          fetchIsencoes()
        } catch (err) {
          error.value = err.response?.data?.error || 'Erro ao excluir isenção.'
        }
      }
    }

    // ==============================
    // Ações da tabela
    // ==============================
    function handleAction(action, item) {
      if (action === 'edit') openModal(item)
      if (action === 'delete') deleteIsencao(item.id)
    }

    onMounted(() => {
      fetchIsencoes()
    })

    return {
      isencoes,
      columns,
      tableActions,
      isModalOpen,
      editMode,
      form,
      success,
      error,
      openModal,
      closeModal,
      submitForm,
      handleAction
    }
  }
}
</script>

<style scoped>
.isencao-page {
  padding: 20px;
}

button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: seagreen;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #2d8a4e;
}

.success {
  color: green;
  margin-top: 10px;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>