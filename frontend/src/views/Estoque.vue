<template>
  <AdminEscolaLayout>
    <div class="estoque-page">
      <h1>Gestão de Estoque</h1>

      <!-- Botão para abrir modal de cadastro -->
      <button @click="openModal">Adicionar Produto</button>

      <!-- Tabela de estoque -->
      <Table :data="produtos" :columns="columns" />

      <!-- Modal para adicionar/editar produto -->
      <Modal v-if="isModalOpen" @close="closeModal">
        <h2>{{ editMode ? 'Editar Produto' : 'Adicionar Produto' }}</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label>Nome do Produto:</label>
            <input v-model="form.nome" required />
          </div>
          <div>
            <label>Quantidade:</label>
            <input type="number" v-model="form.quantidade" min="0" required />
          </div>
          <div>
            <label>Preço Unitário:</label>
            <input type="number" v-model="form.preco" step="0.01" min="0" required />
          </div>
          <button type="submit">Salvar</button>
        </form>
      </Modal>
    </div>
  </AdminEscolaLayout>
</template>

<script>
import AdminEscolaLayout from '../layouts/AdminEscolaLayout.vue'
import Table from '../components/Table.vue'
import Modal from '../components/Modal.vue'
import { ref } from 'vue'

export default {
  name: 'Estoque',
  components: { AdminEscolaLayout, Table, Modal },
  setup() {
    const produtos = ref([
      { nome: 'Uniforme Ballet', quantidade: 50, preco: 120 },
      { nome: 'Sapatilha Jazz', quantidade: 30, preco: 80 }
    ])

    const columns = ['Nome', 'Quantidade', 'Preço']

    const isModalOpen = ref(false)
    const editMode = ref(false)
    const form = ref({ nome: '', quantidade: 0, preco: 0 })

    function openModal() {
      isModalOpen.value = true
      editMode.value = false
      form.value = { nome: '', quantidade: 0, preco: 0 }
    }

    function closeModal() {
      isModalOpen.value = false
    }

    function submitForm() {
      produtos.value.push({ ...form.value })
      closeModal()
    }

    return { produtos, columns, isModalOpen, editMode, form, openModal, closeModal, submitForm }
  }
}
</script>

<style scoped>
.estoque-page {
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
</style>
