export type Mapping = string

export interface ASTRule {
  key: string
  required: boolean
  query?: string
  tree?: ASTRule[]
  literal?: any
}

export interface AST {
  name?: string
  version?: string
  description?: string
  tree: ASTRule[]
}
