const token = localStorage.getItem('token')

if(!token){
    location.href = '../index.html'
}

const btn_listar = document.getElementById('btn_listar')
const resposta = document.getElementById('resposta')

btn_listar.addEventListener('click', (e) =>{
    e.preventDefault()

    fetch(`http://localhost:3000/clientes`,{
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
        console.error('Erro ao listar clientes!',err)
        resposta.innerHTML = '<p>Erro ao listar clientes!</p>'
    })
})

function criarTbody(dados){
    let corpo = '<tbody>'
    dados.forEach(el => {
      corpo += '<tr>'
      corpo += `<td>${el.codCliente || el.id}</td>`  
      corpo += `<td>${el.nome}</td>`  
      corpo += `<td>${el.email}</td>`    
      corpo += `<td>${el.cpf}</td>`  
      corpo += `<td>${el.endereco}</td>`  
      corpo += `<td>${el.telefone}</td>`  
      corpo += '</tr>'
    })
    corpo += '</tbody>'
    return corpo
}

function criarThead(){
    return `
        <thead>
            <tr>
                <th>Código do Cliente</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th>Endereço</th>
                <th>Telefone</th>
            </tr>
        </thead>
    `
}