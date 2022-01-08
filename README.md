# Json Mapper

Maps one json structure to another, according to a declared specification.

```javascript
const globals = { time: Date.now() }

const mapper = JsonMapper.fromString(`{
  input / .
  createdAt / ^..&.time
}`, globals)

const output = mapper.map({ some: 'input' })

console.dir(output) // { createdAt: <Date.now()>, input: { some: 'input' } }
```

Please see the [documentation](./docs/SYNTAX.md) for more info.
