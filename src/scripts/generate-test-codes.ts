const validChars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ' // No 0,1,I,O
const codeLength = 8

function generateCode(): string {
  let code = ''
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * validChars.length)
    code += validChars[randomIndex]
  }
  return code
}

// Generate 10 unique codes
const codes = new Set<string>()
while (codes.size < 10) {
  codes.add(generateCode())
}

console.log('Valid Test Codes:')
console.log('----------------')
codes.forEach((code, index) => {
  console.log(`${index + 1}. ${code}`)
}) 