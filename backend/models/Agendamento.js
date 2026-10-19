const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const Agendamento = db.define('Agendamento',{
    codAgendamento:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    data:{
        type: DataTypes.DATE,
        allowNull: false
    },
    tipoServico:{
        type: DataTypes.ENUM('REVISAO', 'MANUTENCAO', 'INSTALACAO'),
        allowNull: false
    },
    idVeiculo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'veiculos',
            key: 'codVeiculo'
        },
    },
    idCliente:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: 'clientes',
            key: 'codCliente'
        },
    },
    
},{
    timestamps: false,
    tableName: 'agendamentos'
})

module.exports = Agendamento