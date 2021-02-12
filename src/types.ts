export interface ASTRule {
  required: boolean
}

export interface AST {
  name?: string
  version?: string
  description?: string
  rules: ASTRule[]
}
