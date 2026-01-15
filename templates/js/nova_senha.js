document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('nova-senha-form');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const senha = document.getElementById('senha').value.trim();
        const confirmar = document.getElementById('confirmar').value.trim();
        const email = localStorage.getItem('recuperar_email');
        const code = localStorage.getItem('codigo_verificacao');

        if (!senha || !confirmar) {
            alert('Preencha todos os campos.');
            return;
        }

        if (senha !== confirmar) {
            alert('As senhas não coincidem.');
            return;
        }

        if (!email || !code) {
            alert('Informações ausentes. Refaça o processo de recuperação.');
            window.location.href = 'esqueci_senha.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:3333/auth/forgot-password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, code, newPassword: senha, confirmPassword: confirmar}),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem('recuperar_email');
                localStorage.removeItem('codigo_verificacao');
                window.location.href = 'login.html';
            } else {
                alert(data.message || 'Erro ao redefinir senha.');
            }
        } catch (error) {
            console.error('Erro ao redefinir senha:', error);
            alert('Erro ao conectar ao servidor.');
        }
    });
});
