<template>
  <AdminEscolaLayout>
    <div class="mensalidade-page">
      <h1>Controle de Mensalidades</h1>

      <button @click="openModal">Nova Mensalidade</button>

      <Table :data="mensalidades" :columns="columns" @edit="editMensalidade" @delete="deleteMensalidade" />

      <Modal v-if="isModalOpen" @close="closeModal">
        <h2>{{ editMode ? 'Editar Mensalidade' : 'Nova Mensalidade' }}</h2>
        <form @submit.prevent="submitForm">
          <fieldset>
            <legend>Aluno e Turma</legend>
            <div class="form-group">
              <label>Aluno:</label>
              <select v-model="form.alunoId" required>
                <option value="">Selecione</option>
                <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">{{ aluno.nome }}</option>
              </select>
              <label>Turma:</label>
              <select v-model="form.turmaId" required>
                <option value="">Selecione</option>
                <option v-for="turma in turmas" :key="turma.id" :value="turma.id">{{ turma.nome }}</option>
              </select>
            </div>
          </fieldset>

          <fieldset>
            <legend>Pagamento</legend>
            <div class="form-group">
              <label>Valor:</label>
              <input type="number" v-model="form.valor" placeholder="R$ 100,00" required />
              <label>Data de Vencimento:</label>
              <input type="date" v-model="form.dataVencimento" required />
            </div>
            <div class="form-group">
              <label>Status:</label>
              <select v-model="form.status" required>
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>
          </fieldset>

          <div class="form-buttons">
            <button type="reset" @click="resetForm">Cancelar</button>
            <button type="submit">{{ editMode ? 'Atualizar' : 'Salvar' }}</button>
          </div>
        </form>
      </Modal>
    </div>
  </AdminEscolaLayout>
</template>

<script>
import AdminEscolaLayout from '../layouts/AdminEscolaLayout.vue'
import Table from '../components/Table.vue'
import Modal from '../components/Modal.vue'
import axios from 'axios'
import { ref, onMounted } from 'vue'

export default {
  name: 'Mensalidade',
  components: { AdminEscolaLayout, Table, Modal },
  setup() {
    const mensalidades = ref([])
    const alunos = ref([])
    const turmas = ref([])
    const columns = ['Aluno', 'Turma', 'Valor', 'Vencimento', 'Status']
    const isModalOpen = ref(false)
    const editMode = ref(false)
    const form = ref({ id: null, alunoId: '', turmaId: '', valor: '', dataVencimento: '', status: 'pendente' })

    const token = localStorage.getItem('token')
    const config = { headers: { Authorization: `Bearer ${token}` } }

    const loadData = async () => {
      try {
        const [resMensalidades, resAlunos, resTurmas] = await Promise.all([
          axios.get('http://localhost:3000/mensalidades', config),
          axios.get('http://localhost:3000/alunos', config),
          axios.get('http://localhost:3000/turmas', config)
        ])
        mensalidades.value = resMensalidades.data
        alunos.value = resAlunos.data
        turmas.value = resTurmas.data
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
      }
    }

    const openModal = () => { isModalOpen.value = true; editMode.value = false; resetForm() }
    const editMensalidade = (m) => { isModalOpen.value = true; editMode.value = true; form.value = { ...m } }
    const closeModal = () => { isModalOpen.value = false }
    const resetForm = () => { form.value = { id: null, alunoId: '', turmaId: '', valor: '', dataVencimento: '', status: 'pendente' } }

    const submitForm = async () => {
      try {
        if (editMode.value) await axios.put(`http://localhost:3000/mensalidades/${form.value.id}`, form.value, config)
        else await axios.post('http://localhost:3000/mensalidades', form.value, config)
        await loadData()
        closeModal()
      } catch (err) {
        console.error('Erro ao salvar mensalidade:', err)
      }
    }

    const deleteMensalidade = async (m) => {
      if (!confirm('Deseja realmente excluir esta mensalidade?')) return
      try { await axios.delete(`http://localhost:3000/mensalidades/${m.id}`, config); await loadData() }
      catch (err) { console.error('Erro ao deletar mensalidade:', err) }
    }

    onMounted(loadData)

    return { mensalidades, alunos, turmas, columns, isModalOpen, editMode, form, openModal, closeModal, resetForm, submitForm, editMensalidade, deleteMensalidade }
  }
}
</script>

<style scoped>
.mensalidade-page { padding: 20px; }
button { margin-bottom: 20px; padding: 8px 16px; background-color: #ff69b4; color: white; border: none; border-radius: 8px; cursor: pointer; }
button:hover { opacity: 0.9; }
fieldset { border: 1px solid #444; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
legend { color: #ff69b4; font-weight: bold; }
.form-group { display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 15px; }
.form-group label { flex: 1 1 150px; min-width: 150px; color: #f0f0f0; }
.form-group input, .form-group select { flex: 2 1 300px; padding: 8px; border: 1px solid #333; background-color: #2a2a40; color: #fff; border-radius: 5px; }
.form-buttons { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; }
</style>
