const Agendamento = require('../models/Agendamento')
const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')

const cadastrar = async(req,res) =>{
    const valores = req.body 

    if(!valores.data || !valores.tipoServico || !valores.idVeiculo || !valores.idCliente){
        return res.status(400).json({message: 'Preencha todos os campos!'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        const veiculo = await Veiculo.findByPk(valores.idVeiculo)
        if(!veiculo){
            return res.status(404).json({message: 'Veiculo não encontrado!'})
        }

        const agendamento = await Agendamento.create(valores)
        return res.status(201).json({message: 'Agendamento cadastrado com sucesso!'})
    }catch(err){
        console.error('Erro ao cadastrar o agendamento!',err)
        return res.status(500).json({message: 'Erro ao cadastrar o agendamento!'})
    }
}

const listar = async(req,res) =>{
    try{
        const agendamentos = await Agendamento.findAll({
            order: [['data', 'ASC']],
            include: [
                {
                    model: Cliente,
                    as: 'clienteAgendamento',
                    attributes: ['codCliente', 'nome', 'email', 'telefone']
                },
                {
                    model: Veiculo,
                    as: 'veiculoAgendamento',
                    attributes: ['codVeiculo', 'modelo', 'tipo', 'aro']
                },
            ]
        })
        
        return res.status(200).json(agendamentos)
    }catch(err){
        console.error('Erro ao listar os agendamentos!',err)
        return res.status(500).json({message: 'Erro ao listar os agendamentos!'})
    }
}

const atualizar = async(req,res) =>{
    const id = req.params
    const valores = req.body

    try{
        const agendamento = await Agendamento.findByPk(id)
        if(!agendamento){
            return res.status(404).json({message: 'Agendamento não encontrado!'})
        }

        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        const veiculo = await Veiculo.findByPk(valores.idVeiculo)
        if(!veiculo){
            return res.status(404).json({message: 'Veiculo não encontrado!'})
        }

        await Agendamento.update(valores, {where: {codAgendamento: id}})
        return res.status(200).json({message: 'Agendamento atualizado com sucesso!'})
    }catch(err){
        console.error('Erro ao atualizar o agendamento!',err)
        return res.status(500).json({message: 'Erro ao atualizar o agendamento!'})
    }
}

module.exports = {cadastrar, listar, atualizar}