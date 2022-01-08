# Syntax

There are [some examples](./test/integration/fixtures) in the tests.

## Mapping

A __mapping__ is a set of rules, enclosed by braces

```text
{
  <rule>
  <rule>
  <rule>
}
```

The output object will mirror the structure of the mapping; there will be a key value pair in the output for each rule that can be satisfied.

## Rule

A __rule__ describes what a value will be called in the output object, and where to get its value from.

Rules can just be a key, or can have a literal or a query associated with them ( delimeted with a __/__ ).

```text
{
  key
  key / "literal"
  key / $.some.jsonpath.query  
}
```

### Key Only Rules

Key only rules will copy the value with the same key from the rule scope.

If no matching key is found in the rule scope, the root of the input object is checked.

If no matching key is found in the input object, the root of the global object is checked.

Scope cannot be selected in key only rules, unlike in query rules

### Literal Rules

A __literal__ describes a value for a key in the output object that is constant. It should be wrapped in double quotes.

The value is not determined or influenced by the input object, or any global values.

If the value parses to a float, it will appear as a float in the output object.

### Query Rules

A __query__ is a selector for a value in the rule scope, or the input or global objects.

They use [jsonpath](https://www.npmjs.com/package/jsonpath) syntax, with some additional operators for handling scope and delisting query results.

```text
{
  input / $
  topLevelProperty / $.property
  nestedProperty / $.property.nested
}
```

If a __scope operator ( . )__ is present before the query, then the query will be performed on the indicated scope.

No scope operator implies that the query should be performed on the root of the input object

```text
{
  queryInput / $.some.query
}
```

One scope operator implies that the query should be performed on the rule scope, or this

```text
{
  queryThis / .$.some.query
}
```

Two or more scope operators imply that the query should be performed on the global scope, which is passed to the mapper on initialisation and remains constant across all mappings with that instance.

```text
{
  queryGlobal / ..$.some.query
}
```

If a __delist operator ( ^ )__ is present at the start of the query, then the first query result will be returned

If it is not, then a list of all query results is returned ( this could be an empty list )

```text
{
  firstResult / ^$.some.query
  allResults / $.some.query
}
```

Scope and delist operators can be combined, but the delist should come first.

### Scope Rules

Scope operators can be used alone in a rule.

```text
{
  input / ^$
  this / .
  global / ..
  thisViaQuery / ^.$
}
```

Often a this scope will resolve the same thing as a this query, but since jsonpath only operates on json the scope operator will better handle other datatypes that may be the value of this ( eg. if the rule scope is the string result of a query )

## Rules With Mappings

Rules can also have mappings and nested rules can have their own mappings, to describe complex structures

```text
key {
  nestedKey {
    anotherNestedKey
  }
}
```

The scope for rules in the top level mapping is the input object

The scope for rules in nested mappings is the result of the rule the mapping is appended to

```text
{
  input / .
  nested / ^$.some.query {
    queryResult / .
  }
}
```

When a mapping scope is an array value, the mapping is applied to each element, and a list of the mapped results returned

```text
{
  mappedQueries / $.some.query.that.returns.list {
    thisElement / .
  }
}
```

## Required Rules

A rule can be marked as required in the mapping by appending the __required operator (!)__ to the key

```text
{
  optional
  required!
}
```

When a rule is required, it must be satisfied by the mapping of an input object or an error is thrown.
