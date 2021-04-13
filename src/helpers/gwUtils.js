
//convert timestamp to UTC format
const convertTimestamp = (_timestamp) => {
  return new Date(
      _timestamp * 1000
    ).toUTCString();
}

//calculate parcel value based on expiry date and current value
const calcParcelValue = (_expiry, _value) => {

  // let now = Date.now();
  // let networkFeeBalance = BigNumber.from(_expiry)
  //   .mul(1000)
  //   .sub(now)
  //   .div(1000)
  //   .mul(BigNumber.from(_value))
  //   .mul(perSecondFeeNumerator.toNumber())
  //   .div(perSecondFeeDenominator.toNumber());

  // return networkFeeBalance < 0 ? BigNumber.from(0) : networkFeeBalance;

}

export {convertTimestamp, calcParcelValue};