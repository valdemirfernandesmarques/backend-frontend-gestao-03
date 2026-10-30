<template>
  <div class="table-responsive">
    <table class="custom-table">
      <thead>
        <tr>
          <th v-for="col in columns" :key="col.field">{{ col.label }}</th>
          <th v-if="actions && actions.length">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data || data.length === 0">
          <td :colspan="columns.length + (actions && actions.length ? 1 : 0)" class="no-data">
            Nenhum registro encontrado.
          </td>
        </tr>
        <tr v-for="row in data" :key="row.id">
          <td v-for="col in columns" :key="col.field">
            {{ row[col.field] }}
          </td>
          <td v-if="actions && actions.length" class="actions-cell">
            <button
              v-if="actions.includes('edit')"
              @click="$emit('edit', row)"
              class="btn edit"
              title="Editar"
            >
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button
              v-if="actions.includes('delete')"
              @click="$emit('delete', row)"
              class="btn delete"
              title="Excluir"
            >
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Array,
    required: true
  },
  columns: {
    type: Array,
    required: true
  },
  actions: {
    type: Array,
    default: () => [] // Ex: ['edit', 'delete']
  }
});

defineEmits(['edit', 'delete']);
</script>

<style scoped>
/* Estilos ajustados para o tema escuro do projeto */
.table-responsive {
  width: 100%;
  overflow-x: auto;
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #1f1c3a; /* Fundo da tabela */
  color: #f0f0f0; /* Cor do texto */
  border-radius: 8px;
  overflow: hidden; /* Garante que o border-radius seja aplicado nas bordas */
}

.custom-table th,
.custom-table td {
  border: 1px solid #332f54; /* Borda sutil */
  padding: 12px 15px;
  text-align: left;
  white-space: nowrap; /* Impede que o texto quebre linha */
}

.custom-table th {
  background-color: #2a2a3f; /* Cabeçalho um pouco mais escuro */
  font-weight: 600;
  color: #e45da9; /* Cor de destaque do tema */
}

.custom-table tr:hover {
  background-color: #2b2850;
}

.no-data {
  text-align: center;
  color: #c799df;
  padding: 2rem;
}

.actions-cell {
  text-align: center;
  min-width: 120px;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  margin: 0 4px;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
  transition: all 0.2s ease;
}

.btn.edit {
  background-color: #3b3b4f;
  color: #c799df;
}

.btn.edit:hover {
  background-color: #4c4c6d;
  color: #fff;
}

.btn.delete {
  background-color: #3b3b4f;
  color: #ff3c78;
}

.btn.delete:hover {
  background-color: #ff3c78;
  color: #fff;
}
</style>