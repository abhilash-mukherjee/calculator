const display = document.querySelector('.display');
const numberBtns = document.querySelectorAll('.number');
for(let numberBtn of numberBtns)
{
    console.log(numberBtn);

    numberBtn.addEventListener('click',addNumberToDisplay);
}

function addNumberToDisplay()
{
    display.textContent = `${display.textContent}${this.textContent}`;
}

function sum(a,b){
    return a + b;
}

function differene(a,b){
    return a - b;
}

function product(a,b){
    return a * b;
}

function divide(a,b){
    return a / b;
}

function operate(operator,a,b)
{
    return operator(a,b);
}