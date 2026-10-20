const token = localStorage.getItem('token')

if(!token){
    location.href = '../index.html'
}

const btn_cadastrar = document.getElementById('btn_cadastrar')
const resposta = document.getElementById('resposta')

btn_cadastrar.addEventListener('click', (e) =>{
    e.preventDefault()

    const valores = {
        modelo: document.getElementById('modelo').value,
        marca: document.getElementById('marca').value,
        placa: document.getElementById('placa').value,
        codigoRastreador: document.getElementById('codigoRastreador').value,
        idCliente: document.getElementById('idCliente').value,
    }

    fetch(`http://localhost:3000/veiculo`,{
        method: 'POST',
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
        console.error('Erro ao cadastrar o veiculo!',err)
        resposta.innerHTML = '<p>Erro ao cadastrar o veiculo!</p>'
    })
})