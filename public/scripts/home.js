
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

    let inputs = document.getElementsByClassName("main-container-chooser");
    inputs = [inputs[0],inputs[1]];

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    let brandName = inputs[1].value;

    console.log(`website url is : ${websiteURL}`);
    console.log(`brand name is : ${brandName}`);
    
    fetch(`/mainProducts`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : websiteURL,
            filename : 'mainContainerChooser',
            brand : brandName
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

    let inputs = document.getElementsByClassName("main-container-chooser");

    inputs = [inputs[0],inputs[1],inputs[2]];

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    
    let websiteURL = inputs[0].value;
    let brandName = inputs[1].value;
    let demoProductURL = inputs[2].value;

    fetch(`/saveMetaData`,{
        method  : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : websiteURL,
            brand : brandName,
            p_url : demoProductURL
        })
    }).then((res)=>{
        if(res.status == 200){
            res.json().then((data)=>{
                console.log(data);
                let btn = document.getElementById("metadata-btn");
                btn.innerText = "Loaded Data";
                btn.setAttribute("disabled",true);
                document.getElementById("metadata-input").value = data.replace(/\"/gi,"");
            })
        }
    });



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

            <div class="col-3">
                <button class="btn btn-success w-100" onClick="productDetailLink(event)" data-sku="${sku}" data-val="${value}" >
                    <i class="fas fa-map-marker-alt"></i> Choose Element
                </button>
            </div>

            <div class="col-3">
                <button class="btn btn-danger w-100" onClick="delCol(event)" data-sku="${sku}">
                    <i class="far fa-trash-alt"></i> Delete Column
                </button>
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

const productPageLink = () => {
    
    let inputs = document.getElementsByClassName("main-container-chooser");
    inputs = [inputs[0],inputs[1]];

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    let brandName = inputs[1].value;

    console.log(`website url is : ${websiteURL}`);
    console.log(`brand name is : ${brandName}`);

    fetch(`/productPageLink`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : websiteURL,
            filename : 'productPageLink',
            brand : brandName
        })
    });

}

const productDetailLink = (e) => {

    let {target} = e;
    let {nodeName} = target;
    let elem ;

    if(nodeName == "BUTTON"){
        elem = target;
    }
    else{
        elem = currentTarget;
    }


    let inputs = document.getElementsByClassName("main-container-chooser");
    inputs = [inputs[0],inputs[1],inputs[2]];
    console.log(inputs);
    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    let brandName = inputs[1].value;
    let demoProductURL = inputs[2].value;

    console.log(`website url is : ${websiteURL}`);
    console.log(`brand name is : ${brandName}`);
    console.log(`demo product url : ${demoProductURL}`);

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
            sku : sku,
            url : demoProductURL,
            brand : brandName,
        })
    })


}

let products_scraped = [];

const scrapProducts = () => {

    let button = document.getElementById("scrap-products-btn");

    let page = parseInt(button.getAttribute("data-page"));
    let startPage = parseInt(button.getAttribute("data-start"));
    let endPage = parseInt(button.getAttribute("data-end"));

    if(page >= startPage && page <= endPage){
        
        console.log(`sending request for page : ${page}`);
        
        fetch(`/scrapProducts?page=${page}`,
        {
            method : 'POST',
            
        }).then((res)=>{
            res.json().then((data)=>{
                console.log(`successfully scraped ${data.length} products`);
                console.log(`timing out for 10sec`);
                products_scraped.push(...data);
                setTimeout(()=>{
                    page++;
                    button.setAttribute("data-page",page);
                    scrapProducts();
                },10000)

            });
        }).catch((err)=>{
            console.log(`error : ${err}`);
        })

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

let some = ``;

let images = ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
"https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
"https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
"https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
"https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
"https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg"]



let modal_body = document.getElementsByClassName("modal-body")[0];


const something = (e) => {
    
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

const s1 = (e) => {
    
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


const productFeaturedImage = () => {
    
    let product_link = document.getElementsByClassName("main-container-chooser")[2].value;

    if(product_link.length < 2){
        alert("Please enter the individual product link to continue...");
        return;
    }


    fetch(`/featuredImage`,{
        method : 'POST',
        headers : {
            'Content-type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : product_link
        })
    }).then((res)=>{
        console.log(`this is response `);
        console.log(res);
        res.json().then((data)=>{
            console.log(data);
            some = data;

            let xpath_index = data.indexOf("||");
            let xpath = data.substr(0,xpath_index);
            console.log(xpath);

            let image_paths = data.substr(xpath_index + 2 , data.length);
            let images = image_paths.split(",");
            console.log(images);


        })
    }).catch((err)=>{
        console.log(`error occured while getting product featured image..`);
    })


    
}