module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat", // Nova funcionalidade
        "fix", // Correção de bug
        "docs", // Documentação
        "style", // Formatação, ponto e vírgula, etc
        "refactor", // Refatoração de código
        "perf", // Melhoria de performance
        "test", // Adição/correção de testes
        "build", // Mudanças no build
        "ci", // Mudanças em CI
        "chore", // Outras mudanças
        "revert", // Reverter commit
      ],
    ],
  },
};
