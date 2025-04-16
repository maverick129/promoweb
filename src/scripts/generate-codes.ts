const generateCode = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

const generateUniqueCodes = (count: number) => {
  const codes = new Set<string>()
  while (codes.size < count) {
    codes.add(generateCode())
  }
  return Array.from(codes)
}

function main() {
  try {
    const codes = generateUniqueCodes(10)
    console.log('Generated test codes:')
    console.log('-------------------')
    codes.forEach((code, index) => {
      console.log(`${index + 1}. ${code}`)
    })
    console.log('-------------------')
    console.log('\nYou can use any of these codes to test the promotion.')
    console.log('Each code can only be used once.')
  } catch (error) {
    console.error('Error generating codes:', error)
  }
}

main() 