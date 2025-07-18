document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado.");
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pacienteId = urlParams.get('id');

    if (!pacienteId) {
        alert("Paciente não encontrado.");
        return;
    }

    try {
        const resposta = await fetch(`http://127.0.0.1:3333/paciente/${pacienteId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const paciente = await resposta.json();

        if (resposta.ok) {
            preencherDados(paciente);
        } else {
            console.error(paciente.mensagem || 'Erro ao buscar paciente.');
        }
    } catch (erro) {
        console.error('Erro ao buscar paciente:', erro);
    }
});

function preencherDados(p) {
    document.getElementById('nome_completo').textContent = p.nome;
    document.getElementById('email').textContent = p.email;
    document.getElementById('telefone').textContent = p.telefone;
    document.getElementById('data_nascimento').textContent = p.dataDeNascimento;
    document.getElementById('sexo').textContent = p.sexo;
    document.getElementById('estado_civil').textContent = p.estadoCivil;
    document.getElementById('nome_mae').textContent = p.nomeDaMae;
    document.getElementById('nome_pai').textContent = p.nomeDoPai;
    document.getElementById('nacionalidade').textContent = p.nacionalidade;
    document.getElementById('naturalidade').textContent = p.naturalidade;
    document.getElementById('contato_emergencia').textContent = p.contatoDeEmergencia;
    document.getElementById('endereco').textContent = p.endereco;
    document.getElementById('cep').textContent = p.cep;
    document.getElementById('tipo_sanguineo').textContent = p.tipoSanguineo;
    document.getElementById('alergias').textContent = p.alergias;
    document.getElementById('doenca_cronica').textContent = p.doencaCronica;
    document.getElementById('medicamentos').textContent = p.medicamentosEmUso;
}
