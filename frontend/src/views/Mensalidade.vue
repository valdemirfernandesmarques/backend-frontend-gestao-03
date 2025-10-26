<template>
  <div class="mensalidade-page">
    <h1>Controle de Mensalidades</h1>

    <button @click="openModal">Nova Mensalidade</button>
    
    <div v-if="apiError" class="error-message">
      Erro ao carregar dados: {{ apiError }}
      <p>Verifique o console (F12) e o status do seu servidor backend (porta 3000).</p>
    </div>

    <Table
      :data="mensalidadesFormatadas"
      :columns="columns"
      @edit="editMensalidade"
      @delete="deleteMensalidade"
    />

    <Modal v-if="isModalOpen" @close="closeModal">
      <h2>{{ editMode ? 'Editar Mensalidade' : 'Nova Mensalidade' }}</h2>
      <form @submit.prevent="submitForm">
        <fieldset>
          <legend>Aluno e Turma</legend>
          <div class="form-group">
            <label>Aluno/Turma:</label>
            <select v-model="selectedMatricula" required>
              <option value="">Selecione</option>
              <option
                v-for="matricula in matriculas"
                :key="matricula.id"
                :value="matricula"
              >
                {{ matricula.alunoNome }} - {{ matricula.turmaNome }}
              </option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>Pagamento</legend>
          <div class="form-group">
            <label>Valor:</label>
            <input
              type="number"
              step="0.01"
              v-model="form.valor"
              placeholder="R$ 100,00"
              required
            />
            <label>Data de Vencimento do 1º mês:</label>
            <input type="date" v-model="form.dataVencimento" required />
            <label>Quantidade de Meses:</label>
            <input type="number" v-model="quantidadeMeses" min="1" required />
          </div>
          <div class="form-group">
            <label>Status:</label>
            <select v-model="form.status" required>
              <option value="PENDENTE">Pendente</option>
              <option value="PAGO">Pago</option>
              <option value="ATRASADO">Atrasado</option>
              <option value="CANCELADO">Cancelado</option>
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
</template>

<script>
import Table from '../components/Table.vue'
import Modal from '../components/Modal.vue'
import api from '../api/api'
import { ref, onMounted, computed } from 'vue'

export default {
  name: 'Mensalidade',
  components: { Table, Modal },
  setup() {
    const mensalidades = ref([])
    const matriculas = ref([])
    const columns = ['Aluno', 'Turma', 'Valor', 'Vencimento', 'Status', 'Ações']
    const isModalOpen = ref(false)
    const editMode = ref(false)
    const apiError = ref(null)

    const selectedMatricula = ref(null)
    const quantidadeMeses = ref(1) // quantidade de meses para gerar automaticamente
    const form = ref({
      id: null,
      alunoId: null,
      turmaId: null,
      escolaId: parseInt(localStorage.getItem('escolaId')) || null,
      valor: '',
      dataVencimento: '',
      status: 'PENDENTE'
    })

    const mensalidadesFormatadas = computed(() => {
      return mensalidades.value.map(m => {
        const alunoNome = m.matricula?.aluno?.nome || '—'
        const turmaNome = m.matricula?.turma?.nome || '—'
        return {
          Aluno: alunoNome,
          Turma: turmaNome,
          Valor: `R$ ${parseFloat(m.valor).toFixed(2)}`,
          Vencimento: m.dataVencimento ? m.dataVencimento.split('T')[0] : '—',
          Status: m.status,
          original: m
        }
      })
    })

    const loadData = async () => {
      apiError.value = null
      try {
        const [resMensalidades, resMatriculas] = await Promise.all([
          api.get('/mensalidades'),
          api.get('/matriculas')
        ])
        mensalidades.value = resMensalidades.data
        matriculas.value = resMatriculas.data.map(m => ({
          ...m,
          alunoNome: m.aluno?.nome || m.alunoNome || 'Aluno Desconhecido',
          turmaNome: m.turma?.nome || m.turmaNome || 'Turma Desconhecida'
        }))
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        apiError.value = `Status: ${err.response?.status || 'Erro de Rede/Configuração'}`
      }
    }

    const openModal = () => {
      resetForm()
      isModalOpen.value = true
      editMode.value = false
    }

    const editMensalidade = m => {
      const originalData = m.original || m
      selectedMatricula.value = originalData.matricula
      form.value = {
        id: originalData.id,
        alunoId: originalData.matricula?.alunoId,
        turmaId: originalData.matricula?.turmaId,
        escolaId: originalData.escolaId,
        valor: parseFloat(originalData.valor),
        dataVencimento: originalData.dataVencimento ? originalData.dataVencimento.split('T')[0] : '',
        status: originalData.status
      }
      quantidadeMeses.value = 1
      editMode.value = true
      isModalOpen.value = true
    }

    const closeModal = () => {
      isModalOpen.value = false
    }

    const resetForm = () => {
      selectedMatricula.value = null
      quantidadeMeses.value = 1
      form.value = {
        id: null,
        alunoId: null,
        turmaId: null,
        escolaId: parseInt(localStorage.getItem('escolaId')) || null,
        valor: '',
        dataVencimento: '',
        status: 'PENDENTE'
      }
    }

    const submitForm = async () => {
      try {
        if (!selectedMatricula.value) return alert('Selecione uma matrícula válida.')

        form.value.alunoId = selectedMatricula.value.alunoId
        form.value.turmaId = selectedMatricula.value.turmaId
        form.value.escolaId = parseInt(localStorage.getItem('escolaId'))

        // Geração de mensalidades múltiplas
        const promises = []
        const primeiraData = new Date(form.value.dataVencimento)
        for (let i = 0; i < quantidadeMeses.value; i++) {
          const data = new Date(primeiraData)
          data.setMonth(primeiraData.getMonth() + i)

          const mensalidadeData = {
            alunoId: form.value.alunoId,
            turmaId: form.value.turmaId,
            escolaId: form.value.escolaId,
            valor: form.value.valor,
            dataVencimento: data.toISOString().split('T')[0],
            status: form.value.status
          }

          if (editMode.value) {
            mensalidadeData.id = form.value.id
            promises.push(api.put(`/mensalidades/${form.value.id}`, mensalidadeData))
          } else {
            promises.push(api.post('/mensalidades', mensalidadeData))
          }
        }

        await Promise.all(promises)
        await loadData()
        closeModal()
      } catch (err) {
        console.error('Erro ao salvar mensalidade:', err)
        alert('Erro ao salvar mensalidade. Verifique o console.')
      }
    }

    const deleteMensalidade = async m => {
      if (!confirm('Deseja realmente excluir esta mensalidade?')) return
      try {
        await api.delete(`/mensalidades/${(m.original || m).id}`)
        await loadData()
      } catch (err) {
        console.error('Erro ao deletar mensalidade:', err)
        alert('Erro ao deletar mensalidade. Verifique o console.')
      }
    }

    onMounted(loadData)

    return {
      mensalidadesFormatadas,
      matriculas,
      selectedMatricula,
      quantidadeMeses,
      columns,
      isModalOpen,
      editMode,
      form,
      openModal,
      closeModal,
      resetForm,
      submitForm,
      editMensalidade,
      deleteMensalidade,
      apiError
    }
  }
}
</script>

<style scoped>
.mensalidade-page {
  padding: 20px;
  color: #1a202c;
}
.error-message {
  padding: 15px;
  margin-bottom: 20px;
  background-color: #fdd8d8;
  color: #c53030;
  border: 1px solid #c53030;
  border-radius: 8px;
  font-weight: bold;
}
.error-message p {
  font-weight: normal;
  margin-top: 5px;
}
h1 {
  color: #4a5568;
}
button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: #9f7aea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
button:hover {
  opacity: 0.9;
}
fieldset {
  border: 1px solid #e2e8f0;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: white;
}
legend {
  color: #ff69b4;
  font-weight: bold;
}
.form-group {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
}
.form-group label {
  flex: 1 1 150px;
  min-width: 150px;
  color: #4a5568;
}
.form-group input,
.form-group select {
  flex: 2 1 300px;
  padding: 8px;
  border: 1px solid #cbd5e0;
  background-color: white;
  color: #1a202c;
  border-radius: 5px;
}
.form-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;
}
</style>
