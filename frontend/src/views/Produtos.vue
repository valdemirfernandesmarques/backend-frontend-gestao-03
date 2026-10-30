<template>
  <AdminEscolaLayout>
    <div class="produtos-page">
      <h1>Gerenciar Produtos</h1>

      <!-- Botão para abrir modal -->
      <button @click="openModal">Adicionar Produto</button>

      <!-- Tabela de produtos -->
      <Table :data="produtos" :columns="columns" />

      <!-- Modal para adicionar/editar produto -->
      <Modal v-if="isModalOpen" @close="closeModal">
        <h2>{{ editMode ? 'Editar Produto' : 'Adicionar Produto' }}</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label>Nome:</label>
            <input v-model="form.nome" required />
          </div>
          <div>
            <label>Descrição:</label>
            <input v-model="form.descricao" />
          </div>
          <div>
            <label>Preço:</label>
            <input type="number" v-model="form.preco" required />
          </div>
          <div>
            <label>Quantidade:</label>
            <input type="number" v-model="form.quantidade" required />
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
  name: 'Produtos',
  components: { AdminEscolaLayout, Table, Modal },
  setup() {
    const produtos = ref([
      { nome: 'Uniforme Ballet', descricao: 'Tamanho P/M/G', preco: 120, quantidade: 10 },
      { nome: 'Sapatilha Jazz', descricao: 'Cor preta, tamanho 35-40', preco: 80, quantidade: 15 },
    ])

    const columns = ['Nome', 'Descrição', 'Preço', 'Quantidade']

    const isModalOpen = ref(false)
    const editMode = ref(false)
    const form = ref({ nome: '', descricao: '', preco: 0, quantidade: 0 })

    function openModal() {
      isModalOpen.value = true
      editMode.value = false
      form.value = { nome: '', descricao: '', preco: 0, quantidade: 0 }
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
.produtos-page {
  padding: 20px;
}

button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: dodgerblue;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #1a75d1;
}
</style>
