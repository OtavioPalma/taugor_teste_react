# Como configurar este projeto

- Cadastrar um projeto novo no Firebase Console [https://console.firebase.google.com/](https://console.firebase.google.com/)
- Habilitar o projeto para Web
- Ativar funcionalidades de `Authentication` e `Cloud Firestore`
- Criar um arquivo `.env` utilizando `.env.example` como modelo
- Preencher os dados fornecidos pelo painel do Firebase dentro do arquivo `.env` recém-criado

# Como rodar este projeto

- `yarn` para instalar as dependências
- `yarn start` para iniciar o servidor em [http://localhost:3000](http://localhost:3000)

# Como usar este projeto

### Acesso

- Na página inicial clique em `Não possui uma conta? Cadastre-se` para criar sua conta
- Cadastre-se com um `e-mail` e uma `senha` válidos e será redirecionado para a página principal

### Página Inicial

- Na página inicial clique em `Adicionar +` para criar atividades
- Clique no ícone :pencil2: para editar o `Usuário Responsável` pela atividade
- Clique no ícone :heavy_check_mark: para editar o `Status` da atividade
- Clique no ícone :wastebasket: para excluir a atividade
- Clique no `Título` da atividade para ser redirecionado para os detalhes da mesma

### Página da Atividade

- Dados da Atividade
- Campo `Registro de Eventos` representa todas as modificações feitas na atividade desde sua criação
