# Json Mapper

Maps one json structure to another, according to a declared specification

- the first line of a mapping is the details **name / version / description**
- optional properties indicated with a **?** preceeding the rule
- queries are in [jsonpath](https://www.npmjs.com/package/jsonpath) syntax

```typescript
jsonmapper(mapping, input): output
```

## Example Mapping

```text
name / version / description
{
  key
  key/query
  key!
  key!/query
  key {
    key/query
    key!
    key!
  }
  ...etc
}
```

Maybe need a way to say a rule applies to global not the scoped thing, for when scoped thing is result of weird query ( eg, you would only be able to further query on vector result ) - might need to dfs to mirror nested array strucure - but only if leaves are objects.

- if query result is a scalar and has mapping, ERROR - strict mode? options?
- if query result is a scalar and NO mapping, assign
- if query result is an object and has mapping, scoped apply
- if query result is an object and NO mapping, assign
- if query result is an array and has mapping, and map leaf is object scoped apply
- if query result is an array and has mapping, and map leaf is scalar ERROR - strict mode? options?
- if query result is an array and NO mapping, assign
