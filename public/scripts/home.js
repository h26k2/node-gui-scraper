
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
        
        fetch(`/scrapProducts?page=${1}`).then((data)=>{
    
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

