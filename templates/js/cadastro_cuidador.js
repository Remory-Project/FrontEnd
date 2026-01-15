const form = document.getElementById('cadastro-form');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const resposta = await fetch('http://127.0.0.1:3333/criar/cuidador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, password_hash: senha }),
        });

        const dados = await resposta.json();
        console.log("resposta", resposta.status);

        if (resposta.ok) {
            mensagem.textContent = dados.mensagem || 'Cadastro realizado com sucesso!';
            mensagem.style.color = 'green';
            window.location.href = 'login.html';
            
        } else {
            mensagem.textContent = dados.mensagem || 'Erro no cadastro.';
            mensagem.style.color = 'red';
        }
    } catch (erro) {
        mensagem.textContent = 'Erro ao conectar com o servidor.';
        mensagem.style.color = 'red';
    }
});
