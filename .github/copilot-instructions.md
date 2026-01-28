# Instruções do GitHub Copilot

## Regras de Tipagem TypeScript

- **NUNCA** use o tipo `any` em nenhuma circunstância
- Sempre use tipos explícitos e específicos
- Prefira `unknown` ao invés de `any` quando o tipo for realmente desconhecido
- Use tipos genéricos quando apropriado
- Use tipos utilitários do TypeScript (Partial, Pick, Omit, etc.) quando necessário
- Se o tipo não for conhecido, use `unknown` e faça type guards/narrowing adequado

## Exemplos

### ❌ Evitar

```typescript
function handleData(data: any) {}
const response: any = await fetch();
```

### ✅ Preferir

```typescript
function handleData(data: unknown) {
  if (typeof data === "string") {
    // type narrowing
  }
}

interface ApiResponse {
  data: string;
  status: number;
}
const response: ApiResponse = await fetch();
```

## Regras para Formulários

- **SEMPRE** use `react-hook-form` com `zod` para controle de formulários
- **NUNCA** use outras bibliotecas de formulários sem justificativa
- Todos os schemas de validação devem ser criados na pasta `app/schemas/`
- **SEMPRE** use `SchemaMessageTypes` do arquivo `app/utils/schema-message` para mensagens de erro
- Mantenha a consistência nas mensagens de validação usando o enum centralizado

### Exemplo de Schema

```typescript
import { z } from "zod";
import { SchemaMessageTypes } from "../utils/schema-message";

export const exampleSchema = z.object({
  email: z
    .string({ message: SchemaMessageTypes.INVALID_TYPE })
    .email({ message: SchemaMessageTypes.INVALID_EMAIL })
    .trim()
    .refine((value) => value !== "", {
      message: SchemaMessageTypes.REQUIRED_FIELD,
    }),
});

export type ExampleFormDataType = z.infer<typeof exampleSchema>;
```

## Regras para Commits

- **SEMPRE** siga o padrão [Conventional Commits](https://www.conventionalcommits.org/)
- **NUNCA** faça commits sem um tipo válido
- Use mensagens de commit em inglês, claras e descritivas
- O projeto usa Husky e Commitlint para validação automática

### Formato de Commit

```
<type>: <description>

[optional body]

[optional footer]
```

### Tipos Permitidos

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code formatting, semicolons, etc
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding/fixing tests
- `build` - Build system changes
- `ci` - CI configuration changes
- `chore` - Other changes
- `revert` - Revert a commit

### Exemplos de Commits

```bash
feat: add login component
fix: correct form validation
docs: update README with commit instructions
refactor: improve date formatting utility
style: format code with prettier
```
