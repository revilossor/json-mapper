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
  ?key
  ?key/query
  key {
    key/query
    ?key
    ?key
  }
  ...etc
}
```

Maybe need a way to say a rule applies to global not the scoped thing, for when scoped thing is result of weird query ( eg, you would only be able to further query on string result )
