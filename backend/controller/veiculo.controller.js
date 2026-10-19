const Veiculo = require('../models/Veiculo')
const Cliente = require('../models/Cliente')

const cadastrar = async(req,res) =>{
    const valores = req.body 

    if(!valores.modelo || !valores.marca || !valores.placa || !valores.codigoRastreador || !valores.idCliente){
        return res.status(400).json({message: 'Preencha todos os campos!'})
    }

    try{
        const cliente = await Cliente.findByPk(valores.idCliente)
        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        const veiculo = await Veiculo.create(valores)
        return res.status(201).json({message: 'Veiculo cadastrado com sucesso!'})
    }catch(err){
        console.error('Erro ao cadastrar o veiculo!',err)
        return res.status(500).json({message: 'Erro ao cadastrar o veiculo!'})
    }
}

module.exports = {cadastrar}