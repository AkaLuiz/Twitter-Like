# Y

Uma rede social no estilo Twitter, construída como projeto de portfólio. Dá pra criar conta, postar, curtir, repostar, comentar, seguir outras pessoas e trocar foto de perfil — os fundamentos de uma rede social de posts curtos, dos dois lados (API + interface).

## Sobre o projeto

O objetivo aqui não foi reinventar o Twitter, e sim ter um projeto full-stack completo pra mostrar num portfólio: modelagem de dados relacional com relações muitos-para-muitos (seguidores, curtidas, reposts, comentários), autenticação de verdade (não só uma tela de login decorativa), upload de arquivo, e uma interface com identidade visual própria — não só componentes de biblioteca prontos.

Backend e frontend são dois projetos separados dentro do mesmo repositório (monorepo), orquestrados juntos via Docker Compose.

## Funcionalidades

- Cadastro e login com senha hasheada (bcrypt) e sessão via token JWT
- Postar, editar e remover postagens (limite de 280 caracteres, com contador visual)
- Curtir / descurtir
- Repostar / remover repost
- Comentar — cada post tem uma página própria (`/postagem/:id`) mostrando os comentários, que não aparecem soltos no feed principal
- Seguir / deixar de seguir, com contador de seguidores/seguindo atualizado em tempo real (sem precisar recarregar a página)
- Perfil de usuário com foto (upload de imagem de verdade, não link externo)
- Feed global e perfil individual, cada post mostrando se é original ou repost
- Notificações via toast (sucesso/erro) em vez de `alert()` do navegador
- Layout responsivo ao conteúdo (textos longos sem espaço quebram linha em vez de estourar a página)

## Tecnologias

**Backend**
- Java 17 + Spring Boot 3.4.3 (Web, Data JPA)
- MySQL 8
- JWT ([jjwt](https://github.com/jwtk/jjwt)) para autenticação
- BCrypt ([spring-security-crypto](https://docs.spring.io/spring-security/reference/features/authentication/password-storage.html)) para hash de senha — sem trazer o Spring Security inteiro
- Lombok
- Maven

**Frontend**
- React 18 + Create React App
- React Router v7
- react-toastify
- CSS puro (variáveis CSS pra tema escuro, sem framework de UI)

**Infraestrutura**
- Docker Compose (MySQL + backend + frontend, cada um em seu container)
- Nginx servindo o build de produção do frontend

## Decisões técnicas

Algumas escolhas que valem uma explicação, principalmente as que fogem do "óbvio":

**Autenticação sem o Spring Security completo.** Em vez de usar o starter `spring-boot-starter-security` (que já vem com HTTP Basic, formulário de login e uma cadeia de filtros própria), o projeto usa só a lib de criptografia (`spring-security-crypto`) mais um filtro HTTP próprio (`AutenticacaoFiltro`) que valida o token JWT manualmente. Isso evita a configuração extra que seria necessária pra "desligar" o comportamento padrão do Spring Security numa API que já tinha suas próprias regras de rota pública/privada.

**Toda ação mutável confia no token, nunca no corpo da requisição.** Endpoints como postar, curtir, seguir etc. não usam o id de usuário que o cliente manda — eles pegam o id de quem está autenticado a partir do token (`AutenticacaoUtil`) e ignoram qualquer id "de ator" que venha no JSON. Isso fecha a possibilidade de alguém curtir, postar ou seguir se passando por outro usuário só editando a requisição.

**MySQL com `ddl-auto=update`, sem ferramenta de migration.** Pra um projeto desse tamanho, deixar o Hibernate criar/alterar as tabelas a partir das entidades foi a troca consciente por simplicidade. Um passo natural de evolução seria trocar por Flyway ou Liquibase pra ter histórico de schema versionado.

**Frontend sem Redux/Context — tudo centralizado no `App.js`, com "recarrega depois de mutar".** Em vez de manter várias cópias de estado local espalhadas e ficar remendando arrays na mão a cada curtida/post/comentário, cada ação que muda dado no backend simplesmente busca a lista atualizada de novo (`buscarPostagens()`, `buscarCurtidas()`, etc.) e deixa o React re-renderizar a partir do estado fresco. É menos "otimista" que atualizar o estado local direto, mas eliminou uma classe inteira de bugs de sincronização que existiam na versão anterior do código (contadores errados, item errado sendo removido da lista).

**Upload de foto vai pro disco, não pro banco.** A imagem enviada é salva num diretório (`app.upload.dir`), com nome gerado por UUID, e servida como arquivo estático via `/uploads/**`. O banco só guarda o nome do arquivo. Em produção de verdade isso provavelmente viraria um bucket S3 (ou equivalente), mas pra um ambiente Docker local um volume nomeado (`uploads_data`) já resolve a persistência entre reinicializações do container.

**A URL da API é resolvida em tempo de execução, no navegador.** Em vez de hardcodar `localhost`, o frontend monta a URL da API a partir de `window.location.hostname`. Assim o mesmo build funciona tanto pra quem abre em `localhost` quanto pra quem acessa pelo IP da máquina na mesma rede — sem precisar rebuildar nem configurar nada por ambiente.

**CORS aberto (`origins = "*"`).** Deliberado — é uma demo de portfólio, não um serviço com dados sensíveis de terceiros.

## Estrutura

```
twitterDois/
├── backend/                # API Spring Boot
│   └── src/main/java/com/alterbyte/demo/
│       ├── controle/        # controllers REST
│       ├── serviço/         # regras de negócio
│       ├── repositorio/     # interfaces Spring Data JPA
│       ├── modelo/          # entidades JPA
│       └── config/          # filtro de autenticação, upload, etc.
├── frontend/                # SPA React
│   └── src/
│       ├── pages/            # uma pasta por rota (login, inicio, perfil, postagem...)
│       ├── components/       # peças reutilizáveis (avatar, logo, lista de posts)
│       └── utils/             # auth (localStorage), API_URL, helpers de repost
└── docker-compose.yml        # sobe banco + backend + frontend juntos
```

## Como rodar

Pré-requisito: Docker e Docker Compose instalados.

```bash
cp .env.example .env   # opcional — ajuste a senha do banco e a chave JWT se quiser
docker compose up --build
```

- Frontend: http://localhost:3000
- API: http://localhost:8090

O primeiro `up` cria o banco `spring_react` automaticamente; o schema é criado pelo próprio Hibernate na primeira subida do backend.

### Rodando sem Docker (desenvolvimento)

**Backend** — precisa de um MySQL local rodando e Java 17:
```bash
cd backend
./mvnw spring-boot:run
```

**Frontend**:
```bash
cd frontend
npm install
npm start
```

## Limitações conhecidas

Coisas que ficaram de fora de propósito, por escopo:

- Sem paginação no feed (busca a lista inteira de postagens de cada vez)
- Sem testes automatizados
- Sem migrations de banco (só `ddl-auto=update`)
- Atualizações do feed acontecem quando *você* interage (posta, curte, comenta) — não há WebSocket nem polling pra ver em tempo real o que outras pessoas estão fazendo
