![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
# Descrição
Projeto fullstack de um blog com **autorização** e **autenticação** de usuário. Usando um perfil de ADM, é possível
criar postagens para todos os usuários cadastrados.

# Tecnologias
- Java, Javascript
- HTML, CSS
- Spring boot, Spring security
- Docker
- PostgreSQL

# Como executar
O Front-end está configurado para consumir a API que está deployada. Caso desejar usar localmente, terá que alterar nos 
arquivos JS para "localhost:8080".

Caso você use a API que já está configurada, pode ser que demore um pouco na primeira requisição pois o deploy é a opção
grátis do Render.com.

### Rodando a aplicação inteira localmente com Docker
- Clone o repositório na sua máquina
- Na pasta backend/src/main/resources, clique no arquivo "application.properties"
- Retire os comentários das configurações do banco de dados local e comente as configurações do banco de dados do Render
- Abra o terminal, entre na pasta raiz do projeto onde está o arquivo docker-compose.yml
- Digite o comando "docker-compose up"
- Na pasta frontend/pages abra o arquivo index.html
- Faça o login com o nome de usuário "adm" e senha "123456"

### Rodando localmente apenas o Front-end e API no Render.com
- Clone o repositório na sua máquina
- Na pasta frontend/pages abra o arquivo index.html
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
