/**
 * Minimal JSX/JS syntax tokenizer.
 * Zero external dependencies.
 * Returns an array of { type, value } tokens.
 *
 * Types: 'keyword' | 'component' | 'prop' | 'string' | 'comment' | 'brace' | 'plain'
 */

// Order matters — first match wins
const PATTERNS = [
  // Single-line comments
  { type: 'comment', re: /^(\/\/.*)/ },
  // Multi-line comments
  { type: 'comment', re: /^(\/\*[\s\S]*?\*\/)/ },
  // Template literals
  { type: 'string',  re: /^(`(?:[^`\\]|\\.)*`)/ },
  // Double-quoted strings
  { type: 'string',  re: /^("(?:[^"\\]|\\.)*")/ },
  // Single-quoted strings
  { type: 'string',  re: /^('(?:[^'\\]|\\.)*')/ },
  // JSX component tags (start uppercase)
  { type: 'component', re: /^(<\/?[A-Z][A-Za-z0-9.]*)/ },
  // HTML / lowercase JSX tags
  { type: 'brace',   re: /^(<\/?[a-z][A-Za-z0-9]*)/ },
  // JS keywords
  { type: 'keyword', re: /^(\b(?:import|export|default|function|const|let|var|return|from|if|else|true|false|null|undefined|new|class|extends|async|await|typeof|=>)\b)/ },
  // Prop names (lowercase identifier immediately before =)
  { type: 'prop',    re: /^([a-z][a-zA-Z0-9]*)(?==)/ },
  // Structural punctuation
  { type: 'brace',   re: /^([{}[\]()/<>])/ },
]

export function tokenize(code) {
  const tokens = []
  let pos = 0

  while (pos < code.length) {
    const slice = code.slice(pos)
    let matched = false

    for (const { type, re } of PATTERNS) {
      const m = slice.match(re)
      if (m) {
        tokens.push({ type, value: m[0] })
        pos += m[0].length
        matched = true
        break
      }
    }

    if (!matched) {
      // Consume one character as plain text, merging with previous plain token
      const last = tokens[tokens.length - 1]
      if (last && last.type === 'plain') {
        last.value += code[pos]
      } else {
        tokens.push({ type: 'plain', value: code[pos] })
      }
      pos++
    }
  }

  return tokens
}
