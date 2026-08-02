<template>
  <AdminEscolaLayout>
    <div class="professor-modalidade-page">
      <h1>Gerenciar Professor x Modalidade</h1>

      <!-- Botão para abrir modal -->
      <button @click="openModal">Vincular Professor a Modalidade</button>

      <!-- Tabela de vinculações -->
      <Table :data="vinculos" :columns="columns" @delete="deletarVinculo" @edit="editarVinculo" />

      <!-- Modal para adicionar/editar vinculação -->
      <Modal v-if="isModalOpen" @close="closeModal">
        <h2>{{ editMode ? 'Editar Vinculação' : 'Nova Vinculação' }}</h2>
        <form @submit.prevent="submitForm">
          <div>
            <label>Professor:</label>
            <select v-model="form.professorId" required>
              <option v-for="prof in professores" :key="prof.id" :value="prof.id">
                {{ prof.nome }}
              </option>
            </select>
          </div>
          <div>
            <label>Modalidade:</label>
            <select v-model="form.modalidadeId" required>
              <option v-for="mod in modalidades" :key="mod.id" :value="mod.id">
                {{ mod.nome }}
              </option>
            </select>
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
  name: 'ProfessorModalidade',
  components: { AdminEscolaLayout, Table, Modal },
  setup() {
    const vinculos = ref([])
    const professores = ref([])
    const modalidades = ref([])
    const columns = ['Professor', 'Modalidade']

    const isModalOpen = ref(false)
    const editMode = ref(false)
    const form = ref({ id: null, professorId: null, modalidadeId: null })

    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }

    // Carregar vinculos
    const carregarVinculos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/professor-modalidade', { headers })
        vinculos.value = response.data
      } catch (err) {
        console.error('Erro ao carregar vinculos:', err)
      }
    }

    // Carregar professores
    const carregarProfessores = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/professores', { headers })
        professores.value = response.data
      } catch (err) {
        console.error('Erro ao carregar professores:', err)
      }
    }

    // Carregar modalidades
    const carregarModalidades = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/modalidades', { headers })
        modalidades.value = response.data
      } catch (err) {
        console.error('Erro ao carregar modalidades:', err)
      }
    }

    onMounted(() => {
      carregarVinculos()
      carregarProfessores()
      carregarModalidades()
    })

    function openModal() {
      isModalOpen.value = true
      editMode.value = false
      form.value = { id: null, professorId: null, modalidadeId: null }
    }

    function closeModal() {
      isModalOpen.value = false
    }

    async function submitForm() {
      try {
        if (editMode.value) {
          await axios.put(`http://localhost:3000/api/professor-modalidade/${form.value.id}`, form.value, { headers })
        } else {
          await axios.post('http://localhost:3000/api/professor-modalidade', form.value, { headers })
        }
        closeModal()
        carregarVinculos()
      } catch (err) {
        console.error('Erro ao salvar vinculo:', err)
      }
    }

    function editarVinculo(vinculo) {
      editMode.value = true
      form.value = { ...vinculo }
      isModalOpen.value = true
    }

    async function deletarVinculo(vinculo) {
      if (!confirm(`Deseja realmente remover a vinculação?`)) return
      try {
        await axios.delete(`http://localhost:3000/api/professor-modalidade/${vinculo.id}`, { headers })
        carregarVinculos()
      } catch (err) {
        console.error('Erro ao deletar vinculo:', err)
      }
    }

    return { vinculos, professores, modalidades, columns, isModalOpen, editMode, form, openModal, closeModal, submitForm, editarVinculo, deletarVinculo }
  }
}
</script>

<style scoped>
.professor-modalidade-page {
  padding: 20px;
}

button {
  margin-bottom: 20px;
  padding: 8px 16px;
  background-color: mediumslateblue;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

button:hover {
  background-color: slateblue;
}
</style>
