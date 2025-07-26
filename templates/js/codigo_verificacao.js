document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('verificar-codigo-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const codigo = document.getElementById('codigo').value.trim();
        const email = localStorage.getItem('recuperar_email');

        if (!email || !codigo) {
            alert('Preencha o código e certifique-se que o e-mail foi informado.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/auth/forgot-password/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code: codigo }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('codigo_verificacao', codigo);
                window.location.href = 'nova_senha.html';
            } else {
                alert(data.message || 'Código inválido ou expirado.');
            }
        } catch (error) {
            console.error('Erro ao verificar código:', error);
            alert('Erro ao conectar ao servidor.');
        }
    });
});
