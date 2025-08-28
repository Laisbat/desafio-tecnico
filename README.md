# 🚀 Desafio Técnico - Gerenciamento de Usuários

> Sistema de gerenciamento de usuários desenvolvido em Angular com Material Design, focado em boas práticas de desenvolvimento e arquitetura escalável.

## 🌐 Demo Online

**🔗 Acesse a aplicação:** [https://desafio-tecnico-coral.vercel.app/usuarios](https://desafio-tecnico-coral.vercel.app/usuarios)

## 📋 Sobre o Projeto

Este projeto é uma aplicação web desenvolvida em **Angular 19** que implementa um sistema completo de gerenciamento de usuários com as seguintes funcionalidades:

- ✅ **Listagem de usuários** com paginação e filtros
- ✅ **Cadastro de novos usuários** com validação robusta
- ✅ **Edição de usuários existentes**
- ✅ **Exclusão de usuários** com confirmação
- ✅ **Interface responsiva** com Angular Material
- ✅ **Testes unitários** com cobertura completa
- ✅ **Integração com API externa** (JSONPlaceholder)

### 🏗️ Arquitetura e Tecnologias

- **Framework:** Angular 19.2+
- **UI Library:** Angular Material 19+
- **Styling:** SCSS com design responsivo
- **Testes:** Jasmine + Karma
- **HTTP Client:** Angular HttpClient
- **Roteamento:** Angular Router
- **Formulários:** Reactive Forms com validações customizadas

## 🛠️ Como Rodar Localmente

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18 ou superior)
- **npm** (versão 9 ou superior)
- **Angular CLI** (versão 19 ou superior)

```bash
# Verificar versões instaladas
node --version
npm --version
ng version
```

### Instalação e Execução

1. **Clone o repositório:**

```bash
git clone https://github.com/Laisbat/desafio-tecnico.git
cd desafio-tecnico
```

2. **Instale as dependências:**

```bash
npm install
```

3. **Execute a aplicação:**

```bash
npm start
# ou
ng serve
```

4. **Acesse a aplicação:**

Abra seu navegador e acesse: `http://localhost:4200`

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start                    # Inicia o servidor de desenvolvimento
npm run watch               # Build com watch mode

# Build
npm run build               # Build de produção
ng build --configuration development  # Build de desenvolvimento

# Qualidade de código
npm run lint                # Executa o linter
```

## 🧪 Como Rodar os Testes

### Executar Testes

```bash
# Testes com watch mode (desenvolvimento)
npm test

# Testes com cobertura
npm run test

# Testes para CI/CD (sem watch)
npm run test:ci
```

### Cobertura de Testes

Os testes cobrem:
- ✅ **Componentes** - Lógica de negócio e interações
- ✅ **Serviços** - Chamadas HTTP e tratamento de dados
- ✅ **Diretivas** - Comportamentos customizados
- ✅ **Validators** - Validações de formulário
- ✅ **Interceptors** - Tratamento de requisições HTTP

Após executar os testes, um relatório de cobertura é gerado em `coverage/desafio-tecnico/index.html`.

<img width="832" height="164" alt="image" src="https://github.com/user-attachments/assets/6ab5eb13-3f38-4115-ae0a-cf28c0bd5f38" />

### SEO

## 🕵🏼‍♂️ Lighthouse
<img width="1043" height="751" alt="image" src="https://github.com/user-attachments/assets/3b1ed618-f52a-42c5-93c2-3fc7b27275c7" />


## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── layout/                 # Componentes de layout
│   │   └── base/               # Layout base da aplicação
│   ├── pages/                  # Páginas da aplicação
│   │   ├── usuarios/           # Listagem de usuários
│   │   └── usuarios-adicionar/ # Cadastro/edição de usuários
│   ├── shared/                 # Módulos compartilhados
│   │   ├── components/         # Componentes reutilizáveis
│   │   ├── directives/         # Diretivas customizadas
│   │   └── interfaces/         # Interfaces TypeScript
│   └── utils/                  # Utilitários e serviços
│       ├── services/           # Serviços da aplicação
│       ├── interceptors/       # Interceptors HTTP
│       └── __mocks/            # Mocks para testes
├── assets/                     # Recursos estáticos
├── styles.scss                 # Estilos globais
└── theme.scss                  # Tema personalizado
```

## 🎯 Boas Práticas Implementadas

### 📝 Nomenclatura e Organização

- **Nomes descritivos:** Componentes, serviços e métodos com nomes claros e objetivos
- **Convenção Angular:** Seguindo o style guide oficial do Angular
- **Organização por feature:** Estrutura modular por funcionalidade
- **Barrel exports:** Uso de index.ts para exports organizados

### 🔧 Arquitetura

- **Separação de responsabilidades:** Componentes focados na apresentação, serviços na lógica de negócio
- **Lazy Loading:** Carregamento sob demanda dos módulos
- **Reactive Forms:** Formulários reativos com validações robustas
- **Observables:** Uso consistente de RxJS para programação reativa

### 🎨 UI/UX e Responsividade

- **Material Design:** Interface consistente e moderna
- **Mobile First:** Design responsivo priorizando dispositivos móveis
- **Acessibilidade:** Componentes acessíveis com ARIA labels
- **Loading States:** Feedback visual durante operações assíncronas

### 🧪 Testes e Qualidade

- **Cobertura alta:** Mais de 90% de cobertura de código
- **Testes isolados:** Mocks apropriados para dependências
- **Cenários reais:** Testes que simulam interações do usuário
- **CI/CD Ready:** Configuração para integração contínua

### 🔄 Gerenciamento de Estado

- **Services como Store:** Serviços centralizados para estado da aplicação
- **Subjects/BehaviorSubjects:** Para comunicação entre componentes
- **OnPush Strategy:** Otimização de performance quando aplicável

### 🌐 HTTP e APIs

```typescript
// Interceptors para tratamento global
@Injectable()
export class HttpInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Tratamento global de requisições
  }
}

// Serviços tipados
@Injectable()
export class UsuariosService {
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/users`);
  }
}
```

## 🚀 Deploy e CI/CD

O projeto está configurado com:

- **GitHub Actions:** Pipeline automatizado de testes
- **Vercel:** Deploy automático de previews
- **Linting:** Verificação de qualidade de código
- **Build otimizado:** Configurações para produção

---

**Desenvolvido com ❤️ e boas práticas de desenvolvimento.**
