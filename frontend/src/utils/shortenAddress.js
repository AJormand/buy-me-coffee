export const shortenAddress = (address) => {
  const shortenedAddress = address.slice(0, 4) + "...." + address.slice(-4);
  return shortenedAddress;
};
