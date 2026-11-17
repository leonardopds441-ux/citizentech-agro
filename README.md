# CitizenTech Agro — Protótipo FIAP

Frontend acadêmico desenvolvido em **React + Vite** para a disciplina Front End & Mobile Development (Global Solution 2026.2). O protótipo demonstra como uma plataforma poderia receber leituras de sensores em hortas comunitárias e apoiar o cidadão com informações e orientações simples.

> **Escopo da demonstração:** todos os pontos, leituras, solicitações e recomendações são fictícios. Não existe integração com sensores, backend, serviços de IA ou operação em campo. Os dados digitados ficam apenas no armazenamento local do navegador.

## Problema e público

Hortas comunitárias e escolares podem ter dificuldade para acompanhar condições básicas de cultivo e encaminhar necessidades de manutenção. A proposta apresenta uma interface demonstrativa voltada a cidadãos, coletivos comunitários e equipes de apoio a hortas urbanas. O protótipo simula a entrada de umidade do solo, temperatura e pH, permitindo visualizar alertas didáticos e registrar solicitações.

## Relação com os ODS

- **ODS 2 — Fome zero e agricultura sustentável:** apoio informativo à agricultura urbana e comunitária.
- **ODS 6 — Água potável e saneamento:** demonstração de acompanhamento de umidade para conversar sobre uso responsável da água.
- **ODS 11 — Cidades e comunidades sustentáveis:** aproximação de cidadãos e iniciativas locais.
- **ODS 12 — Consumo e produção responsáveis:** incentivo a práticas de cultivo e recursos mais conscientes.

## Integrantes


| Nome completo | RM |
|---|---|
    Claudio Alves (RM: 568565)
    Gustavo Duarte (RM: 567066)
    Leonardo Pereira (RM: 567836)

## Requisitos demonstrados

- Interface construída com React e Vite.
- Navegação por rotas (`/dashboard`, `/sensores`, `/solicitacoes`, `/historico`) com controle local de acesso.
- Login local demonstrativo sem criação de conta real ou armazenamento de senha.
- Cadastro e consulta de leituras e solicitações, persistidos no `localStorage`.
- Processamento de regras locais simples para gerar mensagens de orientação demonstrativas.
- Layout responsivo, navegação por teclado, rótulos de formulário, mensagens de estado e respeito a `prefers-reduced-motion`.
- Avisos de escopo e privacidade nas telas, com orientação para não inserir dados pessoais reais.

## Executar localmente

Requer Node.js **22.12 ou superior**.

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Acesso à demonstração

Na tela inicial, informe qualquer nome de exibição. Não é necessário e-mail ou senha. A sessão é mantida em `sessionStorage`; leituras e solicitações ficam no `localStorage` deste navegador. O botão “Sair” encerra a sessão. Para apagar os registros de demonstração, limpe os dados do site no navegador.

## Proteção de dados e limitações

O código da aplicação não faz chamadas de rede nem carrega fontes de terceiros. O servidor Vite de desenvolvimento e o de pré-visualização estão limitados a `127.0.0.1`, com cabeçalhos básicos de proteção.

### Dependência transitiva do Vite

A cadeia original do Vite incluía `picomatch` 4.0.7, afetado pelo aviso GHSA-fc5q-39xc-vjpf. Como ainda não há versão corrigida publicada, o projeto inclui em `vendor/picomatch` uma cópia local baseada no código 4.0.7, com versão local 4.0.8-local.0 e uma proteção adicional: extglobs repetidos de ramo único que contenham curingas são tratados literalmente, evitando a expressão regular vulnerável descrita no aviso. O `package.json` fixa essa cópia por meio de `overrides`, então `npm install` não depende de buscar um pacote substituto na rede. Esse ajuste é local e deve ser revisto quando houver uma correção oficial do mantenedor. A auditoria completa com `npm audit` deve ser executada após a instalação.


O protótipo não coleta dados por rede, não envia conteúdo para serviços externos e não implementa autenticação de produção. O login local é apenas uma etapa visual de demonstração e não deve proteger dados reais. Como a persistência é no navegador, os dados podem ser vistos por quem usa o mesmo perfil do navegador. As regras de umidade, temperatura e pH são ilustrativas, não constituem diagnóstico agronômico ou recomendação profissional.

## Evidências para apresentação

1. Acessar com um nome de exibição e demonstrar as quatro rotas.
2. Gerar uma leitura fictícia e observar o painel e histórico atualizados.
3. Registrar uma solicitação, filtrar seu status e atualizar a página para demonstrar persistência local.
4. Mostrar os avisos de dados simulados, privacidade e conexão com os ODS.

### Dados da solicitação
O formulário registra assunto, categoria, local de referência e descrição.

### Status das solicitações
As solicitações podem aparecer como Recebida, Em análise ou Orientação disponível.

## Commits da equipe

Mantenham os commits reais de cada integrante no repositório da equipe para evidenciar a evolução do projeto. Este pacote contém os arquivos-fonte; não inventa histórico de commits nem link de repositório.
