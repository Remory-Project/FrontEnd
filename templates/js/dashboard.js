document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert("você precisa estar logado");
      window.location.href = "login.html"
      return;
    }

    fetch('http://127.0.0.1:3333/lista',  {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Erro na resposta: ${response.status}`);
        }
        return response.json();
      })
      .then(pacientes => {
        console.log('Pacientes encontrados:', pacientes);
        exibirPacientes(pacientes);
      })
      .catch(error => {
        console.error('Erro ao buscar pacientes:', error);
      });
  });
  

  function exibirPacientes(pacientes) {
    const lista = document.getElementById('lista-pacientes');
  
    pacientes.forEach(p => {
      const item = document.createElement('li');
      const link = document.createElement('a')
      link.textContent = `${p.nome} - ${p.email}`;
      link.href = `detalhe_paciente.html?id=${p.id}`;
      item.appendChild(link);
      lista.appendChild(item);
    });
  }
  