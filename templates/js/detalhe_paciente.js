let token = null;
let pacienteId = null;

document.addEventListener('DOMContentLoaded', async () => {
    token = localStorage.getItem('token');

    if (!token) {
        alert("Você precisa estar logado.");
        window.location.href = 'login.html';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    pacienteId = urlParams.get('id');

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

    // ======== CONTROLES DO MODAL DE RELATÓRIO =========
    const btnAbrirModal = document.getElementById('btn-novo-relatorio');
    const modal = document.getElementById('modal-novo-relatorio');
    const btnFecharModal = document.getElementById('modal-close');
    const btnCancelar = document.getElementById('btn-cancelar');

    btnAbrirModal?.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    btnFecharModal?.addEventListener('click', () => {
        modal.style.display = 'none';
    });

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
        window.location.href = 'dashboard.html';
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

    // ======== CONTROLES DO MODAL DE EDIÇÃO DO PACIENTE =========
    const btnEditar = document.getElementById('btn-editar');
    const modalEditar = document.getElementById('modal-editar-paciente');
    const fecharModalEditar = document.getElementById('fechar-modal-editar');
    const btnCancelarEdicao = document.getElementById('btn-cancelar-edicao');
    const formEditar = document.getElementById('form-editar-paciente');

    btnEditar?.addEventListener('click', () => {
        // Preenche os inputs do modal com os dados atuais da tela
        document.getElementById('edit-nome').value = document.getElementById('nome_completo').textContent;
        document.getElementById('edit-email').value = document.getElementById('email').textContent;
        document.getElementById('edit-telefone').value = document.getElementById('telefone').textContent;
        const dataNascimento = document.getElementById('data_nascimento').textContent;
        document.getElementById('edit-data-nascimento').value = dataNascimento ? new Date(dataNascimento).toISOString().slice(0, 10) : '';
        document.getElementById('edit-sexo').value = document.getElementById('sexo').textContent;
        document.getElementById('edit-estado-civil').value = document.getElementById('estado_civil').textContent;
        document.getElementById('edit-nome-mae').value = document.getElementById('nome_mae').textContent;
        document.getElementById('edit-nome-pai').value = document.getElementById('nome_pai').textContent;
        document.getElementById('edit-nacionalidade').value = document.getElementById('nacionalidade').textContent;
        document.getElementById('edit-contato-emergencia').value = document.getElementById('contato_emergencia').textContent;
        document.getElementById('edit-endereco').value = document.getElementById('endereco').textContent;
        document.getElementById('edit-cep').value = document.getElementById('cep').textContent;
        document.getElementById('edit-tipo-sanguineo').value = document.getElementById('tipo_sanguineo').textContent;
        document.getElementById('edit-alergias').value = document.getElementById('alergias').textContent;
        document.getElementById('edit-doenca-cronica').value = document.getElementById('doenca_cronica').textContent;
        document.getElementById('edit-medicamentos').value = document.getElementById('medicamentos').textContent;

        modalEditar.style.display = 'block';
    });

    fecharModalEditar?.addEventListener('click', () => {
        modalEditar.style.display = 'none';
    });

    btnCancelarEdicao?.addEventListener('click', () => {
        modalEditar.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modalEditar) {
            modalEditar.style.display = 'none';
        }
    });

    formEditar?.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dadosEditados = {
            nome: document.getElementById('edit-nome').value.trim(),
            email: document.getElementById('edit-email').value.trim(),
            telefone: document.getElementById('edit-telefone').value.trim(),
            dataDeNascimento: document.getElementById('edit-data-nascimento').value,
            sexo: document.getElementById('edit-sexo').value,
            estadoCivil: document.getElementById('edit-estado-civil').value.trim(),
            nomeDaMae: document.getElementById('edit-nome-mae').value.trim(),
            nomeDoPai: document.getElementById('edit-nome-pai').value.trim(),
            nacionalidade: document.getElementById('edit-nacionalidade').value.trim(),
            contatoDeEmergencia: document.getElementById('edit-contato-emergencia').value.trim(),
            endereco: document.getElementById('edit-endereco').value.trim(),
            cep: document.getElementById('edit-cep').value.trim(),
            tipoSanguineo: document.getElementById('edit-tipo-sanguineo').value.trim(),
            alergias: document.getElementById('edit-alergias').value.trim(),
            doencaCronica: document.getElementById('edit-doenca-cronica').value.trim(),
            medicamentosEmUso: document.getElementById('edit-medicamentos').value.trim(),
        };

        try {
            const resposta = await fetch(`http://127.0.0.1:3333/edit-paciente/${pacienteId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosEditados)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert('Paciente atualizado com sucesso!');
                modalEditar.style.display = 'none';
                preencherDados(resultado); // Atualiza a visualização com os dados atualizados
            } else {
                alert(resultado.mensagem || 'Erro ao atualizar paciente.');
            }
        } catch (erro) {
            console.error('Erro ao atualizar paciente:', erro);
            alert('Erro ao atualizar paciente. Veja o console para detalhes.');
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
    listaRelatorios.className = 'reports-container';
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
                listaRelatorios.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📄</div>
                        <div class="empty-state-text">Nenhum relatório encontrado</div>
                        <div class="empty-state-subtext">Você pode adicionar um novo relatório clicando no botão acima.</div>
                    </div>
                `;
                return;
            }

            listaRelatorios.innerHTML = '';
            dados.forEach(r => {
                const item = document.createElement('div');
                item.className = 'report-card';
                item.innerHTML = `
                    <div class="report-header">
                        <div>
                            <div class="report-date">${r.dataVisita}</div>
                            <div class="report-time">${r.horaVisita}</div>
                        </div>
                        <div class="report-type">${r.tipoVisita}</div>
                    </div>
                    <div class="report-description">${r.descricaoVisita}</div>
                    <div class="report-observations">
                        <strong>Observações:</strong> ${r.observacoesVisita || 'Nenhuma'}
                    </div>
                    <div class="report-footer">
                        <button class="btn-view-details" data-id="${r.id}">Ver detalhes</button>
                        <button class="btn-delete" data-id="${r.id}">🗑️</button>
                    </div>
                `;
                listaRelatorios.appendChild(item);
            });

            // Eventos dos botões dentro dos relatórios
            document.querySelectorAll('.btn-view-details').forEach(btn =>
                btn.addEventListener('click', () => {
                    const relatorioId = btn.getAttribute('data-id');
                    alert(`Abrir modal com detalhes do relatório ${relatorioId} (ainda será implementado).`);
                })
            );

            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const relatorioId = btn.getAttribute('data-id');
                    if (confirm("Tem certeza que deseja excluir este relatório?")) {
                        try {
                            const resposta = await fetch(`http://127.0.0.1:3333/delete-relatorio/${relatorioId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                }
                            });

                            if (resposta.ok) {
                                btn.closest('.report-card').remove();
                                await carregarRelatorios(pacienteId, token); // recarrega a lista
                            } else {
                                const erro = await resposta.json();
                                alert(erro.mensagem || 'Erro ao excluir relatório.');
                            }
                        } catch (erro) {
                            console.error('Erro ao excluir relatório:', erro);
                            alert('Erro ao excluir relatório.');
                        }
                    }
                });
            });

        } else {
            listaRelatorios.innerHTML = '<p>Erro ao carregar relatórios.</p>';
        }

    } catch (erro) {
        console.error('Erro ao buscar relatórios:', erro);
        listaRelatorios.innerHTML = '<p>Erro ao buscar relatórios.</p>';
    }
}
