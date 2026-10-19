const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async(req,res) =>{
    const valores = req.body 

    if(!valores.email || !valores.senha || !valores.senha || !valores.cpf || !valores.endereco || !valores.telefone){
        return res.status(400).json({message: 'Preencha todos os campos!'})
    }

    if(valores.cpf.length !==11){
        return res.status(400).json({message: 'CPF inválido!'})
    }

    try{
        const senhaCriptografada = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        const cpfCriptografado = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()

        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCriptografada,
            cpf: cpfCriptografado,
            endereco: valores.endereco,
            telefone: valores.telefone
        })

        return res.status(201).json({message: 'Cliente cadastrado com sucesso!'})
    }catch(err){
        console.error('Erro ao cadastrar o cliente!',err)
        return res.status(500).json({message: 'Erro ao cadastrar o cliente!'})
    }
}

const listar = async(req,res) =>{
    try{
        const clientes = await Cliente.findAll()
        let resultado = []

        clientes.forEach((el)=>{
            let cpfDescriptografado = ''
            try{
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            }catch(err){
                cpfDescriptografado = 'Erro ao descriptografar!'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                endereco: el.endereco,
                telefone: el.telefone
            })
        })
        return res.status(200).json(resultado)
    }catch(err){
        console.error('Erro ao listar os clientes!',err)
        return res.status(500).json({message: 'Erro ao listar os clientes!'})
    }
}

const consultarNome = async(req,res) =>{
    const nome = req.params.nome 

    try{
        const cliente = await Cliente.findOne({where: {nome: nome}})

        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            endereco: cliente.endereco,
            telefone: cliente.telefone
        })
    }catch(err){
        console.error('Erro ao consultar o cliente!',err)
        return res.status(500).json({message: 'Erro ao consultar o cliente!'})
    }
}

const atualizar = async(req,res) =>{
    const id = req.params.id
    const valores = req.body

    try{
        const cliente = await Cliente.findByPk(id)

        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        const dadosAtualizados = {...valores}

        if(valores.cpf){
            if(valores.cpf.length !==11){
            return res.status(400).json({message: 'CPF inválido!'})
        }
        dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if(valores.senha){
            dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        }

        await Cliente.update(dadosAtualizados, {where: {codCliente: id}})
        return res.status(200).json({message: 'Cliente atualizado com sucesso!'})
    }catch(err){
        console.error('Erro ao atualizar o cliente!',err)
        return res.status(500).json({message: 'Erro ao atualizar o cliente!'})
    }
}

const apagar = async(req,res) =>{
    const id = req.params.id 

    try{
        const cliente = await Cliente.findByPk(id)

        if(!cliente){
            return res.status(404).json({message: 'Cliente não encontrado!'})
        }

        await Cliente.destroy({where: {codCliente : id}})
        return res.status(200).json({message: 'Cliente excluído com sucesso!'})
    }catch(err){
        console.error('Erro ao excluir o cliente!',err)
        return res.status(500).json({message: 'Erro ao excluir o cliente!'})
    }
}

module.exports = {cadastrar, listar, consultarNome, atualizar, apagar}