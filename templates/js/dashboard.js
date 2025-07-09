document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:3333/lista')
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
      item.textContent = `${p.nome} - ${p.email}`; 
      lista.appendChild(item);
    });
  }
  