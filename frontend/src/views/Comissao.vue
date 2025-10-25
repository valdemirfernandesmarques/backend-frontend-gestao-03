<template>
  <AdminEscolaLayout>
    <div class="comissao-page">
      <h1>Gestão de Comissões</h1>

      <!-- Botão para abrir modal -->
      <button @click="openModal">Adicionar Comissão</button>

      <!-- Tabela de comissões -->
      <Table :data="comissoes" :columns="columns" />

      <!-- Modal para cadastrar/editar comissão -->
      <Modal v-if="isModalOpen" @close="closeModal">
        <h2>{{ editMode ? 'Editar Comissão' : 'Nova Comissão' }}</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label>Funcionário:</label>
            <input v-model="form.funcionario" placeholder="Nome do funcionário" required />
          </div>
          <div>
            <label>Percentual (%):</label>
            <input type="number" v-model="form.percentual" min="0" max="100" required />
          </div>
          <div>
            <label>Descrição:</label>
            <input v-model="form.descricao" placeholder="Descrição opcional" />
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
  name: 'Comissao',
  components: { AdminEscolaLayout, Table, Modal },
  setup() {
    const comissoes = ref([
      { funcionario: 'João Silva', percentual: 10, descricao: 'Comissão mensal de aulas' },
      { funcionario: 'Maria Oliveira', percentual: 5, descricao: 'Comissão por vendas' }
    ])

    const columns = ['Funcionário', 'Percentual (%)', 'Descrição']

    const isModalOpen = ref(false)
    const editMode = ref(false)
    const form = ref({ funcionario: '', percentual: '', descricao: '' })

    function openModal() {
      isModalOpen.value = true
      editMode.value = false
      form.value = { funcionario: '', percentual: '', descricao: '' }
    }

    function closeModal() {
      isModalOpen.value = false
    }

    function submitForm() {
      comissoes.value.push({ ...form.value })
      closeModal()
    }

    return { comissoes, columns, isModalOpen, editMode, form, openModal, closeModal, submitForm }
  }
}
</script>

<style scoped>
.comissao-page {
  padding: 20px;
}

button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: darkorange;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: #cc8400;
}
</style>
