const form = document.getElementById('login-form');
const mensagem = document.getElementById('mensagem');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    try {
        const resposta = await fetch('http://127.0.0.1:3333/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password:senha }),
        });

        const dados = await resposta.json();
        console.log("resposta", resposta.status)

        if (resposta.ok) {
            mensagem.textContent = dados.mensagem || 'Login realizado com sucesso!';
            mensagem.style.color = 'green';

        } else {
            mensagem.textContent = dados.mensagem || 'Erro no login.';
            mensagem.style.color = 'red';
        }
    } catch (erro) {
        mensagem.textContent = 'Erro ao conectar com o servidor.';
        mensagem.style.color = 'red';
    }
});
