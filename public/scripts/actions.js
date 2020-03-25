
//Main Action

const performAction = (action) => {


    actionCol = document.getElementById("action-perform-col");
    let tableElem = document.getElementById("scraped-product-table");

    let action_col = actionCol.options[actionCol.options.selectedIndex].value;
    let inputtedData = document.getElementById("user-input-action").value;
    
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
    }
    else if(action == "append"){
        
    }
    else if(action == "prepend"){
        
    }
    else if(action == "maths"){
        
    }

}

const replaceAction = () => {

}

