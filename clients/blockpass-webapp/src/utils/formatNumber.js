import numeral from 'numeral';
// ----------------------------------------------------------------------

export function fCurrency(number) {
  return numeral(number).format(Number.isInteger(number) ? '$0,0' : '$0,0.00');
}

export function fPercent(number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number) {
  return numeral(number).format();
}

export function fShortenNumber(number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number) {
  return numeral(number).format('0.0 b');
}

export function weiToFormattedEther(wei) {
  const WEI_IN_ETHER = BigInt(1e18); // 1 ether is 1e18 wei
  const ether = Number(wei) / Number(WEI_IN_ETHER);

  // Use toPrecision() to format small numbers using scientific notation
  if (ether < 0.001) {
    return ether.toPrecision(3);
  }
  // Use toFixed() for numbers larger than or equal to 0.001
  return parseFloat(ether.toFixed(3)).toString();
}