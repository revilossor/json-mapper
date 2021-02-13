Mapping "mapping details and rules" = details:MappingDetails* EOL rules:Rule* {
  return {
    ...details.pop(),
    ...(rules.length > 0 ? { rules } : {})
  }
}

MappingDetails "mapping details" = NVDMappingDetails

NVDMappingDetails "full mapping details" = name:Char+ ':' version:Char+ ':' description:Char* {
  return {
    name: name.join(''),
    version: version.join(''),
    description: description.join('')
  }
} / NVMappingDetails

NVMappingDetails "mapping details with no description" = name:Char+ ':' version:Char* {
  return {
    name: name.join(''),
    version: version.join('')
  }
} / NMappingDetails

NMappingDetails "mapping details with just a name" = name:Char+ {
  return {
    name: name.join('')
  }
}

Rule "a mapping rule" = text:Char+ EOL {
  return text.join('')
}

Char = [^:\n\r]
Newline = '\n' / '\r' '\n'?
EOL = Newline / !.
