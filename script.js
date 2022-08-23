const MAX_DIGITS = 6;
const MAX_DECIMALS = 4;
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
const changeSignBtn = document.querySelector("#change-sign");
const operatorMap = {
    '+': { func: sum, symbol: '+'},
    '-': { func: difference, symbol: '-'},
    '*': { func: product, symbol: '*'},
    '/': { func: divide, symbol: '/'},
}

const calculation = {
    number1: {
        value: NaN,
        isFinalized: false,
    },
    number2:{
        value: NaN,
    },
    operator: 
    {
        func: undefined,
        symbol: '',
    },
    eavluationDone: false,
    status:'',
    getResult: function(){
        let result = operate(this.operator.func,this.number1.value,this.number2.value);
        console.log(result);
        return parseFloat(result.toFixed(3))
    },
}

//************************Business Logic*********************************/

window.addEventListener('keydown',(event) =>
 {
    if(!isNaN(parseInt(event.key)) ) {
        console.log('cool');
        addNumberEvents(parseInt(event.key));
        updateCalcStatus();
        return;
    }
    if(event.key === '.'){
        addDecimal();
        updateCalcStatus();
        return;
    }
    if(
        event.key === '+' || 
        event.key === '-' ||
        event.key === '*' || 
        event.key === '/'
    ){
        addOperatorEvents(event.key);
        updateCalcStatus();
        return;
    }
    if(
        event.key === '=' || 
        event.key === 'Enter'
    ){
        executeCalculation();
        updateCalcStatus();
        return;
    }
    if(event.key === 'Backspace'){
        deleteNumber();
        updateCalcStatus();
        return;
    }
    if(event.key === 'c'){
        clearCache();
        updateCalcStatus();
        return;
    }

})
equalsBtn.addEventListener('click', executeCalculation);

clearBtn.addEventListener('click',clearCache);

for(let numberBtn of numberBtns)
{
    console.log(numberBtn);
    numberBtn.addEventListener('click',(e) => {addNumberEvents(e.target.textContent)});
}

for(let operatorBtn of operatorBtns)
{
    operatorBtn.addEventListener('click',
    (e) => {
        addOperatorEvents(e.target.textContent);
    }
    );   
}
backSpace.addEventListener('click',deleteNumber);
decimalBtn.addEventListener('click',addDecimal);
changeSignBtn.addEventListener('click',changeSign)
allBtns.forEach(()=>{addEventListener('click',updateCalcStatus)});
function addOperatorEvents(symbol)
{
    console.log("operator pressed");
    if(isNaN(calculation.number1.value))return;
    if(!isNaN(calculation.number1.value))
    {
        calculation.number1.isFinalized = true;
    }
    if(!isNaN(calculation.number2.value))
    {
        calculation.number1.value = calculation.getResult();
        calculation.number2.value = NaN;
        displayNumber(`${calculation.number1.value}`);
    }
    clearDisplay();
    calculation.operator.func = operatorMap[symbol].func;
    calculation.operator.symbol = symbol;
    calculation.eavluationDone = false;
}

function addNumberEvents(number)
{
    if(display.textContent.localeCompare('NaN') === 0) 
    clearCache();
    if(calculationStatus.textContent.localeCompare(LIMIT_MESSEGE) === 0) 
    clearCache();
    if(calculation.eavluationDone)
    {
        clearCache();
        calculation.eavluationDone = false;
    }
    
    if(
        calculation.number1.isFinalized &&
        isNaN(calculation.number2.value) &&
        !display.textContent.includes('-')
    )
    clearDisplay();
    
    addToDisplay(number); 
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
        !calculation.operator.func || 
        isNaN(calculation.number2.value)
    )
    {
        calculation.operator.func = undefined;
        calculation.operator.symbol = '';
        calculation.number2.value = NaN;
        calculation.number1.isFinalized = false;
        return;
    }

    calculation.number1.value = calculation.getResult();
    calculation.number1.isFinalized = false;
    calculation.number2.value = NaN;
    calculation.operator.func = undefined;
    calculation.operator.symbol = '';
    calculation.eavluationDone = true;
    displayNumber(calculation.number1.value);
}

function clearCache()
{
    clearDisplay();
    calculation.number1.value = NaN;
    calculation.number1.isFinalized = false;
    calculation.number2.value = NaN;
    calculation.operator.func = undefined;
    calculation.operator.symbol = '';
    calculation.status = '';
}

function deleteNumber()
{
    if(display.textContent.length === 0) return;
    if(calculation.operator.func && isNaN(calculation.number2.value)) return;
    display.textContent = display.textContent.slice(0,-1);
    updateNumbers();
    updateCalcStatus();
}

function addDecimal()
{
    if(calculation.eavluationDone)
    {
        clearCache();
        calculation.eavluationDone = false;
    }
    if(display.textContent.includes('.'))return;
    if( isNaN(calculation.number1.value))
    {
        if(display.textContent.includes('-'))
        display.textContent = `-0.`;
        else display.textContent = `0.`;
    }
    else if(calculation.number1.isFinalized && isNaN(calculation.number2.value))
    {
        display.textContent = `0.`;
    }
    else display.textContent = `${display.textContent}.`;
    updateNumbers();
    updateCalcStatus();
}

function changeSign()
{
    if(display.textContent.includes('-'))
    display.textContent = display.textContent.slice(1);
    else
    display.textContent = `-${display.textContent}`;
    updateNumbers();
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
    if(hasExceededLimit(number.toString()))
    {
        console.log("Limit Exceeded");
        clearCache();
        calculation.status = LIMIT_MESSEGE; 
        return;
    }
    if(isNaN(number)) calculation.status = DIVIDED_BY_ZERO_MESSEGE;
    display.textContent = number;
}

function hasExceededLimit(string)
{
    if(string.includes('-')) 
    {
        if(string.includes('.'))
        return string.length > MAX_DIGITS + MAX_DECIMALS + 2;
        else
        return string.length > MAX_DIGITS + MAX_DECIMALS + 1;
        
    }

    if(string.includes('.')) 
    {    
        return string.length > MAX_DIGITS + MAX_DECIMALS + 1;
    }
    else
    {
        return string.length > MAX_DIGITS + MAX_DECIMALS;    
    }
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
    else if (!calculation.operator.func)
        str = `${calculation.number1.value}`;
    else if (isNaN(calculation.number2.value))
        str = `${calculation.number1.value} ${calculation.operator.symbol}`;
    else
        str = `${calculation.number1.value} ${calculation.operator.symbol} ${calculation.number2.value}`;
    calculationStatus.textContent = str;
}

function addToDisplay(digit)
{
    let str = display.textContent;
    let splitArr = str.split('.');
    if(str.includes('.')) 
    {
        if(splitArr[1]?.length > MAX_DECIMALS-1 )
        {
            console.log('decimal lt exceeded');
            return;
        }
    }
    else if(splitArr[0]?.length > MAX_DIGITS-1)
    {
        console.log('digit limit exceeded');
        return;
    }
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