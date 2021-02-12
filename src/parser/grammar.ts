export default `
Mapping = details:MappingDetails* {
  return {
    ...details.pop()
  }
}

MappingDetails = name:[^:]+ ':' version:[^:]+ ':' description:[^:]+ {
  return {
    name: name.join(''),
    version: version.join(''),
    description: description.join('')
  }
}
`
