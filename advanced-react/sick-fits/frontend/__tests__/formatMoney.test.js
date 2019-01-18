import formatMoney from '../lib/formatMoney'

describe('formatMoney', () => {
  it('works with cents', () => {
    expect(formatMoney(1)).toEqual('$0.01')
    expect(formatMoney(9)).toEqual('$0.09')
    expect(formatMoney(40)).toEqual('$0.40')
    expect(formatMoney(99)).toEqual('$0.99')
  })

  it('omits cents for whole-dollar amounts', () => {
    expect(formatMoney(5000)).toEqual('$50')
    expect(formatMoney(100)).toEqual('$1')
    expect(formatMoney(5000000)).toEqual('$50,000')
  })

  it('works with whole and fractional dollars', () => {
    expect(formatMoney(5012)).toEqual('$50.12')
    expect(formatMoney(101)).toEqual('$1.01')
    expect(formatMoney(110)).toEqual('$1.10')
    expect(formatMoney(981673965592869)).toEqual('$9,816,739,655,928.69')
  })
})
