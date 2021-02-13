Mapping "mapping details and rules" = details:MappingDetails* EOL rules:Rule* {
  return {
    ...details.pop(),
    ...(rules.length > 0 ? { rules } : {})
  }
}

MappingDetails "mapping details" = NVDMappingDetails

NVDMappingDetails "full mapping details" = name:Char+ ':' version:Char+ ':' description:Char* {
  return {
    name: name.join('').trim(),
    version: version.join('').trim(),
    description: description.join('').trim()
  }
} / NVMappingDetails

NVMappingDetails "mapping details with no description" = name:Char+ ':' version:Char* {
  return {
    name: name.join('').trim(),
    version: version.join('').trim()
  }
} / NMappingDetails

NMappingDetails "mapping details with just a name" = name:Char+ {
  return {
    name: name.join('').trim()
  }
}

Rule "a mapping rule" = text:Char+ EOL {
  return text.join('')
}

Char = [^:\n\r]
Newline = '\n' / '\r' '\n'?
EOL = Newline / !.
