import { ASTRule } from '../types'
import jp from 'jsonpath'

interface json { [index: string]: any }

export class Processor<I extends json, O extends json> {
  // TODO validate the tree for required fields in output O...?
  public constructor (private readonly root: ASTRule[]) {}

  private hasAllRequired (value: json, tree?: ASTRule[]): boolean {
    return tree === undefined
      ? value !== undefined
      : tree.every(({ key, required }) => {
        return !required || (required && value[key] !== undefined)
      })
  }

  private apply (input: json, {
    key,
    tree,
    literal,
    required,
    query
  }: ASTRule, strict: boolean): json {
    let value

    if (literal !== undefined) {
      value = literal
    } else if (query !== undefined) {
      value = jp.value(input, query)
    } else if (tree !== undefined) {
      value = this.traverse(input, tree, false)
    } else {
      value = input[key]
    }

    if (!this.hasAllRequired(value, tree)) {
      if (strict && required) {
        throw new Error(`expected "${key}" to resolve all required values`)
      } else {
        return {}
      }
    }

    // TODO this func needs a refactor - move out to handlers?
    if (tree !== undefined && literal === undefined && Object.keys(value).length === 0) {
      return {}
    }

    return {
      [key]: value
    }
  }

  private traverse (input: json, tree: ASTRule[], strict = true): json {
    return tree.reduce((output, rule) => ({
      ...output,
      ...this.apply(input, rule, strict)
    }), {})
  }

  public process (input: I): O {
    return this.traverse(input, this.root) as unknown as O
  }
}
