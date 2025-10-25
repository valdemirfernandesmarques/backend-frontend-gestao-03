<template>
  <AdminEscolaLayout>
    <div class="pagamentos-page">
      <h1>Gerenciar Pagamentos</h1>

      <!-- Botão para abrir modal -->
      <button @click="openModal">Registrar Pagamento</button>

      <!-- Tabela de pagamentos -->
      <Table :data="pagamentos" :columns="columns" @delete="deletarPagamento" />

      <!-- Modal para registrar pagamento -->
      <Modal v-if="isModalOpen" @close="closeModal">
        <h2>Registrar Pagamento</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label>Aluno:</label>
            <select v-model="form.alunoId" required>
              <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
                {{ aluno.nome }}
              </option>
            </select>
          </div>

          <div>
            <label>Mensalidade:</label>
            <select v-model="form.mensalidadeId" required>
              <option v-for="mens in mensalidades" :key="mens.id" :value="mens.id">
                {{ mens.alunoNome }} - R$ {{ mens.valor }} - Venc: {{ mens.vencimento }}
              </option>
            </select>
          </div>

          <div>
            <label>Data do Pagamento:</label>
            <input type="date" v-model="form.dataPagamento" required />
          </div>

          <div>
            <label>Valor Pago (R$):</label>
            <input type="number" v-model="form.valorPago" step="0.01" required />
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
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
  name: 'Pagamentos',
  components: { AdminEscolaLayout, Table, Modal },
  setup() {
    const pagamentos = ref([])
    const alunos = ref([])
    const mensalidades = ref([])
    const columns = ['Aluno', 'Mensalidade', 'Data do Pagamento', 'Valor Pago']

    const isModalOpen = ref(false)
    const form = ref({ alunoId: null, mensalidadeId: null, dataPagamento: '', valorPago: '' })

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    // Carregar pagamentos
    const carregarPagamentos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pagamentos', { headers })
        pagamentos.value = response.data
      } catch (err) {
        console.error('Erro ao carregar pagamentos:', err)
      }
    }

    // Carregar alunos
    const carregarAlunos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/alunos', { headers })
        alunos.value = response.data
      } catch (err) {
        console.error('Erro ao carregar alunos:', err)
      }
    }

    // Carregar mensalidades
    const carregarMensalidades = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/mensalidades', { headers })
        mensalidades.value = response.data.map(m => ({
          ...m,
          alunoNome: alunos.value.find(a => a.id === m.alunoId)?.nome || 'Aluno'
        }))
      } catch (err) {
        console.error('Erro ao carregar mensalidades:', err)
      }
    }

    onMounted(async () => {
      await carregarAlunos()
      await carregarMensalidades()
      await carregarPagamentos()
    })

    function openModal() {
      isModalOpen.value = true
      form.value = { alunoId: null, mensalidadeId: null, dataPagamento: '', valorPago: '' }
    }

    function closeModal() {
      isModalOpen.value = false
    }

    async function submitForm() {
      try {
        await axios.post('http://localhost:3000/api/pagamentos', form.value, { headers })
        closeModal()
        await carregarPagamentos()
      } catch (err) {
        console.error('Erro ao salvar pagamento:', err)
      }
    }

    async function deletarPagamento(pagamento) {
      if (!confirm('Deseja realmente excluir este pagamento?')) return
      try {
        await axios.delete(`http://localhost:3000/api/pagamentos/${pagamento.id}`, { headers })
        await carregarPagamentos()
      } catch (err) {
        console.error('Erro ao deletar pagamento:', err)
      }
    }

    return { pagamentos, alunos, mensalidades, columns, isModalOpen, form, openModal, closeModal, submitForm, deletarPagamento }
  }
}
</script>

<style scoped>
.pagamentos-page {
  padding: 20px;
}

button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: mediumseagreen;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: seagreen;
}
</style>
