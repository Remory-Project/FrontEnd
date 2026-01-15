document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('esqueci-senha-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();

        if (!email) {
            alert('Por favor, digite seu e-mail.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('recuperar_email', email);
                window.location.href = 'codigo_verificacao.html';
            } else {
                alert(data.message || 'Erro ao enviar código de verificação.');
            }
        } catch (error) {
            console.error('Erro ao enviar solicitação:', error);
            alert('Erro ao conectar ao servidor.');
        }
    });
});
