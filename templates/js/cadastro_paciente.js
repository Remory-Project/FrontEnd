const form = document.getElementById('cadastro-formP');
const mensagem = document.getElementById('mensagem');


form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const token = localStorage.getItem('token');
    const cuidador = JSON.parse(localStorage.getItem('cuidador'));
    
    if (!token) {
        alert('você precisa estar logado. ')
        window.location.href = 'login.html'
        return;
    }

    const nome = document.getElementById('nome_completo').value;
    const dataDeNascimento = document.getElementById('data_nascimento').value;
    const sexo = document.getElementById('sexo').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const estadoCivil = document.getElementById('est_civ').value;
    const nomeDaMae = document.getElementById('n_mae').value;
    const nomeDoPai = document.getElementById('n_pai').value;
    const nacionalidade = document.getElementById('nacic').value;
    const contatoDeEmergencia = document.getElementById('n_cont_emr').value;
    const endereco = document.getElementById('end').value;
    const cep = document.getElementById('cep').value;
    const tipoSanguineo = document.getElementById('tp_sangue').value;
    const alergias = document.getElementById('alergias').value;
    const doencaCronica = document.getElementById('doen_cro').value;

    try {
        const resposta = await fetch('http://127.0.0.1:3333/criar/paciente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nome,
                dataDeNascimento,
                telefone,
                sexo,
                email,
                estadoCivil,
                nomeDaMae,
                nomeDoPai,
                nacionalidade,
                contatoDeEmergencia,
                endereco,
                cep,
                tipoSanguineo,
                alergias,
                doencaCronica,
            }),
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagem.textContent = dados.mensagem || 'Cadastro realizado com sucesso!';
            mensagem.style.color = 'green';
            window.location.href = 'dashboard.html';

        } else {
            mensagem.textContent = dados.mensagem || 'Erro no cadastro.';
            mensagem.style.color = 'red';
        }
    } catch (erro) {
        mensagem.textContent = 'Erro ao conectar com o servidor.';
        mensagem.style.color = 'red';
        console.error("Erro:", erro)
    }
});
