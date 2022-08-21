const MAX_DIGITS = 5;
const MAX_DECIMALS = 3;
const LIMIT_MESSEGE = "LIMIT EXCEEDED!!!";
const DIVIDED_BY_ZERO_MESSEGE = "CAN'T DIVIDE BY ZERO!!!";
const display = document.querySelector('.display');
const calculationStatus = document.querySelector('.calc-status');
const numberBtns = document.querySelectorAll('.number');
const operatorBtns = document.querySelectorAll('.operator');
const equalsBtn = document.querySelector('#equals');
const clearBtn = document.querySelector('#clear');
const allBtns = document.querySelectorAll('button');
const decimalBtn = document.querySelector('#decimal');
const backSpace = document.querySelector("#back-space");
const operatorMap = {
    'sum': { func: sum, symbol: '+'},
    'difference': { func: difference, symbol: '-'},
    'product': { func: product, symbol: '*'},
    'divide': { func: divide, symbol: '/'},
}

const calculation = {
    number1: {
        value: NaN,
        isFinalized: false,
    },
    number2:{
        value: NaN,
    },
    operator: undefined,
    status:'',
    getResult: function(){
        let result = operate(this.operator,this.number1.value,this.number2.value);
        console.log(result);
        return parseFloat(result.toFixed(3))
    },
    getOperatorSymbol: function(){
        if(!this.operator) return undefined;
        return operatorMap[this.operator.name]['symbol'];
    }
}

//************************Business Logic*********************************/

equalsBtn.addEventListener('click', executeCalculation);

clearBtn.addEventListener('click',clearCache);

for(let numberBtn of numberBtns)
{
    console.log(numberBtn);

    numberBtn.addEventListener('click',addNumberEvents);
}

for(let operatorBtn of operatorBtns)
{
    operatorBtn.addEventListener('click',addOperatorEvents);
    
}
backSpace.addEventListener('click',deleteNumber);
decimalBtn.addEventListener('click',addDecimal);
allBtns.forEach(()=>{addEventListener('click',updateCalcStatus)});

function addOperatorEvents(e)
{
    console.log("operator pressed");
    if(isNaN(calculation.number1.value))return;
    if(!isNaN(calculation.number1.value))
    {
        calculation.number1.isFinalized = true;
        clearDisplay();
    }
    if(!isNaN(calculation.number2.value))
    {
        calculation.number1.value = calculation.getResult();
        calculation.number2.value = NaN;
        displayNumber(`${calculation.number1.value}`);
    }
    calculation.operator = operatorMap[e.target.getAttribute('id')].func;
}

function addNumberEvents()
{
    if(display.textContent.localeCompare('NaN') === 0) 
    clearCache();
    if(calculationStatus.textContent.localeCompare(LIMIT_MESSEGE) === 0) 
    clearCache();

    if(calculation.number1.isFinalized && isNaN(calculation.number2.value))clearDisplay();
    
    addNumberToDisplay(this.textContent); 
    updateNumbers();
}


function updateNumbers()
{
    if(!calculation.number1.isFinalized)
        calculation.number1.value = parseFloat(display.textContent);
    else 
        calculation.number2.value = parseFloat(display.textContent);

    console.log(`n1: ${calculation.number1.value}, n2: ${calculation.number2.value}`);
}

function executeCalculation()
{
    if
    (
        isNaN(calculation.number1.value) || 
        !calculation.operator || 
        isNaN(calculation.number2.value)
    )
    {
        calculation.operator = undefined;
        calculation.number2.value = NaN;
        return;
    }

    calculation.number1.value = calculation.getResult();
    calculation.number1.isFinalized = false;
    calculation.number2.value = NaN;
    calculation.operator = undefined;
    displayNumber(calculation.number1.value);
}

function clearCache()
{
    clearDisplay();
    calculation.number1.value = NaN;
    calculation.number1.isFinalized = false;
    calculation.number2.value = NaN;
    calculation.operator = undefined;
    calculation.status = '';
}

function deleteNumber()
{
    if(display.textContent.length === 0) return;
    if(calculation.operator && isNaN(calculation.number2.value)) return;
    display.textContent = display.textContent.slice(0,-1);
    updateNumbers();
    updateCalcStatus();
}

function addDecimal()
{
    if(display.textContent.includes('.'))return;
    display.textContent = `${display.textContent}.`
    updateCalcStatus();
}
//************************Business Logic*********************************/

/**********************************************************************/
/**********************************************************************/
/**********************************************************************/

//********************** UI FUNCTIONS***********************************

function clearDisplay()
{
    display.textContent = '';
}

function clearCalcStatusDisplay()
{
    calculationStatus.textContent = '';
}

function displayNumber(number)
{
    console.log('inside Display Number.' + number);
    if(number.toString().length > (MAX_DIGITS + MAX_DECIMALS ))
    {
        console.log("Limit Exceeded");
        clearCache();
        calculation.status = LIMIT_MESSEGE; 
        return;
    }
    if(isNaN(number)) calculation.status = DIVIDED_BY_ZERO_MESSEGE;
    display.textContent = number;
}

function updateCalcStatus()
{
    console.log("updated");
    if(calculation.status.length > 0)
    {
        calculationStatus.textContent = calculation.status;
        return;
    }
    let str = '';
    if(isNaN(calculation.number1.value))
        str = '';
    else if (!calculation.operator)
        str = `${calculation.number1.value}`;
    else if (isNaN(calculation.number2.value))
        str = `${calculation.number1.value} ${calculation.getOperatorSymbol()}`;
    else
        str = `${calculation.number1.value} ${calculation.getOperatorSymbol()} ${calculation.number2.value}`;
    calculationStatus.textContent = str;
}

function addNumberToDisplay(digit)
{
    let str = display.textContent;
    let splitArr = str.split('.');
    if(
        splitArr[0]?.length > MAX_DIGITS-1 
        ||
        splitArr[1]?.length > MAX_DECIMALS-1
    ) return;
    displayNumber(`${display.textContent}${digit}`);
}

// ********************** UI FUNCTIONS******************************************

//*************************************************************************** */
//*************************************************************************** */
//*************************************************************************** */

// ********************** MATHEMATICAL OPERATORS *******************************

function sum(a,b){
    return a + b;
}

function difference(a,b){
    return a - b;
}

function product(a,b){
    return a * b;
}

function divide(a,b){
    return b === 0 ? NaN : a / b;
}


function operate(operator,a,b)
{
    return operator(a,b);
}

// ********************** MATHEMATICAL OPERATORS *******************************