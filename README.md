![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
# Descrição
Projeto fullstack de um blog com **autorização** e **autenticação** de usuário. Usando um perfil de ADM, é possível
criar postagens para que todos os usuários cadastrados e autenticados possam visualizá-las e criar comentários. Um usuário
ao se cadastrar, recebe uma mensagem no e-mail cadastrado.

A aplicação inteira está deployada em serviços grátis: **Render.com(Frontend, Backend, Banco de dados)** e **CloudAMQP (RabbitMQ)**

# Tecnologias / Ferramentas
- Java
- ReactJS
- Spring boot, Spring security, EmailSender
- RabbitMQ
- Docker
- PostgreSQL

# Como executar

Há 2 maneiras que você pode fazer para utilizar a aplicação:

**1ª** - Entrando na página com o sistema inteiro deployado
(https://blog-noticias.onrender.com/login)

**2ª** - Rodando a aplicação localmente com Docker.

Caso prefira da 1ª maneira, pode acontecer de demorar um pouco pois a API está hospedada usando serviços gratuitos
do Render.com e após 15 minutos de uso entra em inatividade e precisa iniciar novamente 

### Rodando a aplicação inteira localmente com Docker
- Clone o repositório na sua máquina
- Na pasta backend/src/main/resources, abra o arquivo "application.properties"
- Retire os comentários das configurações do banco de dados local (linha 9) e comente as configurações do banco de dados do Render (linha 4)
- Retire os comentários das configurações do RabbitMQ local (linha 40) e comente a linha de configuração do CloudAMQP (linha 38)
- Abra o terminal, entre na pasta raiz do projeto onde está o arquivo docker-compose.yml
- Digite o comando "docker-compose up"
- Ainda no terminal, navegue para a pasta "frontend" e use o comando "npm install" e logo depois "npm run dev" para iniciar o Vite
- Faça o login com o nome de usuário "adm" e senha "123456"

# Imagens do projeto

<div align="center">
  <h3 align="center">Página inicial</h3>
  <p>Nessa página é onde os usuários autenticados podem visualizar as postagens existentes no blog e caso desejem ler
        inteiramente, basta apertar no botão "Ler mais..." ("Gerenciar" no caso de um perfil de ADM) no rodapé de cada
        postagem.
  </p>
  <image src="https://github.com/GabeOP/blog-noticias/blob/main/imagens/paginicial.png?raw=true"/>
</div>

<div align="center">
  <h3 align="center">Página do Post</h3>
  <p>Essa página é um exemplo de quando apertamos em "Ler mais..." em uma postagem. Temos o título completo, autor, 
     imagem e descrição da postagem completa
  </p>
  <image src="https://github.com/GabeOP/blog-noticias/blob/main/imagens/post.png?raw=true"/>
</div>

<div align="center">
  <h3 align="center">Página do Post (Comentários)</h3>
  <p>Essa é a parte da postagem que mostra a lista de comentários feitos. O usuário que criou o comentário e alguém com
cargo de ADM possui a opção de excluí-lo.
  </p>
  <image src="https://github.com/GabeOP/blog-noticias/blob/main/imagens/comentarios.png?raw=true"/>
</div>

<div align="center">
  <h3 align="center"> Página para criar postagens</h3>
  <p>Apenas usuários com autorização podem acessar e criar postagens</p>
  <image  src="https://github.com/GabeOP/blog-noticias/blob/main/imagens/pagcriapost.png?raw=true"/>
</div>

<div align="center">
  <h3 align="center"> Página para criar postagens</h3>
  <p>Apenas usuários com autorização podem acessar, alterar o cargo ou excluir usuários cadastrados</p>
  <image  src="https://github.com/GabeOP/blog-noticias/blob/main/imagens/gerenciamentousuario.png?raw=true"/>
</div>

<div align="center">
  <h3 align="center"> Página para realizar o login (a página para o cadastro é idêntica) </h3>
  <image src="https://github.com/GabeOP/blog-noticias/blob/main/imagens/paglogin.png?raw=true"/>
</div>
