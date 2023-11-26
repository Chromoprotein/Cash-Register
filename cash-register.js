function checkCashRegister(price, cash, cid) {
  //create the variables etc
  let owedChange = (cash - price) * 100; // Convert to cents for integer calculations
  let cidReversed = cid.reverse(); //warning: it mutates the array
  let change = []; //holds the change we'll give
  const typesOfBills = {
    //all are multiplied by 100
    "ONE HUNDRED": 10000,
    TWENTY: 2000,
    TEN: 1000,
    FIVE: 500,
    ONE: 100,
    QUARTER: 25,
    DIME: 10,
    NICKEL: 5,
    PENNY: 1,
  };
  let returnObject = { status: "", change: [] }; //this will be returned by the function

  //Do we have enough change? Multiplied by 100
  const sumInRegister = cid.reduce(
    (accumulator, currentValue) => accumulator + currentValue[1] * 100,
    0
  );
  if (sumInRegister < owedChange) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  } else if (sumInRegister === owedChange) {
    return { status: "CLOSED", change: cid.reverse() }; //reverse again because the first time mutated the array
  } else {
    returnObject.status = "OPEN";
  }

  //cash register math
  for (let bill in cidReversed) {
    //start from the biggest bill
    while (
      owedChange >= typesOfBills[cidReversed[bill][0]] &&
      cidReversed[bill][1] > 0
    ) {
      //is owed change more than bill type's value, and check that we have them in register
      owedChange -= typesOfBills[cidReversed[bill][0]];
      cidReversed[bill][1] -= typesOfBills[cidReversed[bill][0]] / 100; //divide to make it dollars again
      change.push([
        cidReversed[bill][0],
        typesOfBills[cidReversed[bill][0]] / 100,
      ]); //divide to make it dollars again
    }
  }

  //could we give exact change?
  if (owedChange > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  //we could give exact change, so put the bills into an object and sum the value of each bill
  const sumByCurrency = change.reduce((accumulator, [currency, amount]) => {
    if (accumulator[currency]) {
      accumulator[currency] += amount; //the property exists, add to its value
    } else {
      accumulator[currency] = amount; //the property doesn't exist, create it
    }
    return accumulator;
  }, {});
  //turn it into an array
  const resultArray = Object.entries(sumByCurrency);
  //update it into the object that will be returned and fix the decimals
  returnObject.change = resultArray.map(([currency, amount]) => [
    currency,
    parseFloat(amount.toFixed(2)),
  ]);

  return returnObject;
}

console.log(
  checkCashRegister(19.5, 20, [
    ["PENNY", 0.5],
    ["NICKEL", 0],
    ["DIME", 0],
    ["QUARTER", 0],
    ["ONE", 0],
    ["FIVE", 0],
    ["TEN", 0],
    ["TWENTY", 0],
    ["ONE HUNDRED", 0],
  ])
);
