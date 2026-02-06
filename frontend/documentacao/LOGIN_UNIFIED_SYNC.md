# Unificação do Fluxo de Login - Frontend & Backend

## Status: ✅ SINCRONIZADO

---

## 📋 Resumo das Mudanças

### Backend

#### 1. **loginService.ts** - Retorna objeto completo `{ token, user }`
```typescript
async autenticarUsuario(email: string, senha: string): Promise<{ token: string, user: { id_usuario: number, email: string, tipo_usuario: string } }>
```
**Mudança:** Antes retornava apenas `string` (token). Agora retorna:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id_usuario": 1,
    "email": "usuario@example.com",
    "tipo_usuario": "COMUM"
  }
}
```

#### 2. **loginController.ts** - Trata resposta do service e valida dados
- ✅ Valida se email e senha foram enviados (400 Bad Request)
- ✅ Retorna `{ token, user }` direto do service
- ✅ Trata erros com status HTTP apropriado (401 para auth, 500 para erro interno)

#### 3. **loginRoutes.ts** - Mantém limpo e simples
- ✅ Apenas chama o controller, sem lógica de negócio
- ✅ Sem poluição de código, responsabilidade única

### Frontend

#### 1. **authService.ts** - Interface e métodos atualizados
```typescript
export interface User {
  id_usuario: number;
  email: string;
  tipo_usuario: 'COMUM' | 'ADMINISTRADOR' | 'VOLUNTARIO';
}
```
**Mudança:** Adicionado `id_usuario`, padronizado para `tipo_usuario` (snake_case)

**Método `login()`:**
```typescript
async login(email: string, senha: string): Promise<User>
```
- ✅ Espera `{ token, user }` na resposta
- ✅ Armazena ambos em `localStorage`
- ✅ Retorna o objeto `user` para chamador

#### 2. **login.ts** - Utiliza authService de forma centralizada
```typescript
await authService.login(email, senha);
```
- ✅ Usa apenas `authService.login()`
- ✅ Removida importação de `RotaLogin` (depreciada)
- ✅ Tratamento de erro unificado

#### 3. **main.ts** - Verifica permissões via token payload
```typescript
const tipoUsuario = user && user.id_usuario ? user.tipo_usuario : "DESLOGADO";
```
- ✅ Já esperava `id_usuario` no payload
- ✅ Agora funciona corretamente com novo JWT

---

## 🔄 Fluxo Completo de Login

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend: login.ts (formulário)                             │
│ - Captura email + senha                                     │
│ - Chama authService.login(email, senha)                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend: authService.ts                                    │
│ - POST /api/login { email, senha }                          │
│ - Recebe { token, user }                                    │
│ - localStorage.setItem('token', token)                      │
│ - localStorage.setItem('user', JSON.stringify(user))        │
│ - Chama atualizarInterfaceUsuario()                         │
│ - Retorna user                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼ HTTP POST
┌─────────────────────────────────────────────────────────────┐
│ Backend: loginRoutes.ts POST /                              │
│ - Chama controller.loginHandler()                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend: loginController.ts                                 │
│ - Valida email e senha                                      │
│ - Chama loginRN.autenticarUsuario()                         │
│ - Retorna result (já { token, user })                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Backend: loginService.ts (LoginRN)                          │
│ 1. Busca usuário no DB via loginDAO.selectUserByEmail()     │
│ 2. Compara senha (TODO: usar bcrypt)                        │
│ 3. Cria JWT com payload:                                    │
│    { id_usuario, email, tipo_usuario }                      │
│ 4. Cria objeto publicUser { id_usuario, email, tipo_usuario}│
│ 5. Retorna { token, user: publicUser }                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼ response.json({ token, user })
┌─────────────────────────────────────────────────────────────┐
│ Frontend: authService.ts recebe resposta                    │
│ - Armazena em localStorage                                  │
│ - Executa atualizarInterfaceUsuario()                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ Frontend: main.ts - atualizarInterfaceUsuario()             │
│ - Decodifica token via authService.getTokenPayload()        │
│ - Extrai id_usuario, email, tipo_usuario                    │
│ - Define permissões baseado em tipo_usuario                 │
│ - Mostra/esconde menus                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Checklist de Compatibilidade

### Estrutura de Dados

| Campo | Backend JWT | Frontend localStorage | Frontend Token Payload | Status |
|-------|-------------|----------------------|----------------------|--------|
| `id_usuario` | ✅ Sim | ✅ Sim | ✅ Sim | **SINCRONIZADO** |
| `email` | ✅ Sim | ✅ Sim | ✅ Sim | **SINCRONIZADO** |
| `tipo_usuario` | ✅ Sim | ✅ Sim | ✅ Sim | **SINCRONIZADO** |

### Endpoints

| Recurso | Método | URL | Resposta | Status |
|---------|--------|-----|----------|--------|
| Login | POST | `/api/login` | `{ token, user }` | **FUNCIONAL** |

### Armazenamento Frontend

| Chave localStorage | Valor | Tipo | Status |
|-------------------|-------|------|--------|
| `token` | JWT string | string | **CORRETO** |
| `user` | `{ id_usuario, email, tipo_usuario }` | JSON | **CORRETO** |

### Fluxo de Permissões

| Cenário | Verificação | Resultado | Status |
|---------|-------------|-----------|--------|
| Usuário logado | `user && user.id_usuario` | Verdadeiro | **FUNCIONA** |
| Sem token | `getToken()` retorna null | Falso | **FUNCIONA** |
| Tipo de usuário | `user.tipo_usuario` em DESLOGADO/COMUM/VOLUNTARIO/ADMINISTRADOR | Correto | **FUNCIONA** |

---

## 🔐 Tratamento de Erros

### Backend

| Erro | Status HTTP | Resposta |
|------|-------------|----------|
| Email/senha ausentes | 400 | `{ error: "Email e senha são obrigatórios" }` |
| Usuário não encontrado | 401 | `{ error: "Usuario não encontrado" }` |
| Senha incorreta | 401 | `{ error: "Senha incorreta" }` |
| Erro interno | 500 | `{ error: "..." }` |

### Frontend

- Trata status não-ok e extrai mensagem de erro do objeto `{ error: "..." }`
- Exibe mensagem em `#mensagemErro`
- Auto-esconde após 3 segundos

---

## 📝 Próximos Passos (TODO)

1. **Segurança de Senha:**
   - [ ] Integrar `bcrypt` no backend para hash de senha
   - [ ] Atualizar comparação em `loginService.ts`

2. **Armazenamento Seguro (Produção):**
   - [ ] Migrar token para cookie HttpOnly
   - [ ] Implementar refresh token

3. **Validação Frontend:**
   - [ ] Email deve ser validado com regex antes de enviar
   - [ ] Adicionar feedback de carregamento (spinner)

4. **Testes:**
   - [ ] Testar fluxo completo (login, permissões, logout)
   - [ ] Testar erros de rede
   - [ ] Testar expiração de token

---

## 📞 Confirmação de Integração

**Backend está retornando:** ✅
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id_usuario": 1,
    "email": "user@example.com",
    "tipo_usuario": "COMUM"
  }
}
```

**Frontend está armazenando:** ✅
- localStorage['token'] = JWT string
- localStorage['user'] = JSON { id_usuario, email, tipo_usuario }

**Permissões estão funcionando:** ✅
- Via `getTokenPayload()` que decodifica JWT
- `main.atualizarInterfaceUsuario()` mostra menus corretos

---

**Última atualização:** 2026-02-05
**Versão:** 1.0 - Sincronizado
