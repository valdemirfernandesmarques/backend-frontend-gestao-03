<template>
  <AdminEscolaLayout>
    <div class="venda-item-page">
      <h1>Itens da Venda</h1>

      <!-- Botão para abrir modal -->
      <button @click="openModal">Adicionar Item</button>

      <!-- Tabela de itens da venda -->
      <Table :data="itensVenda" :columns="columns" />

      <!-- Modal para adicionar/editar item -->
      <Modal v-if="isModalOpen" @close="closeModal">
        <h2>{{ editMode ? 'Editar Item' : 'Novo Item' }}</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label>Produto:</label>
            <input v-model="form.produto" placeholder="Nome do produto" required />
          </div>
          <div>
            <label>Quantidade:</label>
            <input type="number" v-model="form.quantidade" required />
          </div>
          <div>
            <label>Preço Unitário:</label>
            <input type="number" v-model="form.precoUnitario" required />
          </div>
          <div>
            <label>Total:</label>
            <input type="number" v-model="form.total" :readonly="true" />
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
import { ref, watch } from 'vue'

export default {
  name: 'VendaItem',
  components: { AdminEscolaLayout, Table, Modal },
  setup() {
    const itensVenda = ref([
      { produto: 'Uniforme Ballet', quantidade: 2, precoUnitario: 120, total: 240 },
      { produto: 'Sapatilha Jazz', quantidade: 1, precoUnitario: 80, total: 80 },
    ])

    const columns = ['Produto', 'Quantidade', 'Preço Unitário', 'Total']

    const isModalOpen = ref(false)
    const editMode = ref(false)
    const form = ref({ produto: '', quantidade: 0, precoUnitario: 0, total: 0 })

    function openModal() {
      isModalOpen.value = true
      editMode.value = false
      form.value = { produto: '', quantidade: 0, precoUnitario: 0, total: 0 }
    }

    function closeModal() {
      isModalOpen.value = false
    }

    // Atualiza total sempre que quantidade ou preço muda
    watch([() => form.value.quantidade, () => form.value.precoUnitario], () => {
      form.value.total = form.value.quantidade * form.value.precoUnitario
    })

    function submitForm() {
      itensVenda.value.push({ ...form.value })
      closeModal()
    }

    return { itensVenda, columns, isModalOpen, editMode, form, openModal, closeModal, submitForm }
  }
}
</script>

<style scoped>
.venda-item-page {
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
