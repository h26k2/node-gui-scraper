const port = 3000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs");

const mainProduct = require("./controller/requests/mainProduct");
const individualProduct = require("./controller/requests/individualProduct");
const productDetail = require("./controller/requests/productDetail");
const productImages = require("./controller/requests/productImages");
const loadMetaData = require("./controller/requests/loadMetaData");
const saveMetaData = require("./controller/requests/saveMetaData");
const productPagination = require("./controller/requests/productPagination");

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));


let metaData = [];


mainProduct(app,puppeteer);
individualProduct(app,puppeteer);
productDetail(app,puppeteer);
productImages(app,puppeteer);
saveMetaData(app,fs);
loadMetaData(metaData,app);
productPagination(app,puppeteer);

let JSON_file;
/*
const selectMainContainer = async(url , uniqueCheck ) =>{

    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();

    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});

    page.on('console',(msg)=>{
        
        let val = msg.text();
        
        if(val.match("h26k2-data:")){
            
            let data = val.substr(val.indexOf(":")+1,val.length);  
            data = `type:mainContainer,val:${val}`;
            return data;
            /*
            metadata.push({
                type : 'mainContainer',
                val : data
            }); 
        }

    });
    
    await page.evaluate(( uniqueCheck )=>{
        
        let prev = undefined;
        
        window.addEventListener("mouseover",(e)=>{

            let current = e.target;
            
            if(current !== undefined && current.classList.contains("h26k2-color") != true){
                e.target.setAttribute("title",e.target.getAttribute("class"));
                current.classList.add("h26k2-color");
                prev = current;
            }
            
        });

        window.addEventListener("mouseout",(e)=>{
    
            if(prev !== undefined && prev.classList.contains("h26k2-color") == true){
                prev.classList.remove("h26k2-color");
            }
        
        });
        
        window.addEventListener("click",async(e)=>{
            
            let elem = e.target;
            
            if(elem !== undefined && elem.getAttribute("data-name") == undefined){

                let status = window.confirm("Select this element ? ");
                
                if(status == true){
                   
                    elem = elem.getAttribute("class");
                    elem = elem.replace("h26k2-color","")

                    let dom_elem = document.getElementsByClassName(elem);
                    
                    if(dom_elem.length == 1 || uniqueCheck == false){
                        
                        data = elem;
                        console.log(`h26k2-data:${data}`);
                        alert(`DONE! Now you can close the window\nData : ${data}`);
                        /*

                        try{
                            const blob = new Blob([`${filename}\n${data}`],{type : 'text/csv'});
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.setAttribute("data-name","csv");
                            a.setAttribute('hidden','');
                            a.setAttribute('href',url);
                            a.setAttribute('download',`${brandName}_${filename}.csv`);
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            alert(`successfully saved metafile as : ${brandName}_${filename}.csv\n You can now close this window`);
                            
//                            window.open("localhost:3000/fuck?qterimaki");
                            
                            
                        }
                        catch(err){
                            alert(`error occured while downloading meta file\n Check console for error`);
                            console.log(err);
                        }

                    }
                    else{
                        alert(`This element can't be select as there are some conflicts in XPATH`)
                    }


                }

            }

        });

    } , uniqueCheck  );
    
    
}
*/
const selectProduct = async (url,filename,brandName ) => {

    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();

    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});

    page.on('console',(msg)=>{
        
        let val = msg.text();
        
        if(val.match("h26k2-data:")){
            
            let data = val.substr(val.indexOf(":")+1,val.length); 
            console.log(data);   
            metadata.push({
                type : 'productCatalogProduct',
                val : data
            })
        }

    });

    await page.evaluate((filename,brandName)=>{
        
        let prev = undefined;
        
        window.addEventListener("mouseover",(e)=>{

            let current = e.target;
            
            if(current !== undefined && current.classList.contains("h26k2-color") != true){
                current.classList.add("h26k2-color");
                prev = current;
            }
            
        });

        window.addEventListener("mouseout",(e)=>{
    
            if(prev !== undefined && prev.classList.contains("h26k2-color") == true){
                prev.classList.remove("h26k2-color");
            }
        
        });

        window.addEventListener("click",async(e)=>{
            
            let elem = e.target;
            
            if(elem != undefined && elem.getAttribute("data-name") == undefined){

                let anchors = elem.getElementsByTagName("a");
                let element_classes = elem.getAttribute("class");

                for(let i=0 ; i<anchors.length ; i++){
                
                    let a_href = anchors[i].getAttribute("href");
                    let a_class = anchors[i].getAttribute("class");
    
                    let confirm_string = `URL : ${a_href}\nElement : ${a_class}\nDo you want to want to select this element ? `;
    
                    if(confirm(confirm_string)){

                        let product_string = `Please enter the name you want us to target on individual product from the given below data\n${element_classes}`;

                        let elem = prompt(product_string);
                        alert("done");
                        let data = `${a_class}|${elem}`;
                        console.log(`h26k2-data:${data}`);
                        /*
                        try{
                            const blob = new Blob([`${filename}\n${data}`],{type : 'text/csv'});
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.setAttribute("data-name","csv");
                            a.setAttribute('hidden','');
                            a.setAttribute('href',url);
                            a.setAttribute('download',`${brandName}_${filename}.csv`);
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);

                            alert(`successfully saved metafile as : ${brandName}_${filename}.csv\n You can now close this window`);
                            
                        }
                        catch(err){
                            alert(`error occured while downloading meta file\n Check console for error`);
                            console.log(err);
                        }*/

                        break;
                    }
                    else{
                        continue;
                    }
    
    
                }
    
            }
            
        });


    },filename,brandName);


}

const selectProductDetails = async (url , filename , brandName, uniqueCheck) => {

    let browser = await puppeteer.launch({headless: false  });

    let page = await browser.newPage();

    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});
    
    page.on('console',(msg)=>{
        
        let val = msg.text();
        
        if(val.match("h26k2-data:")){
            
            let data = val.substr(val.indexOf(":")+1,val.length);    
            metadata.push({
                
                type : 'productDetail',
                name : filename,
                val : data
                
            });
        }

    });

    await page.evaluate(()=>{

        let prev = undefined;

        window.addEventListener("mouseover",(e)=>{

            let current = e.target;
            
            if(current !== undefined && current.classList.contains("h26k2-color") != true){
                current.classList.add("h26k2-color");
                prev = current;
            }
            
        });

        window.addEventListener("mouseout",(e)=>{
    
            if(prev !== undefined && prev.classList.contains("h26k2-color") == true){
                prev.classList.remove("h26k2-color");
            }
        
        });

        window.addEventListener("click",async(e)=>{

            let elem = e.target;

            if(elem != undefined && elem.getAttribute("data-name") == undefined){

                let status = window.confirm("Select this element ? ");
                    
                if(status == true){
                    console.log(`this is element`);
                    console.log(elem);
                    console.log(elem.parentElement);
                    let structureDetails = [];
                    
                    while(true){
                        
                        if(elem.parentElement.nodeName == "HTML"){
                            break;
                        }

                        console.log(`****************`);
                        console.log(elem.parentElement);
                        console.log(`index of element is : ${[...elem.parentElement.children].indexOf(elem)}`)

                        structureDetails.push(
                            {
                                elem : elem.parentElement.nodeName,
                                index : [...elem.parentElement.children].indexOf(elem)
                            }
                        );

                        elem = elem.parentElement;

                    }
                    
                    let structureString = ``;
                    
                    for(let i=structureDetails.length  - 1; i>= 0 ; i--){
                        
                        let elem = structureDetails[i].elem;
                        let index = structureDetails[i].index;

                        structureString += `${elem}[${index}]/`
                    }

                    structureString = structureString.substr(0,structureString.length - 1);
                    alert(`Done! Xpath is : ${structureString}`);
                    console.log(`h26k2-data:${structureString}`);

                }

            }

        });

    });

    

}

const selectImages = async (url,filename,isFeatured) => {
   
  

    
    


    


}

app.get("/",async(req,res) => {
    res.render("home");
});

app.get("/findPagesCount",async(req,res)=>{

    console.log(`==> Finding Pages Count <==`);
    
    req.setTimeout(0);

    let {baseURL , paginationElem} = metaData[0];
    
    try{

        let browser = await puppeteer.launch({headless: false});

        let page = await browser.newPage();

        await page.goto(baseURL,{waitUntil : 'networkidle2' , timeout : 0 });
        
        await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});
        
        let data = await page.evaluate((paginationElem)=>{

            let elems = paginationElem.split("/");
            let temp_index = [];
            let temp = document.body;

            Array.from(elems).forEach((elem)=>{
                let s = elem.indexOf(`[`) + 1;
                let e = elem.length - 1;
                temp_index.push(parseInt(elem.substr(s,e)));
            });
            let ind;
            for(let i=0 ; i<temp_index.length ; i++){
                ind = temp_index[i];
                temp = temp.children[ind];
            }
            
            let val = temp.innerText ;

            return{
                val
            }

        },paginationElem);

        await browser.close();
        console.log(`==> TOTAL PAGES ARE : ${data.val}`);
        res.status(200).json(data);
    }
    catch(err){
        console.log(`Error Occured while finding pages count`);
        console.log(err);
        res.status(500).end();
    }


});



let requested = false;
app.post("/scrapProducts",async(req,res)=>{
    
    if(requested == false){
        
        console.log(`==> REQUEST RECIEVED FOR SCRAPING <==`);

        req.setTimeout(0);
        let allProducts = [];

        requested = true;
    
        let {page} = req.query;
        let {productPath , baseURL} = metaData[0];

        let url = baseURL;
        


    } //requested delimeter
    

});



/*
app.post("/featuredImage",async(req,res)=>{

    let {url} = req.body;

    req.setTimeout(0);
    
    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();
    
    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});
    
    page.on('console',(msg)=>{

        let data = msg.text();

        if(data.match("h26k2-data")){

            data = data.replace("h26k2-data:","");
            res.json(data);

        }

    });

    await page.evaluate(()=>{

        let prev = undefined;
       
        window.addEventListener("mouseover",(e)=>{

            let current = e.target;
            
            if(current !== undefined && current.classList.contains("h26k2-color") != true){
                e.target.setAttribute("title",e.target.getAttribute("class"));
                current.classList.add("h26k2-color");
                prev = current;
            }
            
        });

        window.addEventListener("mouseout",(e)=>{
    
            if(prev !== undefined && prev.classList.contains("h26k2-color") == true){
                prev.classList.remove("h26k2-color");
            }
        
        });

        window.addEventListener("click",async(e)=>{
           
            let elem = e.target;
            
            if(elem !== undefined && elem.getAttribute("data-name") == undefined){

                let status = window.confirm("Select this element ? ");
                
                if(status == true){
                    console.log(elem);
                    let elem_classes = elem.getAttribute("class");
                    elem_classes = elem_classes.replace("h26k2-color","");

                    elem.setAttribute("class",elem_classes);
                    
                    let images = elem.getElementsByTagName("img");
                    console.log(images);

                    if(images.length < 1){
                        alert(`The container which you've selected doesn't have any image element`);
                    }
                    else{

                    }
                    

                }

            }

        });

    })


});

*/
app.listen(port,()=>{
    console.log(`node app is live at port : ${port}`);
});
