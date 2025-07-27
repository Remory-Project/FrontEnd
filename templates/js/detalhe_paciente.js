let token = null;
let pacienteId = null;
let medicamentoEditandoId = null; // Variável para guardar o ID do medicamento em edição

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
            await carregarMedicamentos(pacienteId, token); // CORREÇÃO: Chamada inicial para carregar medicamentos
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
    const btnCancelar = document.getElementById('btn-cancelar-relatorio'); // Corrigido ID para 'btn-cancelar-relatorio' conforme HTML

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
        const localizacaoDor = document.getElementById('localizacao-dor').value;
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
                    localizacaoDor: String(localizacaoDor),
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
        document.getElementById('edit-nome').value = document.getElementById('nome_completo').textContent;
        document.getElementById('edit-email').value = document.getElementById('email').textContent;
        document.getElementById('edit-telefone').value = document.getElementById('telefone').textContent;
        const dataNascimento = document.getElementById('data_nascimento').textContent;
        // Formata a data para YYYY-MM-DD para o input type="date"
        if (dataNascimento) {
            const [dia, mes, ano] = dataNascimento.split('/');
            document.getElementById('edit-data-nascimento').value = `${ano}-${mes}-${dia}`;
        }
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
        };
        try {
            const resposta = await fetch(`http://127.0.0.1:3333/edit-paciente/${pacienteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(dadosEditados)
            });
            const resultado = await resposta.json();
            if (resposta.ok) {
                alert('Paciente atualizado com sucesso!');
                modalEditar.style.display = 'none';
                preencherDados(resultado);
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
    document.getElementById('nome_completo').textContent = p.nome || '';
    document.getElementById('email').textContent = p.email || '';
    document.getElementById('telefone').textContent = p.telefone || '';
    if (p.dataDeNascimento) {
        const data = new Date(p.dataDeNascimento);
        // Corrige o fuso horário para garantir que a data seja exibida corretamente
        document.getElementById('data_nascimento').textContent = new Date(data.getTime() + data.getTimezoneOffset() * 60000).toLocaleDateString('pt-BR');
    } else {
        document.getElementById('data_nascimento').textContent = '';
    }
    document.getElementById('sexo').textContent = p.sexo || '';
    document.getElementById('estado_civil').textContent = p.estadoCivil || '';
    document.getElementById('nome_mae').textContent = p.nomeDaMae || '';
    document.getElementById('nome_pai').textContent = p.nomeDoPai || '';
    document.getElementById('nacionalidade').textContent = p.nacionalidade || '';
    document.getElementById('contato_emergencia').textContent = p.contatoDeEmergencia || '';
    document.getElementById('endereco').textContent = p.endereco || '';
    document.getElementById('cep').textContent = p.cep || '';
    document.getElementById('tipo_sanguineo').textContent = p.tipoSanguineo || '';
    document.getElementById('alergias').textContent = p.alergias || '';
    document.getElementById('doenca_cronica').textContent = p.doencaCronica || '';
}

async function carregarRelatorios(pacienteId, token) {
    const listaRelatorios = document.getElementById('lista-relatorios');
    listaRelatorios.className = 'reports-container';
    listaRelatorios.innerHTML = '<p>Carregando relatórios...</p>';
    try {
        const resposta = await fetch(`http://127.0.0.1:3333/paciente/${pacienteId}/relatorios`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const dados = await resposta.json();
        if (resposta.ok) {
            if (dados.length === 0) {
                listaRelatorios.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📄</div><div class="empty-state-text">Nenhum relatório encontrado</div><div class="empty-state-subtext">Você pode adicionar um novo relatório clicando no botão acima.</div></div>`;
                return;
            }
            listaRelatorios.innerHTML = '';
            dados.forEach(r => {
                const item = document.createElement('div');
                item.className = 'report-card';
                item.innerHTML = `<div class="report-header"><div><div class="report-date">${r.dataVisita}</div><div class="report-time">${r.horaVisita}</div></div><div class="report-type">${r.tipoVisita}</div></div><div class="report-description">${r.descricaoVisita}</div><div class="report-observations"><strong>Observações:</strong> ${r.observacoesVisita || 'Nenhuma'}</div><div class="report-footer"><button class="btn-view-details" data-id="${r.id}">Ver detalhes</button><button class="btn-delete" data-id="${r.id}">🗑️</button></div>`;
                listaRelatorios.appendChild(item);
            });
            document.querySelectorAll('.btn-view-details').forEach(btn => btn.addEventListener('click', () => {
                const relatorioId = btn.getAttribute('data-id');
                const relatorio = dados.find(r => r.id === relatorioId);
                if (relatorio) {
                    abrirModalDetalhes(relatorio)
                } else {
                    alert("Relatorio não encontrado")
                }
            }));
            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const relatorioId = btn.getAttribute('data-id');
                    if (confirm("Tem certeza que deseja excluir este relatório?")) {
                        try {
                            const resposta = await fetch(`http://127.0.0.1:3333/delete-relatorio/${relatorioId}`, {
                                method: 'DELETE',
                                headers: { 'Authorization': `Bearer ${token}` }
                            });
                            if (resposta.ok) {
                                await carregarRelatorios(pacienteId, token);
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

function abrirModalDetalhes(relatorio) {
    document.getElementById('modal-details-title').textContent = `Relatório de Visita - ${relatorio.dataVisita}`;
    document.getElementById('detail-data').textContent = relatorio.dataVisita;
    document.getElementById('detail-hora').textContent = relatorio.horaVisita;
    document.getElementById('detail-tipo').textContent = relatorio.tipoVisita;
    document.getElementById('detail-descricao').textContent = relatorio.descricaoVisita;
    document.getElementById('detail-observacoes').textContent = relatorio.observacoesVisita || 'Nenhuma';
    document.getElementById('detail-localizacao').textContent = relatorio.localizacaoDor || 'N/A';
    document.getElementById('detail-pressao').textContent = relatorio.pressaoArterial || 'N/A';
    document.getElementById('detail-temperatura').textContent = relatorio.temperatura || 'N/A';
    document.getElementById('detail-peso').textContent = relatorio.peso || 'N/A';
    document.getElementById('modal-detalhes-relatorio').style.display = 'block';
}

document.getElementById('modal-details-close')?.addEventListener('click', () => {
    document.getElementById('modal-detalhes-relatorio').style.display = 'none';
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('modal-detalhes-relatorio');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

document.getElementById('btn-excluir-paciente')?.addEventListener('click', async () => {
    if (confirm("Tem certeza que deseja excluir este paciente?")) {
        try {
            const resposta = await fetch(`http://127.0.0.1:3333/delete-paciente/${pacienteId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resposta.ok) {
                window.location.href = 'dashboard.html';
            } else {
                const erro = await resposta.json();
                alert(erro.message || 'Erro ao excluir paciente.');
            }
        } catch (erro) {
            console.error('Erro ao excluir paciente:', erro);
            alert('Erro ao excluir paciente.');
        }
    }
});

// ====== SEÇÃO DE MEDICAMENTOS (CRIAR, EDITAR, LISTAR, EXCLUIR) ======

// --- Controles do modal de NOVO medicamento ---
const btnNovoMedicamento = document.getElementById('btn-novo-medicamento');
const modalNovoMedicamento = document.getElementById('modal-novo-medicamento');
const modalMedClose = document.getElementById('modal-med-close');
const btnCancelarMed = document.getElementById('btn-cancelar-med');
const formNovoMedicamento = document.getElementById('form-novo-medicamento');
const btnAddHorario = document.getElementById('btn-add-horario');
const listaHorarios = document.getElementById('lista-horarios');
const listaMedicamentos = document.getElementById('lista-medicamentos');

btnNovoMedicamento?.addEventListener('click', () => modalNovoMedicamento.style.display = 'block');
modalMedClose?.addEventListener('click', () => modalNovoMedicamento.style.display = 'none');
btnCancelarMed?.addEventListener('click', () => modalNovoMedicamento.style.display = 'none');
window.addEventListener('click', (event) => {
    if (event.target === modalNovoMedicamento) modalNovoMedicamento.style.display = 'none';
});

btnAddHorario?.addEventListener('click', () => {
    const div = document.createElement('div');
    div.className = 'horario-item';
    div.innerHTML = `<input type="time" class="med-horario" required><button type="button" class="btn-remover-horario">Remover</button>`;
    listaHorarios.appendChild(div);
    div.querySelector('.btn-remover-horario').addEventListener('click', () => div.remove());
});

formNovoMedicamento?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('med-nome').value.trim();
    const descricao = document.getElementById('med-descricao').value.trim();
    const horarios = Array.from(document.querySelectorAll('.med-horario')).map(input => input.value).filter(Boolean);
    if (!nome || horarios.length === 0) {
        alert("Preencha o nome e pelo menos um horário.");
        return;
    }
    try {
        const resposta = await fetch(`http://127.0.0.1:3333/pacientes/${pacienteId}/medicamentos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ nome, descricao: descricao || undefined, horarios })
        });
        const resultado = await resposta.json();
        if (resposta.ok) {
            modalNovoMedicamento.style.display = 'none';
            formNovoMedicamento.reset();
            listaHorarios.innerHTML = `<div class="horario-item"><label>Horários</label> <br><input type="time" class="med-horario" required><button type="button" class="btn-remover-horario" style="display:none;">Remover</button></div>`;
            await carregarMedicamentos(pacienteId, token);
        } else {
            alert(resultado.message || 'Erro ao cadastrar medicamento');
        }
    } catch (erro) {
        console.error('Erro ao cadastrar medicamento:', erro);
        alert('Erro ao cadastrar medicamento. Veja o console.');
    }
});

// --- Função para CARREGAR a lista de medicamentos ---
async function carregarMedicamentos(pacienteId, token) {
    listaMedicamentos.innerHTML = '<p>Carregando medicamentos...</p>';
    try {
        const resp = await fetch(`http://127.0.0.1:3333/pacientes/${pacienteId}/medicamentos`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const meds = await resp.json();
        if (!resp.ok) {
            listaMedicamentos.innerHTML = '<p>Erro ao carregar medicamentos.</p>';
            return;
        }
        if (meds.length === 0) {
            listaMedicamentos.innerHTML = `<div class="empty-state"><div class="empty-state-icon">💊</div><div class="empty-state-text">Nenhum medicamento agendado</div><div class="empty-state-subtext">Clique em "Adicionar Medicamento" para cadastrar.</div></div>`;
            return;
        }
        listaMedicamentos.innerHTML = '';
        meds.forEach(m => {
            const div = document.createElement('div');
            div.className = 'med-card';
            const horariosFormatados = m.horarios.sort((a, b) => a.hora - b.hora || a.minuto - b.minuto).map(h => `${String(h.hora).padStart(2, '0')}:${String(h.minuto).padStart(2, '0')}`).join(', ');

            // ADIÇÃO: Botão de editar e container para ações
            div.innerHTML = `<div class="med-header"><strong>${m.nome}</strong><div class="med-actions"><button class="btn-edit-med" data-id="${m.id}">✏️</button><button class="btn-delete-med" data-id="${m.id}">🗑️</button></div></div><div class="med-desc">${m.descricao || ''}</div><div class="med-times"><strong>Horários:</strong> ${horariosFormatados}</div>`;
            listaMedicamentos.appendChild(div);
        });

        // ADIÇÃO: Event listener para o botão de editar
        document.querySelectorAll('.btn-edit-med').forEach(btn => {
            btn.addEventListener('click', () => {
                const medicamentoId = btn.getAttribute('data-id');
                const medicamentoParaEditar = meds.find(m => m.id === medicamentoId);
                if (medicamentoParaEditar) {
                    abrirModalEditarMedicamento(medicamentoParaEditar);
                }
            });
        });

        document.querySelectorAll('.btn-delete-med').forEach(btn => {
            btn.addEventListener('click', async () => {
                const medicamentoId = btn.getAttribute('data-id');
                if (confirm('Tem certeza que deseja excluir este medicamento?')) {
                    try {
                        const delResp = await fetch(`http://127.0.0.1:3333/medicamentos/${medicamentoId}`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (delResp.ok) {
                            await carregarMedicamentos(pacienteId, token);
                        } else {
                            const err = await delResp.json();
                            alert(err.message || 'Erro ao excluir medicamento');
                        }
                    } catch (err) {
                        console.error('Erro ao excluir medicamento:', err);
                        alert('Erro ao excluir medicamento');
                    }
                }
            });
        });
    } catch (err) {
        console.error('Erro ao carregar medicamentos:', err);
        listaMedicamentos.innerHTML = '<p>Erro ao carregar medicamentos.</p>';
    }
}

// --- Controles do modal de EDITAR medicamento ---
const modalEditarMedicamento = document.getElementById('modal-editar-medicamento');
const formEditarMedicamento = document.getElementById('form-editar-medicamento');

document.getElementById('fechar-modal-editar-medicamento')?.addEventListener('click', () => modalEditarMedicamento.style.display = 'none');
document.getElementById('btn-cancelar-edicao-medicamento')?.addEventListener('click', () => modalEditarMedicamento.style.display = 'none');
document.getElementById('btn-add-horario-edit')?.addEventListener('click', () => {
    const listaHorariosEdit = document.getElementById('lista-horarios-edit');
    const div = document.createElement('div');
    div.className = 'horario-input';
    div.innerHTML = `<input type="number" class="hora-edit" min="0" max="23" placeholder="HH" required> : <input type="number" class="minuto-edit" min="0" max="59" placeholder="MM" required> <button type="button" class="btn-remover-horario-edit">🗑️</button>`;
    listaHorariosEdit.appendChild(div);
    div.querySelector('.btn-remover-horario-edit').addEventListener('click', () => div.remove());
});

// --- Função para ABRIR o modal de edição com os dados ---
function abrirModalEditarMedicamento(medicamento) {
    medicamentoEditandoId = medicamento.id;
    document.getElementById('edit-nome-medicamento').value = medicamento.nome;
    document.getElementById('edit-descricao-medicamento').value = medicamento.descricao || '';
    const listaHorariosEdit = document.getElementById('lista-horarios-edit');
    listaHorariosEdit.innerHTML = '';
    medicamento.horarios.forEach(h => {
        const div = document.createElement('div');
        div.className = 'horario-input';
        div.innerHTML = `<input type="number" class="hora-edit" min="0" max="23" value="${h.hora}" required> : <input type="number" class="minuto-edit" min="0" max="59" value="${h.minuto}" required> <button type="button" class="btn-remover-horario-edit">🗑️</button>`;
        listaHorariosEdit.appendChild(div);
        div.querySelector('.btn-remover-horario-edit').addEventListener('click', () => div.remove());
    });
    modalEditarMedicamento.style.display = 'block';
}

// --- Lógica para ENVIAR o formulário de edição ---
formEditarMedicamento?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('edit-nome-medicamento').value.trim();
    const descricao = document.getElementById('edit-descricao-medicamento').value.trim();
    const horarios = [];
    document.querySelectorAll('#lista-horarios-edit .horario-input').forEach(div => {
        const hora = div.querySelector('.hora-edit').value;
        const minuto = div.querySelector('.minuto-edit').value;
        if (hora && minuto) {
            horarios.push({ hora: parseInt(hora), minuto: parseInt(minuto) });
        }
    });
    if (!nome || horarios.length === 0) {
        alert("Preencha o nome e pelo menos um horário.");
        return;
    }
    try {
        const resposta = await fetch(`http://127.0.0.1:3333/edit-medicamento/${medicamentoEditandoId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ nome, descricao, horarios })
        });
        if (resposta.ok) {
            alert('Medicamento atualizado com sucesso!');
            modalEditarMedicamento.style.display = 'none';
            await carregarMedicamentos(pacienteId, token);
        } else {
            const resultado = await resposta.json();
            alert(resultado.message || 'Erro ao atualizar medicamento.');
        }
    } catch (erro) {
        console.error('Erro ao atualizar medicamento:', erro);
        alert('Erro de conexão ao atualizar medicamento.');
    }
});