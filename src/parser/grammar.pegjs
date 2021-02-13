Mapping "mapping details and tree" = _ details:MappingDetails* _ tree:MappingTree _ {
  return {
    ...details.pop(),
    tree
  }
}

MappingDetails "mapping details" = _ head:Char+ _ tail:( _ '/' _ Char+)* '/'* {
  const name = head.join('').trim()
  const [ version, description ] = tail
  return {
    ...(name ? { name }: {}),
    ...(version ? { version: version.pop().join('').trim() }: {}),
    ...(description ? { description: description.pop().join('').trim() }: {})
  }
}

MappingTree "a mapping tree" = '{' _ head:MappingRule* tail:(EOL MappingRule)* _ '}' {
  return [ ...head, ...tail ]
}

MappingRule "a mapping rule" = _ rule:QueryMappingRule _ tree:MappingTree? {
  return {
    ...rule,
	...(tree ? { tree }: {})
  }
}

QueryMappingRule "a mapping rule with a key and a query" = key:Key '/' query:Char+ {
  return {
    ...key,
    query: query.join('').trim()
  }
} / KeyMappingRule

KeyMappingRule "a mapping rule with a key" = key:Key {
  return {
    ...key
  }
}

Key "a property key" = chars:Char+ _ required:'!'? _ {
  return {
    key: chars.join('').trim(),
  	required: !!required
  }
}

EOL = [\r\n]
Char = [^!/{}\r\n]
_  = [ \t\r\n]*
__ = [ \t\r\n]+
