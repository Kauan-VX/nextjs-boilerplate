export const SchemaMessageTypes = {
  INVALID_TYPE: 'O tipo do campo é inválido.',
  REQUIRED_FIELD: 'Este campo é obrigatório.',
  INVALID_EMAIL: 'O email informado é inválido.',
  INVALID_INTEGER: 'O valor deve ser um número inteiro.',
  INVALID_POSITIVE_NUMBER: 'O número deve ser positivo.',
  INVALID_CPF_CNPJ_LENGTH:
    'CPF deve ter 11 dígitos ou CNPJ deve ter 14 dígitos.',
  INVALID_CPF_CNPJ: 'CPF ou CNPJ inválido.',
  MAX_CARACTERS: (max: number) =>
    `O campo deve ter no máximo ${max} caracteres.`,
};
