import { ASTRule } from '../types'

interface json { [index: string]: any }

export class Processor<I extends json, O extends json> {
  // TODO validate the tree for required fields in output O...?
  public constructor (private readonly root: ASTRule[]) {}

  private hasAllRequired (value: json, tree: ASTRule[]): boolean {
    return tree.every(({ key, required }) => {
      return !required || (required && value[key] !== undefined)
    })
  }

  private apply (input: json, {
    key,
    tree,
    literal,
    required
    // query,
  }: ASTRule, strict: boolean): json {
    let value

    if (literal !== undefined) {
      value = literal
    } else if (tree !== undefined) {
      value = this.traverse(input, tree, false)
      if (!this.hasAllRequired(value, tree)) { // TODO extract these to handlers or something
        if (required) {
          throw new Error(`expected "${key}" to map to an object with all required properties`)
        } else {
          return {}
        }
      }
    } else {
      value = input[key]
    }

    if (strict && required && value === undefined) {
      throw new Error(`expected "${key}" to resolve to a value`)
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
