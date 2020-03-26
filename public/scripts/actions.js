
//Main Action

const performAction = (action) => {


    actionCol = document.getElementById("action-perform-col");
    let tableElem = document.getElementById("scraped-product-table");

    let action_col = actionCol.options[actionCol.options.selectedIndex].value;
    let inputtedData = document.getElementById("user-input-action").value.toLowerCase();
    
    if(inputtedData.length < 1){
        alert(`Please Enter data to perform action...`);
        return;
    }


    //Finding the requrired index of column of the table

    let headings = tableElem.getElementsByTagName("th");
    let requrired_index = undefined;

    for(let i=0 ; i<headings.length ;i++){
        if(action_col == headings[i].innerText.toLowerCase()){
            requrired_index = i;
        }
    }

    if(requrired_index == undefined){
        alert(`Unable to find colum, to perform action...`);
        return;
    }


    if(action == "replace"){
        let search = prompt("Input data you want to replace with ? ");
        replaceAction(requrired_index,inputtedData,search.toLowerCase() , tableElem);
    }
    else if(action == "append"){
        appendAction(requrired_index,inputtedData,tableElem);
    }
    else if(action == "prepend"){
        prependAction(requrired_index,inputtedData,tableElem);
    }
    else if(action == "maths"){
        
    }

}

const replaceAction = (col, inputtedData , existingData , table) => {
    
    let rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for(let i=0 ; i<rows.length  ; i++){

        let tab_data  = rows[i].getElementsByTagName("td")[col].innerText.toLowerCase();

        if(tab_data.match(existingData)){
            let replaced_data = tab_data.replace(existingData,inputtedData)
            rows[i].getElementsByTagName("td")[col].innerHTML = replaced_data;
        }

    }

}

const appendAction = (col , data , table) => {

    let rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for(let i=0 ; i<rows.length  ; i++){

        let tab_data  = rows[i].getElementsByTagName("td")[col].innerText.toLowerCase();
        let new_data = `${tab_data} ${data}`;
        rows[i].getElementsByTagName("td")[col].innerHTML = new_data;
        
    }

}

const prependAction = (col , data , table) => {

    let rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for(let i=0 ; i<rows.length  ; i++){

        let tab_data  = rows[i].getElementsByTagName("td")[col].innerText.toLowerCase();
        let new_data = `${data} ${tab_data}`;
        rows[i].getElementsByTagName("td")[col].innerHTML = new_data;
        
    }

}

const mathsAction = (col,expression,table) => {


    if(expression[0].match("_")){

    }
    else if(expression[expression.length - 1].match("_")){

    }
    else{
        alert(`Please enter the underScore either at the start of the expression or end of the expression`)
        return;
    }

}