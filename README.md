# Tech Challenge Order

Tech Challenge é o projeto do MBA em Software Architecture que engloba os conhecimentos obtidos nas disciplinas.

Em resumo, um sistema de controle de pedidos é essencial para garantir que a lanchonete possa atender os clientes de maneira eficiente, gerenciando seus pedidos e estoques de forma adequada. Sem ele, expandir a lanchonete pode acabar não dando certo, resultando em clientes insatisfeitos e impactando os negócios de forma negativa.

**Pedido**: Os clientes são apresentados a uma interface de seleção na qual podem optar por se identificarem via CPF, se cadastrarem com nome, e-mail ou não se identificar, podendo montar o combo na seguinte sequência, sendo todas elas opcionais:

1. Lanche
2. Acompanhamento
3. Bebida

Em cada etapa é exibido o nome, descrição e preço de cada produto..


<a href="https://miro.com/app/board/uXjVKztqeIc=/?share_link_id=808693294741">
    <img src="https://img.shields.io/badge/Miro-05192D?style=for-the-badge&logo=miro&logoColor=FFD02F"/>
</a>

## Arquitetura

[Clique aqui para ver no draw.io](https://drive.google.com/file/d/125nhmEe8Vd6zaZj_OnBLJ8eRhIvvUyDZ/view?usp=sharing)↗️

![Diagrama de Arquitetura](./docs/diagrama-infra.drawio.png)
_Clique na imagem para ampliar._

## Estrutura de Pastas

Este documento descreve a estrutura de pastas da aplicação baseada na Clean Architecture. Essa organização visa garantir uma separação clara de responsabilidades entre as diferentes camadas do sistema, facilitando a manutenção e evolução da aplicação.

```
src/
├── domain/
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   └── repositories/
│
├── application/
│   ├── use-cases/
│   ├── dtos/
│   └── mappers/
│
├── infrastructure/
│   ├── orm/
│   ├── repositories/
│   └── config/
│
├── presentation/
│   └── controllers/
│
└── main.ts
```

## Descrição das Pastas e Arquivos

### `src/domain/`

- **`entities/`**: Contém as entidades do domínio, que representam os modelos principais do sistema.
- **`value-objects/`**: Contém os Objetos de Valor do domínio, que são objetos imutáveis utilizados em conjunto com as entidades.
- **`services/`**: Contém serviços que implementam as regras de negócio puras do domínio, sem depender de detalhes de infraestrutura.
- **`repositories/`**: Contém interfaces para repositórios, que são portas de saída para a persistência de dados.

### `src/application/`

- **`use-cases/`**: Contém casos de uso da aplicação, que definem as operações específicas que a aplicação pode realizar e coordenam as interações entre entidades e serviços.
- **`dtos/`**: Contém Data Transfer Objects, que são utilizados para transferir dados entre diferentes camadas da aplicação.
- **`mappers/`**: Contém mapeamentos entre entidades e DTOs para facilitar a conversão de dados entre o formato de persistência e o formato de apresentação.

### `src/presentation/`

- **`controllers/`**: Contém adaptadores de entrada, como controladores HTTP, que recebem as requisições dos clientes e invocam os casos de uso apropriados.

### `src/infrastructure/`

- **`typeorm/`**: Contém configurações e implementações específicas do ORM (TypeORM), como conexões com o banco de dados e definições de entidades.
- **`repositories/`**: Contém a implementação concreta dos repositórios definidos no domínio.
- **`services/`**: Contém serviços de infraestrutura que oferecem funcionalidades auxiliares para a aplicação, como serviços de cache ou de mensageria.
- **`config/`**: Contém configurações da aplicação, como variáveis de ambiente e configurações específicas do sistema.

### `src/shared/`

- **`shared/`**: Contém código e configurações compartilhadas que são usadas em várias partes da aplicação, como utilitários comuns e configurações globais.

### `src/main.ts`

- **`main.ts`**: Ponto de entrada da aplicação. Configura e inicializa o módulo principal do NestJS e inicia o servidor.

## Diagrama de Arquitetura Limpa

O diagrama abaixo ilustra a interação entre as diferentes camadas e componentes da arquitetura limpa do projeto. Esta arquitetura é projetada para promover uma separação clara entre as diferentes responsabilidades do sistema, facilitando a manutenção e evolução da aplicação.

```mermaid
graph TD
    subgraph Presentation
        A[Controllers]
    end

    subgraph Application
        A[Controllers] -->|Calls| B[Use Cases]
        B[Use Cases] -->|Maps to/from| D[DTOs]
        B -->|Interacts with| C[Application Services]
    end

    subgraph Domain
        C -->|Uses| E[Entities]
        C -->|Uses| F[Domain Services]
        E -->|Persisted by| G[Repositories Interface]
    end

    subgraph Infrastructure
        G -->|Implements| H[Infrastructure Repositories]
        H -->|Configured in| I[ORM Config]
        I -->|Uses| J[ORM Models]
        I -->|Provides| K[ORM Repositories]
        H -->|Seeded by| L[Seed Scripts]
        M[External APIs] -->|Uses| C
    end

    %%% Optional styling to make the diagram clearer
    classDef presentation fill:#f9f,stroke:#333,stroke-width:2px;
    classDef application fill:#f99,stroke:#333,stroke-width:2px;
    classDef domain fill:#ccf,stroke:#333,stroke-width:2px;
    classDef infra fill:#cfc,stroke:#333,stroke-width:2px;

    class Presentation presentation;
    class Application application;
    class Domain domain;
    class Infrastructure infra;

```

## Documentação do Banco de Dados

Este documento descreve a estrutura do banco de dados utilizado no projeto. Inclui a descrição de cada tabela, suas colunas e os relacionamentos entre elas.

### Diagrama do Banco de Dados

O diagrama abaixo ilustra a estrutura das tabelas e suas relações:

```mermaid
erDiagram
    order {
        int id
        float totalPrice
        int estimatedPreparationTime
        int preparationTime
        string paymentStatus
        string orderStatus
        datetime created_at
        datetime updated_at
        int userId
    }
    orderItem {
        int id
        int orderId
        int productId
        int quantity
        datetime created_at
    }
    order ||--o{ orderItem : contains
```

### Detalhes Adicionais

- **Chave Primária (PK)**: Identificador único de cada registro na tabela.
- **Chave Estrangeira (FK)**: Referência a registros em outras tabelas.
- **Soft Delete**: Colunas `deleted_at` usadas para implementar exclusão lógica.

## Como Executar o Projeto

1. **Clone o repositório** (se ainda não o fez):

```bash
git clone https://github.com/Grupo-26-FIAP/tech-challenge-order
cd tech-challenge-order
```

### Utilizando Docker

Para executar o projeto utilizando Docker, siga os passos abaixo:

1. **Certifique-se de que o Docker e o Docker Compose estão instalados**:

   - [Docker](https://www.docker.com/get-started)
   - [Docker Compose](https://docs.docker.com/compose/install/)

2. **Inicie os Contêineres com Docker Compose**:

Utilize o docker-compose.yml para iniciar a aplicação e os serviços dependentes (como o banco de dados):

```bash
docker compose up
```

Isso iniciará todos os serviços definidos no **docker-compose.yml**. Você verá os logs da aplicação no terminal.

### **Acessando o Swagger**

Após iniciar os contêineres, o Swagger estará acessível em [http://localhost:3000/docs](http://localhost:3000/docs) (ou a porta definida no docker-compose.yml).

> ⚠️ **Atenção**
>
> [Instruções de fluxo](https://github.com/Grupo-26-FIAP/.github/wiki/Fluxo-de-teste)

## Contato (Grupo)

Para dúvidas ou suporte, entre em contato com:

- **RM357358** Jhoni Farias (jhonifarias.developer@gmail.com)
- **RM357836** Josef Henrique Zambreti (josefhenrique@uol.com.br)
- **RM357360** Lucas Rodrigues Medina Costa (lucasmedinarmc@gmail.com)
- **RM358012** Kleber de Oliveira Andrade (pdjkleber@gmail.com)
- **RM357235** Vitória Camila Xavier Sobrinho (vcamilaxs@gmail.com)
