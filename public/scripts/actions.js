
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

        if(action_col == "productimages"){
            replaceImageAction(requrired_index,inputtedData,search.toLowerCase(),tableElem);
        }
        else{
            replaceAction(requrired_index,inputtedData,search.toLowerCase() , tableElem);
        }

    }
    else if(action == "append"){
        appendAction(requrired_index,inputtedData,tableElem);
    }
    else if(action == "prepend"){
        prependAction(requrired_index,inputtedData,tableElem);
    }
    else if(action == "maths"){
        mathsAction(requrired_index,inputtedData,tableElem);
    }

}

const replaceAction = (col, inputtedData , existingData , table) => {
    
    let rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for(let i=0 ; i<rows.length  ; i++){

        let tab_data  = rows[i].getElementsByTagName("td")[col].innerText.toLowerCase();

        if(tab_data.match(existingData)){
            if(inputtedData.toLowerCase() == "del"){
                let replaced_data = tab_data.replace(existingData,"")
                rows[i].getElementsByTagName("td")[col].innerHTML = replaced_data;
            }
            else{
                let replaced_data = tab_data.replace(existingData,inputtedData)
                rows[i].getElementsByTagName("td")[col].innerHTML = replaced_data;
            }
            
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
    
    let position = undefined;

    if(expression[0].match("_")){
        position = "start";
        expression = expression.substr(2,expression.length - 3);
    }
    else if(expression[expression.length - 1].match("_")){
        position = "end";
        expression = expression.substr(1,expression.length - 3);
    }
    else{
        alert(`Please enter the underScore either at the start of the expression or end of the expression`)
        return;
    }


    let rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for(let i=0 ; i<rows.length  ; i++){

        let tab_data  = rows[i].getElementsByTagName("td")[col].innerText;
        
        if(tab_data.match("$")){
            tab_data = tab_data.replace(/\$/gi,"");
        }

        let ans ;
        
        //editing the expression so that if the user want the table data twice he can add @ [at the rate]
        if(expression.match("@")){
            expression = expression.replace(/\@/gi,tab_data)
        }

        //perform operation
        if(position == "start"){
            ans = eval(`${tab_data} ${expression}`)
        }
        else if(position == "end"){
            ans = eval(`${expression} ${tab_data}`)
        }

        rows[i].getElementsByTagName("td")[col].innerHTML = ans;
        
    }


}

const replaceImageAction = (col , inputtedData , existingData , table) => {
    
    let rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for(let i=0 ; i<rows.length  ; i++){

        let tab_data  = rows[i].getElementsByTagName("td")[col];

        let imgsElems = tab_data.getElementsByTagName("img");
        let listsElem = tab_data.getElementsByTagName("li");

        
        for(let img of imgsElems){
            let temp_src = img.getAttribute("src");
            temp_src = temp_src.replace(existingData,inputtedData);
            img.setAttribute("src",temp_src);
        }

        for(let l of listsElem){
            let replaced_data = l.innerText.replace(existingData,inputtedData);
            l.innerText = replaced_data;
        }

        let temp_html = ``;

        for(let i of imgsElems){
            temp_html += `<img src="${i.src}" />`;
        }
        
        temp_html += `<ol>`;

        for(let l of listsElem){
            temp_html += `<li>${l.innerText}</li>`;
        }

        temp_html += `</ol>`;

       
        rows[i].getElementsByTagName("td")[col].innerHTML =  temp_html;    

    }

}