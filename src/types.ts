export type Mapping = string

export type Scope = 'global' | 'root' | 'this'

export interface json { [index: string]: any }

export interface ASTRule {
  key: string
  required: boolean
  tree?: ASTRule[]
  delist?: boolean
  query?: string
  scope?: Scope
  literal?: any
}

export interface AST {
  name?: string
  version?: string
  description?: string
  tree: ASTRule[]
}
