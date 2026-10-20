const token = localStorage.getItem('token')

if(!token){
    location.href = '../index.html'
}

const btn_listar = document.getElementById('btn_listar')
const resposta = document.getElementById('resposta')

btn_listar.addEventListener('click', (e) =>{
    e.preventDefault()

    fetch(`http://localhost:3000/agendamentos`,{
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': token
        },
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
       console.log(dados)
        resposta.innerHTML = ''
        resposta.innerHTML += `
        <table>
            ${criarThead()}
            ${criarTbody(dados)}
        </table>
        `
    })
    .catch(err =>{
        console.error('Erro ao listar agendamentos!',err)
        resposta.innerHTML = '<p>Erro ao listar agendamentos!</p>'
    })
})

function criarTbody(dados){
    let corpo = '<tbody>'
    dados.forEach(el => {
        const nomeCliente = el.clienteAgendamento ? el.clienteAgendamento.nome : 'N/A'
        const modeloVeiculo = el.veiculoAgendamento ? `${el.veiculoAgendamento.modelo} (Marca ${el.veiculoAgendamento.marca})` : 'N/A'

      corpo += '<tr>'
      corpo += `<td>${el.codAgendamento || el.id}</td>`  
      corpo += `<td>${el.data}</td>`  
      corpo += `<td>${el.tipoServico}</td>`    
      corpo += `<td>${nomeCliente}</td>`  
      corpo += `<td>${modeloVeiculo}</td>`  
      corpo += '</tr>'
    })
    corpo += '</tbody>'
    return corpo
}

function criarThead(){
    return `
        <thead>
            <tr>
                <th>Código do Agendamento</th>
                <th>Data</th>
                <th>Tipo de Serviço</th>
                <th>Cliente</th>
                <th>Veiculo</th>
            </tr>
        </thead>
    `
}