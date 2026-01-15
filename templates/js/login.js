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

        if (resposta.ok) {
            localStorage.setItem('token', dados.token);
            localStorage.setItem('cuidador', JSON.stringify(dados.cuidador || {}));


            mensagem.innerText = dados.message ;
            mensagem.style.color = 'green';

            window.location.href = 'dashboard.html';

        } else {
            mensagem.innerText = dados.message || 'Erro no login.';
            mensagem.style.color = 'red';
        }
    } catch (erro) {
        mensagem.innerText = 'Erro ao conectar com o servidor.';
        mensagem.style.color = 'red';
        console.error(error);
    }
});
