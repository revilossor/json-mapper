export type Mapping = string

export interface ASTRule {
  key: string
  required?: boolean
  query?: string
  // TODO tree
}

export interface AST {
  name?: string
  version?: string
  description?: string
  tree: ASTRule[]
}
