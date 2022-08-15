
import { ethers, BigNumber} from "ethers";


//network constants
let annualRate = process.env.NEXT_PUBLIC_ANNUALRATE;
let perSecondFeeNumerator = parseFloat(annualRate) * 100;
let perSecondFeeDenominator = 60 * 60 * 24 * 365 * 100;

//Format value (Ether)
const formatValue = (_value) => {
  return ethers.utils.formatEther(_value);
}

//convert timestamp to UTC format
const convertTimestamp = (_timestamp) => {
  return new Date(
      _timestamp * 1000
    ).toUTCString();
}

//calculate parcel value based on expiry date and current value
const calcParcelBalance = (_expiry, _value) => {

  let now = Date.now();
  let networkFeeBalance = BigNumber.from(_expiry)
    .mul(1000)
    .sub(now)
    .div(1000)
    .mul(BigNumber.from(_value))
    .mul(perSecondFeeNumerator)
    .div(perSecondFeeDenominator);

  networkFeeBalance = networkFeeBalance < 0 ? BigNumber.from(0) : networkFeeBalance;

  return ethers.utils.formatEther(networkFeeBalance.toString())

}

//Truncate Strings for varying lengths
const truncateStr = (str, strLen) => {
  if (str.length <= strLen) {
    return str;
  }

  var separator = "...";

  var sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    str.substr(0, frontChars) + separator + str.substr(str.length - backChars)
  );
}

export { formatValue, convertTimestamp, calcParcelBalance, truncateStr};
