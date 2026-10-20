const token = localStorage.getItem('token')

if(!token){
    location.href = '../index.html'
}

const btn_atualizar = document.getElementById('btn_atualizar')
const resposta = document.getElementById('resposta')

btn_atualizar.addEventListener('click', (e) =>{
    e.preventDefault()

    const id = document.getElementById('id').value

    const valores = {
        data: document.getElementById('data').value,
        tipoServico: document.getElementById('tipoServico').value,
        idVeiculo: document.getElementById('idVeiculo').value,
        idCliente: document.getElementById('idCliente').value,
    }

    fetch(`http://localhost:3000/agendamento/${id}`,{
        method: 'PUT',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        },
        body: JSON.stringify(valores)
    })
    .then(res => {
        if(!res.ok){
            localStorage.clear()
            alert('Tempo expirado, faça login novamente!')
            location.href = '../index.html'
            throw new Error('Sessão expirada!')
        }
        return res.json()
    })
    .then(dados =>{
        resposta.innerHTML = `<p>${dados.message}</p>`
        document.querySelector('form').reset()
    })
    .catch(err =>{
        console.error('Erro ao atualizar o agendamento!',err)
        resposta.innerHTML = '<p>Erro ao atualizar o agendamento!</p>'
    })
})