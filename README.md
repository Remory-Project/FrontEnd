# FrontEnd

🏁 REMORY

    Remory é uma plataforma web voltada para o auxilio dos cuidadores, de modo que os permitam cadastrar seus pacientes e seus medicamentos. O sistema contará com uma ferramenta de notificações, para recordar sobre medicamentos que estão próximos do horário de consumo

🧑‍💻 Membros da equipe e Orientador

    570569 - Lucas Lima - Analise e Desenvolvimento de Sistemas
    567951 - Pedro Renan - Analise e Desenvolvimento de Sistemas
    571166 - João Lucas - Analise e Desenvolvimento de Sistemas
    Orientador - Anderson Uchoa - Analise e Desenvolvimento de Sistemas

🧑‍🤝‍🧑 Papéis ou tipos de usuário da aplicação

    Nosso sistema se voltará para os cuidadores, onde ele terá um registro pessoal dentro da plataforma (login)


🗓️ Entidades ou tabelas do sistema

    Cuidador
    Paciente
    Relatorio
    Medicamento

🚩 Principais funcionalidades da aplicação

    Responsividade entre plataformas
    Cadastro no sistema
    login do cuidador
    Cadastro de pacientes (com o login de cuidador)
    Cadastrar medicamentos (login do cuidador)
    criação de relatórios de visitas
    envio de notificações para notificar sobre algum remédio que esteja próximo de ser consumido.

⚠️⚠️⚠️ As informações a seguir devem ser enviadas juntamente com a versão final do projeto. ⚠️⚠️⚠️
🖥️ Tecnologias e frameworks utilizados

Frontend

    HTML
    CSS

Backend

    Node.js
    Typescript
    Prisma
    Fastify
    Zod
    Resend

:shipit: Operações implementadas para cada entidade da aplicação
    Entidade 	Criação 	Leitura 	Atualização 	Remoção
    Cuidador 	   X 	        		     X
    Paciente 	   X           X 		     X   	       X
    Relatorio 	   X           X             X             X		

    Lembre-se que é necessário implementar o CRUD de pelo menos duas entidades.

:neckbeard: Rotas da API REST utilizadas
    POST   /criar/paciente
    GET    /lista
    PUT    /edit-paciente/:id
    DELETE /delete-paciente/:id
    POST   /login
    POST   /criar-cuidador
    DELETE /delete-cuidador/:id
    PUT    /edit-cuidador/:id
    POST   /criar-relatorio
    GET    /paciente/:id/relatorios
    POST   /auth/forgot-password
    POST   /auth/forgot-password/verify
    POST   /auth/forgot-password/reset
    POST   /pacientes/:pacienteId/medicamentos
    GET    /pacientes/:pacienteId/medicamentos
    DELETE /medicamentos/:id
    PUT    /edit-medicamento/:id

Documentação

    [Documentação do Projeto](documentação/Documento_visao_Remory.pdf)

    [Apresentação do Projeto] - Vídeo a ser criado
