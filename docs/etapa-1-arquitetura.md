# Sistema Web Juridico-Previdenciario

## 1. Visao geral

Sistema web para escritorio previdenciario focado em cadastro, organizacao documental, analise juridica e estatistica de casos administrativos e judiciais relacionados a:

- beneficio por incapacidade temporaria;
- aposentadoria por incapacidade permanente;
- BPC/LOAS;
- outros beneficios correlatos.

O produto sera um painel operacional e analitico capaz de:

- centralizar clientes, casos, documentos e pericias;
- separar dados processuais de estrategia interna;
- gerar filtros juridicos combinaveis;
- apresentar dashboards e visao analitica por perito, doenca e resultado;
- preparar a base de dados para OCR, extracao por IA, classificacao automatica e busca semantica.

## 2. Objetivos do MVP

O MVP deve entregar valor real ao escritorio sem depender de IA desde o primeiro dia.

### Objetivos essenciais

- cadastrar clientes, peritos e casos;
- armazenar documentos com categoria e metadados;
- manter historico processual em linha do tempo;
- registrar resultado administrativo e judicial;
- oferecer filtros avancados;
- exibir dashboard com metricas juridico-previdenciarias;
- garantir autenticacao, autorizacao e segregacao de dados internos;
- deixar arquitetura pronta para OCR e IA.

### Fora do MVP inicial

- leitura automatica completa de PDF/imagem;
- classificacao automatica de documentos em producao;
- busca semantica vetorial;
- relatorios preditivos;
- workflow de automacao com notificacoes complexas.

Esses pontos devem nascer previstos em contrato tecnico da aplicacao, mas podem entrar nas fases seguintes.

## 3. Perfis e permissoes

### Perfis iniciais

- `admin`: gerencia usuarios, configuracoes, taxonomias e acesso completo.
- `advogado`: gerencia clientes, casos, documentos, estrategia e dashboards.
- `assistente`: cadastra e organiza dados, sem acesso a campos estrategicos sensiveis, conforme politica.
- `leitura`: acesso somente a consulta, relatorios e dashboards.

### Regras de acesso

- anotações estrategicas e campos internos ficam separados logicamente e protegidos por permissao;
- documentos sensiveis ficam vinculados ao caso e ao cliente com controle por perfil;
- logs registram autenticacao, consulta de caso, download de documento e alteracoes criticas.

## 4. Arquitetura recomendada

## 4.1 Stack proposta

### Frontend

- `Next.js 15` com `React` e `TypeScript`
- `App Router`
- `Tailwind CSS`
- `shadcn/ui` para base de componentes
- `TanStack Query` para cache, mutacoes e sincronizacao
- `React Hook Form + Zod` para formularios e validacao
- `Recharts` para dashboards
- `AG Grid` ou `TanStack Table` para listagens com filtros e paginacao

### Backend

- `NestJS` com `TypeScript`
- `Prisma ORM`
- `PostgreSQL`
- `JWT` com `refresh token`
- `Multer` ou upload compativel com storage S3
- `BullMQ + Redis` para jobs futuros de OCR e IA
- `Swagger/OpenAPI` para documentacao da API

### Infraestrutura

- `PostgreSQL` como banco principal
- `Redis` para filas, cache seletivo e rate limiting futuro
- `S3` compativel para arquivos: AWS S3, Cloudflare R2 ou MinIO
- `Docker Compose` no ambiente local
- deploy em `Vercel` para frontend e `Railway`, `Render` ou VPS para API

## 4.2 Justificativa tecnica

- `Next.js` entrega excelente produtividade para painel administrativo, rotas protegidas, SSR quando necessario e boa evolucao de interface.
- `NestJS` oferece arquitetura robusta em modulos, ideal para dominio rico, regras de negocio, seguranca e crescimento da equipe.
- `PostgreSQL` e mais adequado para filtros complexos, agregacoes, JSONB, full text search e futura extensao vetorial.
- `Prisma` acelera modelagem, migracoes e manutencao do schema.
- `BullMQ` desacopla tarefas demoradas como OCR, parsing, embeddings e classificacao automatica.

## 4.3 Arquitetura em camadas

- `presentation`: frontend web e endpoints REST.
- `application`: casos de uso, servicos e regras de negocio.
- `domain`: entidades, enums, politicas e contratos.
- `infrastructure`: banco, storage, fila, autenticacao, OCR e IA.

## 4.4 Modulos do backend

- `auth`
- `users`
- `clients`
- `cases`
- `documents`
- `document-categories`
- `medical-findings` ou `document-extractions`
- `experts`
- `diseases`
- `cids`
- `procedural-events`
- `internal-notes`
- `results`
- `dashboard`
- `reports`
- `audit-logs`
- `storage`
- `ai-pipeline` futuro

## 5. Modelagem de dados

## 5.1 Principios

- normalizacao ate onde ela reduz redundancia sem prejudicar consulta;
- separacao entre cadastro mestre e fatos do caso;
- historico de eventos e extracoes como entidades proprias;
- suporte a documentos multiparte e metadados enriquecidos;
- campos preparados para IA sem acoplar o MVP a um fornecedor.

## 5.2 Entidades principais

### `users`

- `id`
- `name`
- `email`
- `password_hash`
- `role`
- `is_active`
- `last_login_at`
- `created_at`
- `updated_at`

### `clients`

- `id`
- `full_name`
- `cpf`
- `birth_date`
- `gender`
- `phone`
- `email`
- `city`
- `state`
- `notes`
- `created_by_user_id`
- `created_at`
- `updated_at`

### `cases`

- `id`
- `internal_code`
- `client_id`
- `case_number`
- `channel_type` administrativo ou judicial
- `benefit_type`
- `protocol_date`
- `der_date`
- `expert_exam_date`
- `decision_date`
- `main_disease_id`
- `main_cid_id`
- `profession`
- `education_level`
- `age_at_filing`
- `family_income`
- `family_group_description`
- `expert_id`
- `court_agency_name`
- `court_division`
- `city`
- `state`
- `urgent_relief_requested`
- `current_status`
- `strategy_summary`
- `created_by_user_id`
- `created_at`
- `updated_at`

### `case_secondary_diseases`

- `id`
- `case_id`
- `disease_id`

### `case_secondary_cids`

- `id`
- `case_id`
- `cid_id`

### `document_categories`

- `id`
- `name`
- `code`
- `description`
- `is_medical`
- `is_procedural`
- `created_at`

### `documents`

- `id`
- `client_id`
- `case_id`
- `category_id`
- `uploaded_by_user_id`
- `file_name`
- `original_file_name`
- `mime_type`
- `storage_key`
- `file_size`
- `document_date`
- `origin`
- `notes`
- `ocr_status`
- `ai_status`
- `created_at`
- `updated_at`

### `document_extractions`

- `id`
- `document_id`
- `source_type` manual, ai, ocr_plus_ai
- `disease_id`
- `cid_id`
- `medical_conclusion`
- `has_incapacity`
- `incapacity_scope` total, parcial, nao_informado
- `incapacity_duration` temporaria, permanente, nao_informado
- `disability_start_date`
- `functional_limitations`
- `analyzed_profession`
- `rehabilitation_possible`
- `decision_grounding`
- `final_conclusion`
- `confidence_score`
- `reviewed_by_user_id`
- `reviewed_at`
- `created_at`

### `diseases`

- `id`
- `name`
- `description`
- `normalized_name`

### `cids`

- `id`
- `code`
- `description`
- `chapter`

### `experts`

- `id`
- `full_name`
- `specialty`
- `registry_number`
- `city`
- `state`
- `internal_notes`
- `created_at`
- `updated_at`

### `case_results`

- `id`
- `case_id`
- `administrative_result`
- `judicial_result`
- `final_outcome`
- `outcome_reason`
- `decision_summary`
- `success_flag`
- `created_at`
- `updated_at`

### `procedural_events`

- `id`
- `case_id`
- `event_type`
- `event_date`
- `description`
- `related_document_id`
- `created_by_user_id`
- `created_at`

### `internal_notes`

- `id`
- `case_id`
- `strength_of_medical_evidence`
- `main_obstacle`
- `main_thesis`
- `secondary_thesis`
- `hearing_exam_notes`
- `estimated_risk`
- `reason_for_denial`
- `decision_central_ground`
- `private_note`
- `created_by_user_id`
- `updated_by_user_id`
- `created_at`
- `updated_at`

### `audit_logs`

- `id`
- `user_id`
- `action`
- `entity_type`
- `entity_id`
- `ip_address`
- `user_agent`
- `metadata_json`
- `created_at`

## 5.3 Relacionamentos

- um `client` possui muitos `cases`
- um `case` possui muitos `documents`
- um `case` possui muitos `procedural_events`
- um `case` possui uma ou muitas `internal_notes` conforme estrategia de versionamento
- um `case` possui um `case_results`
- um `document` pertence a uma `document_category`
- um `document` pode possuir muitas `document_extractions`
- um `expert` pode estar associado a muitos `cases`
- um `case` possui uma doenca principal e varias secundarias
- um `case` possui um CID principal e varios secundarios
- um `procedural_event` pode referenciar um `document`

## 5.4 Observacoes de modelagem

- `diseases` e `cids` devem ser tabelas mestre para padronizar filtros e analytics;
- `document_extractions` separado de `documents` evita poluir o registro de arquivo com dados interpretativos;
- `case_results` separado de `cases` ajuda a manter consistencia analitica e futura trilha historica de resultados;
- `internal_notes` isolado permite controle de acesso mais restrito;
- `audit_logs` e obrigatorio por tratar dados sensiveis de saude e estrategia juridica.

## 6. Consultas e analytics

## 6.1 Filtros combinaveis do MVP

- doenca principal e secundaria
- CID principal e secundarios
- perito
- especialidade do perito
- idade
- faixa etaria
- genero
- profissao
- beneficio
- resultado
- via
- cidade, comarca, vara ou agencia
- periodo por protocolo, pericia ou decisao
- incapacidade reconhecida ou nao
- tipo e duracao da incapacidade
- tutela de urgencia

## 6.2 Indicadores do dashboard

- total de casos
- total por beneficio
- total por doenca
- total por CID
- total por perito
- procedencia por doenca
- improcedencia por doenca
- deferimento administrativo por doenca
- indeferimento administrativo por doenca
- taxa de exito por faixa etaria
- taxa de exito por genero
- taxa de exito por perito
- comparativo administrativo x judicial
- doencas com maior sucesso
- doencas com maior improcedencia
- tempo medio entre protocolo, pericia e decisao

## 6.3 Visao analitica do perito

- total de casos vinculados
- total de pericias com incapacidade reconhecida
- total de pericias desfavoraveis
- doencas mais frequentes
- taxa de exito dos casos em que atuou
- distribuicao por beneficio
- observacoes internas do escritorio

## 7. Estrutura de telas

## 7.1 Navegacao principal

- dashboard
- clientes
- casos
- documentos
- peritos
- relatorios
- estatisticas
- administracao

## 7.2 Telas do MVP

### Login

- autenticacao
- recuperacao de senha posterior

### Dashboard inicial

- cards de indicadores
- graficos por beneficio, resultado e via
- lista de casos recentes
- atalhos de cadastro

### Clientes

- listagem com busca rapida
- filtros por nome, CPF, cidade e UF
- cadastro e edicao
- pagina de detalhes com casos vinculados

### Casos

- listagem com filtros avancados
- cadastro e edicao
- acao rapida para anexar documento, registrar evento e resultado

### Detalhe do caso

- aba `Resumo`
- aba `Documentos`
- aba `Historico`
- aba `Pericias`
- aba `Estrategia`
- aba `Resultado`
- aba `Estatisticas relacionadas`

### Documentos

- upload individual e multiplo
- categorizacao
- listagem por caso, cliente, categoria e data
- visualizacao de metadados
- area pronta para OCR e extracao

### Peritos

- cadastro
- listagem
- detalhe analitico por perito

### Relatorios

- exportacao Excel e PDF
- relatorio de casos filtrados
- relatorio por perito
- relatorio por doenca

### Estatisticas

- graficos detalhados
- comparativos
- tabelas agregadas

### Administracao

- usuarios
- papeis e permissoes
- categorias de documentos
- doencas
- CIDs

## 8. Fluxos principais

## 8.1 Fluxo de cadastro operacional

1. cadastrar cliente
2. abrir caso vinculado ao cliente
3. registrar dados da via e do beneficio
4. anexar documentos
5. registrar eventos processuais
6. preencher estrategia interna
7. registrar resultado
8. consultar dashboard e filtros

## 8.2 Fluxo documental

1. usuario faz upload
2. sistema grava arquivo no storage e metadados no banco
3. documento recebe categoria
4. usuario preenche extracao manual assistida
5. futuramente job de OCR e IA gera sugestao de extracao
6. advogado revisa e aprova a extracao

## 8.3 Fluxo futuro de IA

1. upload do documento
2. enfileiramento em `BullMQ`
3. OCR extrai texto bruto
4. servico de IA classifica categoria e campos relevantes
5. sistema grava `document_extractions`
6. usuario revisa sugestoes
7. dados aprovados alimentam estatisticas e busca semantica

## 9. Seguranca e LGPD

## 9.1 Medidas obrigatorias

- autenticacao por email e senha com hash `Argon2` ou `bcrypt`
- JWT com expiracao curta e refresh token
- RBAC por perfil e permissao
- protecao de rotas no frontend e backend
- criptografia de campos altamente sensiveis quando necessario
- documentos armazenados fora do banco, com URL assinada ou acesso mediado pela API
- logs de acesso e alteracao
- separacao entre dados cadastrais, documentos e estrategia interna
- backups e rotacao de credenciais
- mascaramento de CPF em telas listadas, quando cabivel

## 9.2 Boas praticas LGPD

- coleta minima necessaria
- finalidade explicita dos dados
- trilha de acesso
- controle por perfil
- possibilidade futura de anonimizar base para analytics externos
- politica de retencao documental configuravel

## 10. Preparacao para IA e OCR

## 10.1 Decisoes arquiteturais para viabilizar evolucao

- storage desacoplado
- extracao em tabela propria
- fila de processamento assicrona
- suporte a `JSONB` para metadados de modelos
- servico `ai-pipeline` isolado por interface
- base taxonomica padronizada de doencas e CIDs
- indices textuais e possibilidade futura de `pgvector`

## 10.2 Capacidades futuras previstas

- OCR de PDF e imagem
- classificacao automatica de tipo documental
- extracao de CID, conclusao pericial e incapacidade
- busca por linguagem natural
- comparacao de casos semelhantes
- recomendacao de estrategia baseada em historico

## 11. Plano de desenvolvimento

## Fase 1. Fundacao

- bootstrap do monorepo ou repos separados
- autenticacao, layout base e configuracao de banco
- tabelas mestre e seeds iniciais

## Fase 2. Cadastro nuclear

- CRUD de usuarios
- CRUD de clientes
- CRUD de peritos
- CRUD de casos

## Fase 3. Documentos e historico

- upload de arquivos
- categorias de documentos
- timeline processual
- notas internas
- resultado do caso

## Fase 4. Pesquisa e analytics

- filtros avancados
- dashboard geral
- visao por perito
- exportacao de relatorios

## Fase 5. Preparacao de IA

- OCR stub
- filas assicronas
- schema de extracao
- endpoints de revisao humana

## 12. Pontos criticos

- qualidade do cadastro mestre de doencas, CIDs e resultados impacta diretamente as estatisticas;
- documentos devem ser organizados desde o inicio para nao gerar base inutilizavel para IA;
- a separacao de estrategia interna e dado processual publico e indispensavel;
- filtros e dashboards devem usar campos estruturados, nao apenas texto livre;
- o sistema precisa nascer com governanca de permissao e log por lidar com saude e dados juridicos sensiveis.

## 13. Recomendacao final para o MVP

Recomenda-se iniciar com:

- `Next.js + NestJS + PostgreSQL + Prisma + Redis + S3`

Esse conjunto oferece equilibrio entre velocidade de entrega, estrutura empresarial, seguranca, escalabilidade e preparo para IA.

Na ETAPA 2, o ideal e construir:

- autenticacao e autorizacao;
- CRUDs principais;
- upload e organizacao documental;
- filtros combinaveis;
- dashboard inicial;
- base de extracao manual assistida.
