import { ASTRule, json, Scope } from '../types'
import jp from 'jsonpath'

export class Processor<I extends json, O extends json> {
  private input: json = {}
  private global: json = {}

  public constructor (private readonly root: ASTRule[]) {}

  private apply (input: json, rule: ASTRule, path: string[], strict: boolean): json {
    let value: any

    if (rule.literal !== undefined) {
      value = rule.literal
    } else if (rule.query !== undefined) {
      const scope = this.getScope(input, rule?.scope ?? 'root')
      value = rule.delist === true
        ? jp.value(scope, rule.query)
        : jp.query(scope, rule.query)
    } else if (rule.scope !== undefined) {
      value = this.getScope(input, rule.scope)
    } else {
      value = input?.[rule.key] ??
        this.input?.[rule.key] ??
        this.global?.[rule.key] ??
        undefined
    }

    if (rule.tree !== undefined) {
      if (Array.isArray(value)) {
        value = value.map(item => {
          return this.traverse(
            rule?.tree ?? [],
            [...path, rule.key],
            strict && rule.required,
            item
          )
        })
      } else {
        value = this.traverse(
          rule?.tree ?? [],
          [...path, rule.key],
          strict && rule.required,
          value
        )
      }
    }

    return {
      ...(value === undefined ? {} : { [rule.key]: value })
    }
  }

  private traverse (tree: ASTRule[], path: string[], strict: boolean, input?: any): json | undefined {
    const values: json = tree.reduce((output, rule) => ({
      ...output,
      ...this.apply(input, rule, path, strict)
    }), {})

    if (strict) {
      Processor.validateRequiredResolved(tree, values, path)
    } else if (Processor.hasMissingRequired(tree, values)) {
      return undefined
    }

    return values
  }

  public process (input: I, global: json = {}): O {
    this.input = input
    this.global = global
    return this.traverse(this.root, ['$'], true, input) as O
  }

  private getScope (local: json, scope: Scope): json {
    switch (scope) {
      case 'global':
        return this.global
      case 'root':
        return this.input
      case 'this':
        return local
      default:
        return this.input
    }
  }

  private static validateRequiredResolved (tree: ASTRule[], values: json, path: string[]): true {
    const missing = tree.reduce((accumulated: string[], rule: ASTRule) => {
      return rule.required && values[rule.key] === undefined
        ? [...accumulated, rule.key]
        : accumulated
    }, [])
    if (missing.length > 0) {
      const basepath = path.join('.')
      const paths = missing.map(key => `${basepath}.${key}`)
      throw new Error(`expected "${paths.join(', ')}" to resolve a value`)
    }
    return true
  }

  private static hasMissingRequired (tree: ASTRule[], values: json): boolean {
    return tree.some(({ key, required }) => required && values[key] === undefined)
  }
}
