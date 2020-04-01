
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
    let rowElem = colElem.getElementsByClassName("btn-danger");
    
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
let currentImagesToDownload = undefined;

const scrapProducts = () => {

    let statusElem = document.getElementById("scraping-status").getElementsByTagName("td")
    let status = statusElem[0];
    let pageScrapedStatus = statusElem[1];
    let totalPageStatus = statusElem[2];
    let totalProductStatus = statusElem[3];


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
    let has_page_count = button.hasAttribute("data-page-count");
    let has_page_current = button.hasAttribute("data-page-current"); 


    if( (has_page_start == false || has_page_end == false || has_page_count == false || 
        has_page_current == false) && action == "findPageCount" ){

        console.log(`finding pages count`);
        status.innerText = `Finding Pages Count`;
        fetch(`/findPagesCount`).then((res)=>{
            
            if(res.status == 200){
                console.log(res);
                res.json().then((d)=>{
                    console.log(`Total Pages are : ${d.val}`);
                    status.innerText = `Successfully found total pages, next action will be started automatically after 10s`;
                    totalPageStatus.innerText = d.val;
                    /*
                    button.setAttribute("data-page",s_page);
                    button.setAttribute("data-start",s_page);
                    button.setAttribute("data-end",e_page);
                    button.setAttribute("data-count",d.val);*/
                    
                    button.setAttribute("data-page-start",s_page);
                    button.setAttribute("data-page-end",e_page);
                    button.setAttribute("data-page-current",s_page);
                    button.setAttribute("data-page-count",d.val);
                    button.setAttribute("data-action","scrapURLs");
                    setTimeout(()=>{
                        scrapProducts();
                    },10000)

                });
            }
            
            
        }).catch((err)=>{
            status.innerText = `Error occured, finding pages count. Please check console or try again`;
            console.log(err);
        });


    }

    let page_current = parseInt(button.getAttribute("data-page-current"));
    let page_start = parseInt(button.getAttribute("data-page-start"));
    let page_end = parseInt(button.getAttribute("data-page-end"));
    let page_count = parseInt(button.getAttribute("data-page-count"));

    if(action == "scrapURLs"){

        if(page_current >= page_start && page_current <= page_end && page_current <= page_count){
        
            console.log(`sending request for page : ${page_current}`);
            status.innerText = `Scraping page(${page_current})`;
    
            fetch(`/scrapURLs?page=${page_current}`,{method : 'POST',}).then((res)=>{
                
                if(res.status == 200){

                    res.json().then((data)=>{
                        console.log(`successfully scraped ${data.length} URLS from page : ${page_current} `);
                        status.innerText = `successfully scraped ${data.length} URLS from page : (${page_current}) \nTiming Out for 10secs`;
                        console.log(`timing out for 10sec`);
                        //products_scraped.push(...data);
                        productUrlsToScrap.push(...data);
                        setTimeout(()=>{
                            /*
                            button.setAttribute("data-action","scrapProduct");
                            button.setAttribute("data-product-scraped","0");
                            */

                            button.setAttribute("data-action","scrapProduct");
                            button.setAttribute("data-scraped-product-start","0");
                            button.setAttribute("data-scraped-product-current","0");
                            button.setAttribute("data-scraped-product-end",data.length - 1);
                            scrapProducts();

                        },10000);
        
                    });

                }
                else if(res.status == 500){
                    status.innerText = `Error occured while finding pages count, Please check server console or try again`;
                }
                
            }).catch((err)=>{
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

            fetch(`/scrapProductDetails`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body : JSON.stringify({link : productUrlsToScrap[scraped_product_current]})
            }).then((res)=>{
                
                console.log(`==> product ${scraped_product_current} successfully scraped of page : ${page_current} <==`);

                res.json().then((data)=>{

                    products_scraped.push(...data);
                    console.log(`Timing out for 10secs, image scraping will start automatically`);

                    setTimeout(()=>{
                        button.setAttribute("data-action","scrapImages");
                        scrapProducts();
                    },10000);             
                });

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
            fetch(`/scrapImages`,{
                method  : 'POST',
                headers : {
                    'Content-type' : 'application/json;charset=utf-8' 
                },
                body : JSON.stringify({link : productUrlsToScrap[scraped_product_current] })
            }).then((res)=>{
                
                res.json().then((imageRes)=>{
                    console.log(`successfully scraped product images, it will be downloaded automatically after 10secs`);
                    all_products_url_images.push([...imageRes]);
                    currentImagesToDownload = [...imageRes]
                    //products_scraped[scraped_product_current] = [...products_scraped[scraped_product_current],[...imageRes]];
                    
                    setTimeout(()=>{
                        button.setAttribute("data-action","downloadImages");
                        scrapProducts();
                    },10000)

                });
                
            }).catch((err)=>{
                console.log(`Error occured in downloading images`);
                console.log(err);
            })
        }
        

    }
    else if(action == "downloadImages"){
        
        if(currentImagesToDownload != undefined){
            
            console.log(`sending request for downloading images....`);

            fetch(`/downloadImages`,{
                method : 'POST',
                headers : {
                    'Content-Type' : 'application/json;charset=utf-8'
                },
                body : JSON.stringify({links : currentImagesToDownload ,})
            }).then((res)=>{
                console.log(`Images Downloaded Successfully`);
                console.log(res);
                console.log(`timing out for 10 secs`);
                setTimeout(()=>{

                    currentImagesToDownload = undefined;
                    
                    let current_product = parseInt(button.getAttribute("data-scraped-product-current"));
                    let last_product = parseInt(button.getAttribute("data-scraped-product-end"));

                    let user_page_current = parseInt(button.getAttribute("data-page-current"));
                    let user_page_end = parseInt(button.getAttribute("data-page-end"));
                    let page_count = parseInt(button.getAttribute("data-page-count"));

                    //checking that the current scraped product is less than or equal to last product
                    //if in range then scrap otherwise go to else condition
                    if(current_product <= last_product ){
                        current_product++;
                        button.setAttribute("data-scraped-product-current",current_product);
                        button.setAttribute("data-action","scrapProduct");
                        console.log(`app will scrap next product`)
                        scrapProducts();
                    }
                    else{
                        
                        //if page is in range then then scrap increment next page and then start other page
                        //else go to another condition
                        if(user_page_current <= user_page_end && user_page_current <= page_count){
                            button.setAttribute("data-action","scrapURLs");
                            console.log(`next page scraping is going to be started...`);
                            user_page_current++;
                            button.setAttribute("data-page-current",user_page_current);
                            scrapProducts();
                        }
                        else{
                            console.log(`all done`);
                        }
                        
                    }
                    


                },10000)
            }).catch((err)=>{
                console.log(`Error occured while downloading current images`);
                console.log(err);
            })


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

let data = [
   ["Bottega Vaenta Butter","$389.00","Categories Bags Bottega Veneta",`Description Product code #191213-20 100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe) Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request. Counter Quality Replica (True Mirror Image Replica) Dimensions: 31.5x37x10 Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today! Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`]
]


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

const something = () => {
    
    let s_page = document.getElementById("second-page").value;
    let url = {};

    if(s_page.match(/\?/gi)){
        
        url.type = "query";

        if(s_page.match(/page=[0-9]{1,5}/gi)){
            
            url.symbol = "page";
        }
        else if(s_page.match(/p=[0-9]{1,5}/gi)){
            
            url.symbol = "p";            
        }

    }
    else if(s_page.match(/\/page\//gi)){
        
        url = {
            type : "id",
            symbol : "page"
        }
    }
    else if(s_page.match(/\/p\//gi)){
        
        url = {
            type : "id",
            symbol : "p"
        }
    }
    else{
        alert(`We're unable to analyse the route path of the website...`);
        let custom_path  = prompt(`Please enter the custom path `);
        url = {
            type : "custom",
            symbol : custom_path
        }
    }
    
    console.log(url);

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

let firstPageURLs  ;
const checkMetaData = () => {
    
    let dataToSend = fetchMarkupElements(false);
    let status = document.getElementById("modal-status");
    let btn = document.getElementById("modal-btn");
    let action = btn.getAttribute("data-action");
    status.innerText  = "Please Wait...";

    if(action == "scrapFirstURLs"){

        console.log(`seding request for validating metadata...`);

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
                    firstPageURLs = r.links;
                    
                    let temp_html = `<ul>`;
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
                status.innerText = `Successfully found product details. of this product \n ${dataToSend.productSingleURL}\n Next action will be started automatically`;
                
                let temp_html = `<ul>`;
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
                status.innerText = `Successfully scraped product images, next action will be started automatically`;
                btn.setAttribute("data-action","findSecondURL");

                let temp_html = `<ul>`;
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
    else if(action == "scrapFirstProduct1"){
        
        status.innerText = "Sending Request for scraping product details";

        fetch(`/validateMetadataProduct`,{
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json;charset=utf-8'
            },
            body : JSON.stringify({
                dataToSend
            })
        }).then((res)=>{

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

    if(validation == true){
        if(checkForEmpty(inputFieldsToCheck)){
            alert(`You can't leave above fields empty...`);
            return;
        }
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

    return dataToSend;

}

