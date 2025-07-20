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
            await carregarRelatorios(pacienteId, token);
        } else {
            console.error(paciente.mensagem || 'Erro ao buscar paciente.');
        }
    } catch (erro) {
        console.error('Erro ao buscar paciente:', erro);
    }

    const btnAbrirModal = document.getElementById('btn-novo-relatorio');
    const modal = document.getElementById('modal-novo-relatorio');
    const btnFecharModal = document.getElementById('modal-close');

    btnAbrirModal?.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    btnFecharModal?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const btnCancelar = document.getElementById('btn-cancelar');
    btnCancelar?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    const btnVoltar = document.getElementById('btn-voltar');
    btnVoltar?.addEventListener('click', () => {
        window.location.href = 'dashboard.html'
    });

    const formRelatorio = document.getElementById('form-novo-relatorio');
    formRelatorio?.addEventListener('submit', async (e) => {
        e.preventDefault();

        const dataVisita = document.getElementById('data-visita').value;
        const horaVisita = document.getElementById('hora-visita').value;
        const tipoVisita = document.getElementById('tipo-visita').value;
        const descricaoVisita = document.getElementById('descricao-visita').value;
        const observacoesVisita = document.getElementById('observacoes-visita').value;
        const medicamentos = document.getElementById('medicamentos').value;
        const localizacaoDor = document.getElementById('localizacao-dor').value;
        const horarioMeds = document.getElementById('horario-meds').value;
        const pressaoArterial = document.getElementById('pressao-arterial').value;
        const temperatura = document.getElementById('temperatura').value;
        const peso = document.getElementById('peso').value;

        try {
            const resposta = await fetch('http://127.0.0.1:3333/criar-relatorio', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    pacienteId: String(pacienteId),
                    dataVisita: String(dataVisita),
                    horaVisita: String(horaVisita),
                    tipoVisita: String(tipoVisita),
                    descricaoVisita: String(descricaoVisita),
                    observacoesVisita: String(observacoesVisita),
                    medicamentos: String(medicamentos),
                    localizacaoDor: String(localizacaoDor),
                    horarioMeds: String(horarioMeds),
                    pressaoArterial: String(pressaoArterial),
                    temperatura: String(temperatura),
                    peso: String(peso)
                })
            });

            const resultado = await resposta.json();
            if (resposta.ok) {
                alert('Relatório enviado com sucesso!');
                modal.style.display = 'none';
                formRelatorio.reset();
                await carregarRelatorios(pacienteId, token);
            } else {
                alert(resultado.mensagem || 'Erro ao enviar relatório.');
            }
        } catch (erro) {
            console.error('Erro ao enviar relatório:', erro);
        }
    });
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
    document.getElementById('contato_emergencia').textContent = p.contatoDeEmergencia;
    document.getElementById('endereco').textContent = p.endereco;
    document.getElementById('cep').textContent = p.cep;
    document.getElementById('tipo_sanguineo').textContent = p.tipoSanguineo;
    document.getElementById('alergias').textContent = p.alergias;
    document.getElementById('doenca_cronica').textContent = p.doencaCronica;
    document.getElementById('medicamentos').textContent = p.medicamentosEmUso;
}

async function carregarRelatorios(pacienteId, token) {
    const listaRelatorios = document.getElementById('lista-relatorios');
    listaRelatorios.innerHTML = '<p>Carregando relatórios...</p>';

    try {
        const resposta = await fetch(`http://127.0.0.1:3333/paciente/${pacienteId}/relatorios`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            if (dados.length === 0) {
                listaRelatorios.innerHTML = '<p>Nenhum relatório encontrado.</p>';
                return;
            }

            listaRelatorios.innerHTML = '';
            dados.forEach(r => {
                const item = document.createElement('div');
                item.classList.add('relatorio-item');
                item.innerHTML = `
                    <strong>Data:</strong> ${r.dataVisita} ${r.horaVisita}<br>
                    <strong>Tipo:</strong> ${r.tipoVisita}<br>
                    <strong>Descrição:</strong> ${r.descricaoVisita}<br>
                    <strong>Observações:</strong> ${r.observacoesVisita || 'Nenhuma'}<br>
                    <hr>
                `;
                listaRelatorios.appendChild(item);
            });
        } else {
            listaRelatorios.innerHTML = '<p>Erro ao carregar relatórios.</p>';
        }
    } catch (erro) {
        console.error('Erro ao buscar relatórios:', erro);
        listaRelatorios.innerHTML = '<p>Erro ao buscar relatórios.</p>';
    }
}