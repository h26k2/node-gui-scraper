
const checkForEmpty = (inputs) => {

    let check = false;

    Array.from(inputs).forEach(input => {
        if(input.value.length < 2){
            check = true;
            return;
        }
    });

    return check;
}

const mainContainerChooser = () => {

    let inputs = document.getElementsByClassName("user-input-field");

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    
    fetch(`/mainProducts`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : websiteURL,
        })
    }).then((data)=>{
        data.json().then((d)=>{
            document.getElementById("main-container").value = d;
        })
    });

}

const productDetailChooser = () => {

    let inputs = document.getElementsByClassName("main-container-chooser");
    
    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

}

const saveMetaData = () => {

    /*let user_inputs = document.getElementsByClassName("user-input-field");
    let input_mainContainer = document.getElementById("main-container");
    let input_individualProduct = document.getElementById("individual-product");
    let input_productImages = document.getElementById("input-product-image");
    let input_cols = document.getElementById("columns").getElementsByTagName("input");
    
    let inputFieldsToCheck = [...user_inputs,input_mainContainer,
        input_individualProduct,input_productImages,...input_cols]

    if(checkForEmpty(inputFieldsToCheck)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let dataToSend = {
        productCatalogURL : user_inputs[0].value,
        productSecondPageURL  : user_inputs[1].value,
        productSingleURL  : user_inputs[2].value,
        productBrandName  : user_inputs[3].value,
        productCatalog : input_mainContainer.value,
        productSingleContainer : input_individualProduct.value,
        productImagesContainer : input_productImages.value,
        cols : {

        }
    }

    
    let temp_cols = [];
    Array.from(input_cols).forEach((i_col)=>{
        let name  = i_col.parentElement.getElementsByClassName("btn-choose")[0].getAttribute("data-val");
        let val = i_col.value;

        temp_cols.push(
            {name,val}
        )

    }); 

    dataToSend.cols = {
        ...temp_cols
    }
    
    */

    let dataToSend = fetchMarkupElements(true);
   
    if(dataToSend == undefined){
        return;
    }
    
    console.log(`Sending request to the server for saving metadata`);

    fetch(`/saveMetaData`,{
        method  : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
           dataToSend
        })
    }).then((res)=>{
        
        if(res.status == 200){ 
            alert(`Successfully Saved Metadata!`);
        }
        else if(res.status == 204){
            
            let custom_path = null;

            while(custom_path == null){
                
                custom_path = prompt(`We couldn't detect the url of the website\nenter the custom path`);
                if(custom_path.length < 2){
                    custom_path = null;
                }

            }

            fetch(`/saveMetaData?custom_path=${custom_path}`,{
                method : 'POST',
                headers : {
                    'Content-type' : 'application/json;charset=utf-8'
                },
                body : JSON.stringify({
                    dataToSend
                })
            }).then((data)=>{

                if(data.status == 200){
                    alert(`Successfully Saved Metadata!`);
                }
                else{
                    console.log(`error occured`);
                    alert(`Error occured saving metadata`);
                }
            }).catch((err)=>{
                alert(`Error occured, we couldn't save the metadata`);
                console.log(err);
            })           

        }
    }).catch((err)=>{
        alert(`Error occured!`);
        console.log(err);
    })

}

const addColumn = (event) => {
    
    let {keyCode} = event;

    if(keyCode == 13){
        
        let {value} = event.target;
        event.target.value = "";
        event.target.focus();

        // Creating element for the following entered columns

        let row = document.createElement("div");
        row.setAttribute("class","row");

        let sku = `DEM-${Math.floor(Math.random() * 999)}`;

        row.innerHTML = `
            
            <div class="col-6">
                <p>Enter ${value}</p>
            </div>

            <div class="col-6">
                <div class="form-group">
                    <button class="btn btn-sec btn-choose" onClick="productDetailLink(event)" data-sku="${sku}" data-val="${value}">
                        <i class="fas fa-map-marker-alt"></i>
                    </button>
                    <input type="text" class="form-control" />
                    <button class="btn btn-red btn-right btn-delete " onClick="delCol(event)" data-sku="${sku}">
                        <i class="far fa-trash-alt"></i>
                    </button> 
                </div>
            </div>

        

        `;

        let colElem = document.getElementById("columns");
        colElem.appendChild(row);

    }

}

const delCol = (event) => {
    
    let {target} = event;
    let {nodeName} = target;
    let elem;

    if(nodeName == "BUTTON"){
        elem = target;
    }
    else{
        elem = event.currentTarget;
    }

    let colElem = document.getElementById("columns");
    let rowElem = colElem.getElementsByClassName("btn-delete");
    
    for(let i=0 ; i<rowElem.length ; i++ ){

        if(rowElem[i].getAttribute("data-sku") == elem.getAttribute("data-sku")){
            //rowElem.removeChild(rowElem.childNodes[i]);
            colElem.removeChild(colElem.childNodes[i]);
        }
    }

//    colElem.removeChild()

}

const individualProduct = () => {
    
    let inputs = document.getElementsByClassName("user-input-field");

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    
    fetch(`/individualProduct`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : websiteURL,
        })
    }).then((data)=>{
        
        data.json().then((d)=>{
            document.getElementById("individual-product").value = d;
        });
    });

}

const productDetailLink = (e) => {

    let {target , currentTarget} = e;
    let {nodeName} = target;
    let elem ;

    if(nodeName == "BUTTON"){
        elem = target;
    }
    else{
        elem = currentTarget;
    }


    let inputs = document.getElementsByClassName("user-input-field");
    
    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    let brandName = inputs[1].value;
    let demoProductURL = inputs[2].value;

    let col_val , sku;

    col_val = elem.getAttribute("data-val");
    sku = elem.getAttribute("data-sku");


    fetch(`/productDetail`,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            col : col_val,
            url : demoProductURL,
        })
    }).then((data)=>{
        data.json().then((d)=>{
           
            let elem = document.getElementById("columns").getElementsByClassName("btn-choose");
            
            Array.from(elem).forEach((e)=>{
                if(e.getAttribute("data-sku") == sku ){
                    e.parentElement.getElementsByTagName("input")[0].value = d;
                }
            });
            

        })
    })


}

let products_scraped = [];
let all_products_url_images = [];
let productUrlsToScrap = [];


const scrapProducts = () => {

    let statusElem = document.getElementById("scraping-status").getElementsByTagName("p");
    let  status ,statusCurrentPage , statusStartPage , statusEndPage,statusProductsScraped;
    console.log(`called`);
    status = statusElem[0].getElementsByTagName("span")[0];
    statusCurrentPage = statusElem[1].getElementsByTagName("span")[0];
    statusStartPage = statusElem[2].getElementsByTagName("span")[0];
    statusEndPage = statusElem[3].getElementsByTagName("span")[0];
    statusProductsScraped = statusElem[4].getElementsByTagName("span")[0];


    let metadata_loaded = document.getElementById("metadata-input").hasAttribute("disabled");
   
    if(metadata_loaded != true){
        alert(`Please Load the metadata first, then scrap the products`);
        return;
    }

    /*********************************************************************
        Checking whether the start and end page are populated or not
        if yes then go on otherwise alert the user that they are empty
    **********************************************************************/

    let s_page = document.getElementById("start-page").value;
    let e_page = document.getElementById("end-page").value;

    if(s_page.length == 0 || e_page.length == 0){
        alert(`Please enter the start and end page you want to scrap`);
        return;
    }

    let button = document.getElementById("scrap-products-btn");

    /***********************************************************************
        Checking that either the button has following attributes or not
        if it have all the attributes the it means that we have to scrape
        the given pages if it misses any one attributes then first of all 
        we have to find the pages-count
    ************************************************************************/
    
    let action = button.getAttribute("data-action");

    let has_page_start = button.hasAttribute("data-page-start");
    let has_page_end = button.hasAttribute("data-page-end");
    let has_page_current = button.hasAttribute("data-page-current"); 


    if( (has_page_start == false || has_page_end == false || has_page_current == false)){
        button.setAttribute("data-page-start",s_page);
        button.setAttribute("data-page-current",s_page);
        button.setAttribute("data-page-end",e_page);
        button.setAttribute("data-action","scrapURLs");
        statusStartPage.innerText = s_page;
        statusCurrentPage.innerText = s_page;
        statusEndPage.innerText = e_page;
        scrapProducts();
    }
    else{

        let page_current = parseInt(button.getAttribute("data-page-current"));
        let page_start = parseInt(button.getAttribute("data-page-start"));
        let page_end = parseInt(button.getAttribute("data-page-end"));

        if(action == "scrapURLs"){

            if(page_current >= page_start && page_current <= page_end){
            
                console.log(`sending request for page : ${page_current}`);
                status.innerText = `sending request for page ${page_current} to scrape`;
                
                fetch(`/scrapURLs?page=${page_current}`,{method : 'POST'}).then((res)=>{
                    
                    if(res.status == 200){

                        res.json().then((data)=>{
                            console.log(`successfully scraped ${data.length} URLS from page : ${page_current} `);
                            status.innerText = `successfully scraped ${data.length} products URL from page : ${page_current}`;
                            console.log(`timing out for 10sec`);
                            //products_scraped.push(...data);
                            productUrlsToScrap = [...data];
                            setTimeout(()=>{
                                button.setAttribute("data-action","scrapProduct");
                                button.setAttribute("data-scraped-product-start","0");
                                button.setAttribute("data-scraped-product-current","0");
                                button.setAttribute("data-scraped-product-end",data.length - 1);
                                scrapProducts();
                            },10000);
            
                        });

                    }
                    else if(res.status == 500){
                        status.innerText = `Error occured while peforming the action, please check server console for error`;
                        console.log(`error occured, check server console`);
                    }
                    
                }).catch((err)=>{
                    status.innerText = `Error occured while performing action`;
                    console.log(`error : ${err}`);
                })
        
            }

        }
        else if(action == "scrapProduct"){
            
            console.log(`==> Scraping Product Details <==`);
            
            //let productSeq = parseInt(button.getAttribute("data-product-scraped"));
            let scraped_product_start = parseInt(button.getAttribute("data-scraped-product-start"));
            let scraped_product_end = parseInt(button.getAttribute("data-scraped-product-end"));
            let scraped_product_current = parseInt(button.getAttribute("data-scraped-product-current"));
            
            if( /*urlsToScrap.length >= 1 && productSeq <= urlsToScrap.length-1*/
                (scraped_product_current >= scraped_product_start) && (scraped_product_current <= scraped_product_end) ){
                
                console.log(`==> product being scraped : ${productUrlsToScrap[scraped_product_current]} of page ${page_current}`);
                status.innerText = `scraping details of product ${scraped_product_current + 1} / ${scraped_product_end +1 } of page : ${page_current}`
                fetch(`/scrapProductDetails`,{
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'application/json;charset=utf-8'
                    },
                    body : JSON.stringify({link : productUrlsToScrap[scraped_product_current]})
                }).then((res)=>{
                    if(res.status == 200){
                        console.log(`==> product ${scraped_product_current} successfully scraped of page : ${page_current} <==`);
                        status.innerText = `product ${scraped_product_current + 1} / ${scraped_product_end+1} details successfully scraped from page : ${page_current}`;
                        res.json().then((data)=>{
    
                            products_scraped.push(...data);
                            console.log(`Timing out for 10secs, image scraping will start automatically`);
                            setTimeout(()=>{
                                button.setAttribute("data-action","scrapImages");
                                scrapProducts();
                            },10000);   
    
                        });
                    }
                }).catch((err)=>{
                    console.log(`Error occured while scraping product details`);
                    console.log(err);
                });

            }

        }
        else if(action == "scrapImages"){
            
            console.log(` ==> Scraping Product Images <==`);

            //let productSeq = parseInt(button.getAttribute("data-product-scraped"));
            let scraped_product_current = parseInt(button.getAttribute("data-scraped-product-current"));
            let scraped_product_start = parseInt(button.getAttribute("data-scraped-product-start"));
            let scraped_product_end = parseInt(button.getAttribute("data-scraped-product-end"));

            if(/*urlsToScrap.length >= 1 && productSeq <= urlsToScrap.length-1 */
                (scraped_product_current >= scraped_product_start) && (scraped_product_current <= scraped_product_end)){

                    status.innerText = `scraping images of product : ${scraped_product_current+1} / ${scraped_product_end+1} of page : ${page_current}`

                fetch(`/scrapImages`,{
                    method  : 'POST',
                    headers : {
                        'Content-type' : 'application/json;charset=utf-8' 
                    },
                    body : JSON.stringify({link : productUrlsToScrap[scraped_product_current] })
                }).then((res)=>{
                    
                    res.json().then((imageRes)=>{
                        console.log(`successfully scraped product images`);
                        status.innerText = `images of product : ${scraped_product_current+1} / ${scraped_product_end+1} of page ${page_current} successfully scraped`
                        all_products_url_images.push([...imageRes]);
                        statusProductsScraped.innerText = products_scraped.length;
                        //products_scraped[scraped_product_current] = [...products_scraped[scraped_product_current],[...imageRes]];
                        
                        //check if there is remaining product to scrap or not
                        if(scraped_product_current < scraped_product_end){
                            scraped_product_current++;
                            
                            console.log(`next product will scrape after 10secs`);
                            button.setAttribute("data-scraped-product-current",scraped_product_current);
                            button.setAttribute("data-action","scrapProduct");
                            setTimeout(()=>{
                                scrapProducts();
                            },10000)
                        }
                        else{
                            //check if there is remaining page or not
                            if(page_current < page_end){
                                page_current++;
                                statusCurrentPage.innerText = page_current;
                                button.setAttribute("data-page-current",page_current);
                                console.log(`next page will be scraped after 10secs`);
                                button.removeAttribute("data-scraped-product-start");
                                button.removeAttribute("data-scraped-product-current");
                                button.removeAttribute("data-scraped-product-end");
                                button.setAttribute("data-action","scrapURLs");
                                setTimeout(()=>{
                                    scrapProducts();
                                },10000)
                            }
                            else{
                                status.innerText = "Successfully scraped all products";
                                console.log(`All Done`);
                                stopScraping(false);
                            }
                        }


                    });
                    
                }).catch((err)=>{
                    console.log(`Error occured in downloading images`);
                    console.log(err);
                })
            }
            

        }

    }
}

const handleScrapRequest = (e) => {

    let elem = e.target;
    let start = document.getElementById("start-page");
    let end = document.getElementById("end-page");
    
    start = start.value;
    end = end.value;

    if(elem.getAttribute("data-first")){

        elem.removeAttribute("data-first");
        elem.setAttribute("data-start",start)
        elem.setAttribute("data-end",end);
        elem.setAttribute("data-page",start);
        scrapProducts();
    }
    else if(!elem.getAttribute("data-first")){
        scrapProducts();
    }
    


}

const loadMetaData = () => {
    
    let path = document.getElementById("metadata-input").value;
    
    fetch('/loadMetaData',{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            path
        })
    }).then((res)=>{
        if(res.status == 200){
            let btn = document.getElementById("metadata-btn");
            btn.setAttribute("disabled",true);
            btn.innerText = "Loaded Metadata";
        }
    }).catch((err)=>{
        alert(`Error occured while loading metadata`);
        console.log(err);
    })

}


const viewScrapedProducts = () => {
    
    let tableHeadData = document.getElementById("columns").getElementsByTagName("p");

    //for Column Names

    let headers = [];

    let temp_head_string = `<tr>`;
    Array.from(tableHeadData).forEach((hd)=>{
        temp_head_string += `<th>${hd.innerText}</th>`
    });

    temp_head_string += `</tr>`;

    // Body Content

    let bodyContent = [];

    for(let i=0 ; i<data.length ; i++){
        let temp_row = `<tr>`;
        for(let j=0 ; j<data[i].length ; j++){
            temp_row += `<td>${data[i][j]}</td>`
        }
        temp_row += `</tr>`
        bodyContent.push(temp_row);
    }

    let temp_body_string = ``;

    Array.from(bodyContent).forEach((bd)=>{
        temp_body_string += bd;
    })


    let temp_html = `<table class="table table-striped table-bordered" style="text-align:center">
        <thead>
            ${temp_head_string}
        </thead>
        <tbody>
            ${temp_body_string}
        </tbody>
    </table>`


    document.getElementById("product-data").innerHTML = temp_html;


}


const productImageSelect = (e) => {
    
    let elem = e.currentTarget;
    let clicked = elem.getAttribute("data-clicked");
    
    if(clicked == "yes"){

        elem.setAttribute("data-clicked","no");
        console.log(elem.children);
        
        for(let i=0 ; i<elem.children.length ; i++){
            
            if(elem.children[i].getAttribute("class") == "checked"){
                elem.removeChild(elem.children[i]);
            }
        }


    }
    else if(clicked == "no"){
        
        elem.setAttribute("data-clicked","yes");
        let html_text = `<div class="checked"><i class="fas fa-check"></i></div>`;
        elem.innerHTML += html_text;

    }


}

let hasFeaturedImage = false;

const featuredImageSelect = (e) => {
    
    e.preventDefault();

    let elem = e.currentTarget;
    let atr_check = elem.hasAttribute("data-featured");

    //for showing featured image
    if(atr_check == false && hasFeaturedImage == false){

        elem.setAttribute("data-featured",true);
        let temp_html = `<div class="featured"><i class="fas fa-bahai fa-lg"></i></div>`;
        elem.innerHTML += temp_html;
        hasFeaturedImage = true;

    } //for hiding the featured image
    else if(atr_check == true && hasFeaturedImage == true){
        
        elem.removeAttribute("data-featured");
        hasFeaturedImage = false;
        
        for(let i=0 ; i<elem.children.length ; i++ ){
            if(elem.children[i].getAttribute("class") == "featured"){
                elem.removeChild(elem.children[i]);
            }
        }


    }
    

}


const productImages = () => {
    
    let product_link = document.getElementsByClassName("user-input-field")[2].value;

    if(product_link.length < 2){
        alert("Please enter the individual product link to continue...");
        return;
    }

    fetch(`/productImages`,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : product_link
        })
    }).then((res)=>{
        
        res.json().then((data)=>{
            document.getElementById("input-product-image").value = data;
        })
    }).catch((err)=>{
        console.log(`error occured while getting product featured image..`);
    })


    
}


const applyAction = () => {
    
    //finding which action the user selects

    let user_action = document.getElementById("action-select").selectedIndex;

    let user_inputted_data = document.getElementById("user-input-field").value;
    let col_to_edit = document.getElementById("col-select").selectedIndex;

    let table_container = document.getElementById("product-data");
    let data_rows = table_container.getElementsByTagName("tbody")[0].getElementsByTagName("tr");


    for(let i=0 ; i<data_rows.length ; i++){

        let data_cols = data_rows[i].getElementsByTagName("td");
        let {innerText} = data_cols[col_to_edit];

        if(user_action == 0){
            data_cols[col_to_edit].innerText = `${innerText} ${user_inputted_data}`;
        }
        else if(user_action == 1){
            data_cols[col_to_edit].innerText = `${user_inputted_data} ${innerText}`;
        }
        else if(user_action == 2){

            let regEx = new RegExp(user_inputted_data,'gi');

            if(innerText.match(regEx)){
                
                let replace_text = prompt(`Enter new text you want to replace with\nEnter [null] to just remove the text or click CANCEL`);
                
                if(replace_text == "null" || replace_text == null){
                    data_cols[col_to_edit].innerText = innerText.replace(regEx,"");
                }
                else{
                    data_cols[col_to_edit].innerText = innerText.replace(regEx,replace_text);
                }
                
            }
            

        }
        else if(user_action == 3){
            
            let existing_symbol = prompt(`For an ideal mathematical calculation make sure that the field doesn't have any symbol or any other characters\nTo neglect symbol please enter the symbol so that we can neglect that\nEnter cancel if it doesn't have any symbol`);

            if(existing_symbol != null || existing_symbol != "null"){
                
                let d_op = ``;

                Array.from(innerText).forEach((it)=>{
                   if(it != existing_symbol){
                       d_op += it;
                   }
               })
              
                let ind = user_inputted_data.indexOf("_");
               
                if(ind == 0){
                    let new_exp = user_inputted_data.substr(1,user_inputted_data.length - 1);
                    let ans = eval(`${d_op} ${new_exp}`);
                    data_cols[col_to_edit].innerText = `${existing_symbol}${ans}`;
                }
                else if(ind == user_inputted_data.length - 1){
                    let new_exp = user_inputted_data.substr(0,user_inputted_data.length - 1);
                    let ans = eval(`${new_exp} ${d_op}`);
                    data_cols[col_to_edit].innerText = `${existing_symbol}${ans}`;
                }
            
            }
            
        }

    }


}

let pagePath = undefined;

const findRoutesOfPages = (that) => {
    
    let url = that.value;
    
    let path = {};
    
    if(url.match(/\?/gi)){
        
        path.type = "query";

        if(url.match(/page=[0-9]{1,5}/gi)){
            path.symbol = "page";
        }
        else if(url.match(/p=[0-9]{1,5}/gi)){
            path.symbol = "p";            
        }
        else{
            
            let input = undefined;
            
            while(input == undefined){

                input = prompt(`We couldn't recognize the route, please enter the route`);
                if(  input != null && input.length > 10 && (input.match("https://") || input.match("http://")) &&
                input.match("{")  && input.match("}")){
                    path = {
                        type : "custom",
                        url : input
                    }
                }
                else{
                    input = undefined;
                }

            }


        }

        pagePath = path;

    }
    
    else if(url.match(/\/page\//gi)){
        
        path = {
            type : "id",
            symbol : "page"
        }
    }

    else if(url.match(/\/p\//gi)){
        
        path = {
            type : "id",
            symbol : "p"
        }
    }

    else{
        
        let input = undefined;
            
            while(input == undefined){

                input = prompt(`We couldn't recognize the route, please enter the route`);
                if(  input != null && input.length > 10 && (input.match("https://") || input.match("http://")) &&
                input.match("{")  && input.match("}")){
                    
                    path = {
                        type : "custom",
                        url : input
                    }

                }
                else{
                    input = undefined;
                }

            }
        

    }

    return path;

}

let userProductFields = [];

const readData = (that) => {
    
    let {value} = that;
    let index = value.lastIndexOf(`\\`) +1;
    let val = value.substring(index,value.length);

    let reader = new FileReader();

    reader.onload = (e) => {
       
        fetch(`/loadMetaData`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json;charset=utf-8'
            },
            body : JSON.stringify({
                data : e.target.result
            })
        }).then((res)=>{

            if(res.status === 200){
               
                res.json().then((d)=>{
                    
                    let temp_obj = d["productFields"];

                    Object.entries(temp_obj).forEach((ob)=>{
                        let {name} = ob[1];
                        userProductFields.push(name);
                    });


                    //Populating the [select dropdown] of heading {CVS STUFF}

                    let colDropdownElem = document.getElementById("action-perform-col");
                    let temp_colDropdownElem = `<option selected disabled>Select Column</option>`;

                    for(let i=0 ; i<userProductFields.length ; i++){
                        temp_colDropdownElem += `<option>${userProductFields[i]}</option>`
                    }
                    temp_colDropdownElem += `<option>productimages</option>`;
                    colDropdownElem.innerHTML = temp_colDropdownElem;

                    userProductFields.push("productImages");


                }).catch((err)=>{
                    console.log(err);
                });

                alert(`Successfully Loaded MetaData`);
                document.getElementsByClassName("custom-file-label")[0].innerText = val;
                document.getElementById("metadata-input").setAttribute("disabled",true);
                let btn = document.getElementById("btn-load-metadata");
                btn.setAttribute("disabled",true);
                btn.innerText = `Loaded Data`;

            }
            else{
                alert(`ERROR OCCURED!`);
            }

        }).catch((err)=>{
            console.log(`error occured`);
            console.log(err);
            alert(`ERROR OCCURED`);
        })

    }
    
    reader.readAsText(that.files[0]);

}


const checkMetaData = () => {
    
    let dataToSend = fetchMarkupElements(false);
    let status = document.getElementById("modal-status");
    let btn = document.getElementById("modal-btn");
    let action = btn.getAttribute("data-action");
    
    if(action == "scrapFirstURLs"){
        
        status.innerText = `seding request for validating metadata...`;

        fetch(`/validateMetadataURLS`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json;charset=utf-8'
            },
            body : JSON.stringify({
                dataToSend
            })
        }).then((res)=>{

            if(res.status == 200){
                res.json().then((r)=>{
                    console.log(r);
                    console.log(`successfully scraped first page URLs`);
                    let firstPageURLs = r.links;
                    
                    let temp_html = `<h4>products links extracted from catalog:</h4><ul>`;
                    for(let i=0 ; i<firstPageURLs.length ; i++){
                        temp_html += `<li>${firstPageURLs[i]}</li>`
                    }
                    temp_html += `</ul>`

                    document.getElementById("fist-page-urls").innerHTML = temp_html;
                    status.innerText = `Successfully scraped urls from first page, next action will be started automatically`;
                    btn.setAttribute("data-action","scrapFirstProduct");

                    setTimeout(()=>{
                        checkMetaData();
                    },10000)

                })
            }
            else if(res.status == 204){
                alert(`An Error occured whle validating the product URLS, try again or check the server console for the error`);
            }


        }).catch((err)=>{
            console.log(`Error occured while validating the metadata`);
            console.log(err);
        });

    }
    else if(action == "scrapFirstProduct"){
        
        status.innerText = "Sending Request for scraping product details";

        fetch(`/validateMetadataProduct`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json;charset=utf-8'
            },
            body : JSON.stringify({
                dataToSend,
            })
        }).then((res)=>{
            
            res.json().then((r)=>{
                r = r[0];
                status.innerText = `Successfully found product details. `;
                
                let temp_html = `<h4>product details : </h4><ul>`;
                for(let i=0 ; i<r.length  ;i++){
                    temp_html += `<li>${r[i]}</li>`
                }
                temp_html += `</ul>`;
                document.getElementById("product-details").innerHTML = temp_html;
                btn.setAttribute("data-action","scrapImages");

                setTimeout(()=>{
                    checkMetaData();
                },10000);
                
            });
        }).catch((err)=>{
            console.log(err);
            alert(`Error occured, please try again`);
        })


    }
    else if(action == "scrapImages"){
        
        status.innerText = "Sending Request for scraping product images";

        fetch(`/validateMetadataImages`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json;charset=utf-8'
            },
            body : JSON.stringify({
                dataToSend
            })
        }).then((res)=>{
            res.json().then((r)=>{
                status.innerText = `Successfully scraped product images`;
                btn.setAttribute("data-action","scrapFirstURLs");

                let temp_html = `<h4>product images : </h4><ul>`;
                for(let i=0 ; i<r.length ; i++){
                    temp_html += `<li><img src="${r[i]}" style="width:50px;margin:5px;"/></li>`
                }
                temp_html += `</ul>`;
                document.getElementById("product-modal-img").innerHTML = temp_html;

                setTimeout(()=>{
                    //checkMetaData();
                },10000);

            });
        }).catch((err)=>{
            console.log(err);
            alert(`Error occured, please try again`);
        })


    }
   
}

const fetchMarkupElements = (validation) => {
     
    let user_inputs = document.getElementsByClassName("user-input-field");
    let input_mainContainer = document.getElementById("main-container");
    let input_individualProduct = document.getElementById("individual-product");
    let input_productImages = document.getElementById("input-product-image");
    let input_cols = document.getElementById("columns").getElementsByTagName("input");
    
    let inputFieldsToCheck = [...user_inputs,input_mainContainer,
        input_individualProduct,input_productImages,...input_cols]

    
    if(checkForEmpty(inputFieldsToCheck)){
        alert(`You can't leave above fields empty...`);
        return;
    }
    
    

    let dataToSend = {
        productCatalogURL : user_inputs[0].value,
        productSecondPageURL  : user_inputs[1].value,
        productSingleURL  : user_inputs[2].value,
        productBrandName  : user_inputs[3].value,
        productCatalog : input_mainContainer.value,
        productSingleContainer : input_individualProduct.value,
        productImagesContainer : input_productImages.value,
        cols : {

        }
    }

    
    let temp_cols = [];
    Array.from(input_cols).forEach((i_col)=>{
        let name  = i_col.parentElement.getElementsByClassName("btn-choose")[0].getAttribute("data-val");
        let val = i_col.value;

        temp_cols.push(
            {name,val}
        )

    }); 

    dataToSend.cols = {
        ...temp_cols
    }


    if(validation == true){

        //finding Route

        let url = findRoutesOfPages(document.getElementById("second-page"))
        console.log(url);
        if(url.type == "custom"){
            dataToSend.productPath = {
                path_type : "custom",
                url : url
            }
        }
        else if(url.type == "query"){
            dataToSend.productPath = {
                path_type : "defined",
                url : url
            }
        }
        else if(url.type == "id"){
            dataToSend.productPath = {
                path_type : "defined",
                url : url
            }
        }

    }

    
    return dataToSend;

}

const dropMetadata = () => {
    
    let uploadInputElem = document.getElementById("metadata-input");
    let uploadButtonElem = document.getElementById("btn-load-metadata");

    if(uploadButtonElem.hasAttribute("disabled") && uploadInputElem.hasAttribute("disabled")){

        fetch(`/dropMetadata`,{
            method : 'POST'
        }).then((res)=>{
            if(res.status == 200){
                uploadInputElem.removeAttribute("disabled");
                document.getElementsByClassName("custom-file-label")[0].innerText = "Choose File";
                uploadButtonElem.removeAttribute("disabled");
                userProductFields = [];
                alert("Metadata successfully dropped");
            }
            else{
                alert(`Error occured!, check server console`)
            }
        }).catch((err)=>{
            alert(`Error occured while droping the metadata file`);
            console.log(err);
        });

    }
    else{
        alert(`You've not uploaded a metadata yet..`);
    }

}