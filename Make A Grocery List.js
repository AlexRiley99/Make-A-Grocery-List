document.addEventListener('DOMContentLoaded', function(){//ensures that html loads before js executes
//declaring arrays
var itemArray = [];
var quantArray = [];
var costArray = [];

//declaring input variables
var itemName = document.getElementById('itemName');
var itemQuantity = document.getElementById('itemQuantity');
var itemCost = document.getElementById('itemCost');
var budgetAmount = document.getElementById('budgetAmount'); 
var listEditor = document.getElementById('listEditor');

//declaring buttons
var doneButton = document.getElementById('done');
var addButton = document.getElementById('add');
var editButton = document.getElementById('edit');
var deleteButton = document.getElementById('delete');
var setBudgetButton = document.getElementById('setBudget');
var confirmEditButton = document.getElementById('confirmEdit');
var cancelEditButton = document.getElementById('cancelEdit');
var finishEditingButton = document.getElementById('finishEditing');
var editAnotherButton = document.getElementById('editAnother');
var replaceButton = document.getElementById('replace');
var removeButton = document.getElementById('remove');
var success = document.getElementById('success');

//declaring outputs
var listItems = document.getElementById('listItems');
var listQuantities = document.getElementById('listQuantities');
var listCosts = document.getElementById('listCosts');
var difference = document.getElementById('difference');
var total = document.getElementById('total');
var budget = document.getElementById('budget');
var overUnder = document.getElementById('overUnder');


//BUDGET
function SetBudgetButtonClick(){ //Set and display budget
    var budgetValue = budgetAmount.value.trim(); //get the trimmed value

    if(budgetValue.trim() == ''){ //If field is empty, display alert
        alert('Please enter a budget amount.');
    }
    else if(isNaN(budgetValue)){ //If value is not a number, display alert
        alert('Please enter a valid numeric value for your budget amount.');
    }
    else{

        budget.innerHTML = "<h4 class='calcValues'>$" + parseFloat(budgetValue).toFixed(2) + "</h4>";

        return budgetValue;
    }
}
setBudgetButton.addEventListener('click', SetBudgetButtonClick);

function budgetOverUnder(){ //Displays a message if the user is over, under, or on budget
    var budgetValue = parseFloat(budgetAmount.value);
    var totalValue = calculateRunningTotal();
    var differenceValue = budgetValue - totalValue;
    if(totalValue < budgetValue){
        overUnder.innerHTML = "<h4 class='overUnderOutput' id='underBudget'>You are under budget by $" + differenceValue.toFixed(2) + "! Way to save money!</h4>";
    }
    else if(totalValue > budgetValue){
        overUnder.innerHTML = "<h4 class='overUnderOutput' id='overBudget'>Oops! You're over budget by $" + Math.abs(differenceValue).toFixed(2) + "! You may edit your list by clicking the Edit button.</h4>";
    }
    else if(differenceValue == 0){
        overUnder.innerHTML = "<h4 class='overUnderOutput' id='onBudget'>You're right on budget!</h4>";
    }
}


//ADD
function addToList(){ //Adds an item to the list
    var budgetValue = parseFloat(budgetAmount.value);
    var runningTotal = calculateRunningTotal();
    var budgetCheck = document.getElementById('budgetCheck');
    var item = itemName.value;
    var quantity = itemQuantity.value;
    var cost = itemCost.value;

    if (item.trim() !== '' && quantity.trim() !== '' && cost.trim() !== ''){ //check if input is not empty
        if(budgetAmount.value.trim() == ''){ //Make sure the user has a budget amount set
            alert('Please enter a budget amount before proceeding with your list.');
    
            //Clear input fields
            itemName.value = '';
            itemQuantity.value = '';
            itemCost.value = '';
    
            //Remove the last elements from the arrays to prevent them from saving
            itemArray.pop();
            quantArray.pop();
            costArray.pop();
        }
        else if(isNaN(quantity)){//Make sure 'quantity' is a number
            alert('Please enter a valid numeric value for the quantity.');
        }
        else if(isNaN(cost)){//Make sure 'cost' is a number
            alert('Please enter a valid numeric value for the anticipated cost.');
        }
        else if(typeof item !== 'string' || !isNaN(item)){
            alert('Item must be text only!');
        }
        else if(item.trim() == '' || quantity.trim() == '' || cost.trim() == ''){
            alert ('One or more fields are empty! Please enter a value.');
        }
        else if(budgetCheck.checked && runningTotal + parseFloat(cost) > budgetValue){ //See if budgetCheck is checked
                //Clear input fields
                itemName.value = '';
                itemQuantity.value = '';
                itemCost.value = '';
    
                //Remove the last elements from the arrays to prevent them from saving
                itemArray.pop();
                quantArray.pop();
                costArray.pop();
    
                //Throw alert if over budget
                alert('Over budget!');
        }
        else{
            itemArray.push(item); 
            itemName.value = ''; 

            quantArray.push(quantity);
            itemQuantity.value = '';

            costArray.push(cost);
            itemCost.value = '';
        } //As long as no fields are empty and 'quantity' and 'cost' are both
        //numeric values, add the inputs to their respective arrays and
        //clear the fields
    }
}
budgetCheck.addEventListener('change', addToList);


function displayList(){
    //Display item values from itemArray 
    var itemCount = 1;
    var listHTML = '<ul>';
    for (var i = 0; i < itemArray.length; i++){
        listHTML += '<h4>' + itemCount + "." + itemArray[i] + '</h4>';
        itemCount++;
    }
    listHTML += '</ul>'
    listItems.innerHTML = listHTML;

    //Display quantity values from quantArray
    listHTML = '<ul>';
    for (i = 0; i < quantArray.length; i++){
        listHTML += '<h4>' + quantArray[i] + '</h4>';
    }
    listHTML += "</ul>";
    listQuantities.innerHTML = listHTML;

    //Display cost values from costArray
    listHTML = '<ul>';
    for (i = 0; i < costArray.length; i++){
        listHTML += '<h4>$' + costArray[i] + '</h4>';
    }
    listHTML += "</ul>";
    listCosts.innerHTML = listHTML;
}

function AddButtonClick(){ //Adds items to list and displays values after "Add is clicked"
    addToList();
    displayList();
    calculateRunningTotal(); 
    calculateDifference();
}
addButton.addEventListener('click', AddButtonClick);


//MATH
function calculateDifference(){ //Calculates and displays the difference
    var budgetValue = budgetAmount.value;
    var finalTotal = calculateRunningTotal();
    var differenceAmount = parseFloat(budgetValue).toFixed(2) - parseFloat(finalTotal).toFixed(2);

    return differenceAmount;
}

function calculateRunningTotal(){
    var runningTotal = 0;

    costArray.forEach((cost, index) => {
        var quantity = parseFloat(quantArray[index]); //Get the corresponding quantity with the same index
        runningTotal += parseFloat(cost) * quantity;
    });

    console.log("Running Total: " + runningTotal); //For debugging
    
    return runningTotal;
}


//DONE
function displayTotal(){
    var runningTotal = calculateRunningTotal(); //Calculate running total 
    total.innerHTML = "<h4 class='calcValues'>$" + runningTotal.toFixed(2) + "</h4>"; //display total
}

function displayDifference(){
    var differenceAmount = calculateDifference();
    console.log("Difference: " + differenceAmount); //For debugging
    difference.innerHTML = "<h4 class='calcValues'>$" + differenceAmount.toFixed(2) + "</h4>";
}

function DoneButtonClick(){ 
    displayTotal();
    displayDifference();
    budgetOverUnder();
}
doneButton.addEventListener('click', DoneButtonClick); //event listener for "done" button


//EDIT
function EditButtonClick(){//Opens a text box that receives an item number that will then correspond to an index
    var listEditorDiv = document.getElementById('listEditorDiv');
    listEditorDiv.style.display = 'block';
}
editButton.addEventListener('click', EditButtonClick);

function ConfirmEditButtonClick(){//Confirm user input and display corresponding array information
    var editItem = document.getElementById('editItem');
    var index = parseInt(editItem.value) - 1; //Get index value from input
    //Index is editItem.value - 1 because the item list begins at 1, but arrays 
    //begin at 0, so every index will be 1 less than the item number

    editAnotherButton.style.display = 'none';

    var currentItem = document.getElementById('currentItem');
    var currentQuantity = document.getElementById('currentQuantity');
    var currentCost = document.getElementById('currentCost');

    if(isNaN(index) || index < 0 || index >= (itemArray.length + 1) || index >= (quantArray.length + 1) || index >= (costArray.length)){
        alert('Please enter a valid item number. You can refer to "Your List" for the range of valid numbers');
        editItem.value = ''; //clear the field so the user can try again
    }//Check that the value entered is valid
    else{
        var listEditor = document.getElementById('listEditor');
        listEditor.style.display = 'inline-block';

        currentItem.innerHTML = "<h4>" + itemArray[index] + "</h4>";
        currentQuantity.innerHTML = "<h4>" + quantArray[index] + "</h4>";
        currentCost.innerHTML = "<h4>$" + costArray[index] + "</h4>";
        
        replaceButton.style.display = 'inline-block';
        removeButton.style.display = 'inline-block';
    }//If the value entered is valid, display the corresponding array information
}
confirmEditButton.addEventListener('click', ConfirmEditButtonClick);

function CancelEditButtonClick(){//clear data 
    var editItem = document.getElementById('editItem');
    var index = parseInt(editItem.value) - 1;

    editItem.value = '';
    newItem.value = '';
    newQuantity.value = '';
    newCost.value = '';

    listEditorDiv.style.display = 'none';
    listEditor.style.display = 'none';
    newValuesDiv.style.display = 'none';
}
cancelEditButton.addEventListener('click', CancelEditButtonClick);


function FinishEditingButtonClick(){
    var editItem = document.getElementById('editItem');
    var index = parseInt(editItem.value) - 1;

    var replaceIndex = index.value;
    var newItem = document.getElementById('newItem');
    var newQuantity = document.getElementById('newQuantity');
    var newCost = document.getElementById('newCost');

    finishEditingButton.style.display = 'none';
    editAnotherButton.style.display = 'inline-block';

    itemArray[index] = newItem.value;
    quantArray[index] = newQuantity.value;
    costArray[index] = newCost.value;

    success.innerHTML = "<h4>Success!</h4>";
    DoneButtonClick();
    displayList();
}
finishEditingButton.addEventListener('click', FinishEditingButtonClick);


function EditAnotherButtonClick(){
    var editItem = document.getElementById('editItem');
    var index = parseInt(editItem.value) - 1;
    editItem.value = '';
    listEditor.style.display = 'none';
    newValuesDiv.style.display = 'none';
    editAnotherButton.style.displaSy = 'none';

    newItem.value = '';
    newQuantity.value = '';
    newCost.value = '';

    EditButtonClick();
}
editAnotherButton.addEventListener('click', EditAnotherButtonClick);

function ReplaceButtonClick(){
    var editItem = document.getElementById('editItem');
    var index = parseInt(editItem.value) - 1;

    var newValuesDiv = document.getElementById('newValuesDiv');
    newValuesDiv.style.display = 'inline-block';

    replaceButton.style.display = 'none';
    removeButton.style.display = 'none';
    editAnotherButton.style.display = 'none';
    finishEditingButton.style.display = 'inline-block';
}
replaceButton.addEventListener('click', ReplaceButtonClick);

function RemoveButtonClick(){
    var editItem = document.getElementById('editItem');
    var index = parseInt(editItem.value) - 1;

    editAnotherButton.style.display = 'inline-block';
    removeButton.style.display = 'none';
    replaceButton.style.display = 'none';

    itemArray.splice(index, 1);
    quantArray.splice(index, 1);
    costArray.splice(index, 1);

    DoneButtonClick();
    displayList();
}
removeButton.addEventListener('click', RemoveButtonClick);


//DELETE
function confirmDelete(){
    var confirmed = window.confirm("Are you sure you want to delete this list? It cannot be recovered.");
        if(confirmed){
            location.reload();
        }
}
function DeleteButtonClick(){
    confirmDelete();
}    
deleteButton.addEventListener('click', DeleteButtonClick);
});

