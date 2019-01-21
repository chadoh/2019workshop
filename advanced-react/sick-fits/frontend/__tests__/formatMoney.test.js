import formatMoney from '../lib/formatMoney'

describe.each`
  given              | expected
  ${1}               | ${'$0.01'}
  ${9}               | ${'$0.09'}
  ${40}              | ${'$0.40'}
  ${99}              | ${'$0.99'}
  ${100}             | ${'$1'}
  ${5000}            | ${'$50'}
  ${5000000}         | ${'$50,000'}
  ${5012}            | ${'$50.12'}
  ${101}             | ${'$1.01'}
  ${110}             | ${'$1.10'}
  ${101}             | ${'$1.01'}
  ${981673965592869} | ${'$9,816,739,655,928.69'}
`('formatMoney', ({ given, expected }) => {
  test(`given \`${given}\` returns \`"${expected}"\``, () => {
    expect(formatMoney(given)).toEqual(expected)
  })
})
