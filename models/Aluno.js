// backend/models/Aluno.js
module.exports = (sequelize, DataTypes) => {
    const Aluno = sequelize.define('Aluno', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true // ✅ Crucial para o TiDB
        },
        nome: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dataNascimento: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        cpf: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        telefone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        endereco: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        escolaId: {
            type: DataTypes.INTEGER,
            allowNull: false // ✅ Essencial para o isolamento SAAS
        }
    }, {
        tableName: 'Alunos', // ✅ Nome exato da tabela no banco
        timestamps: true
    });

    Aluno.associate = (models) => {
        Aluno.belongsTo(models.Escola, {
            foreignKey: 'escolaId',
            as: 'escola'
        });
        Aluno.hasMany(models.Matricula, {
            foreignKey: 'alunoId',
            as: 'matriculas'
        });
        Aluno.hasMany(models.Venda, {
            foreignKey: 'alunoId',
            as: 'vendas'
        });
    };

    return Aluno;
};