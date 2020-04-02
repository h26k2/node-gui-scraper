const port = 8080;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");

const mainProduct = require("./controller/requests/mainProduct");
const individualProduct = require("./controller/requests/individualProduct");
const productDetail = require("./controller/requests/productDetail");
const productImages = require("./controller/requests/productImages");
const loadMetaData = require("./controller/requests/loadMetaData");
const saveMetaData = require("./controller/requests/saveMetaData");
const scrapImages = require("./controller/requests/scrapImages");
const downloadImages = require("./controller/requests/downloadImages");
const scrapProductDetails = require("./controller/requests/scrapProductDetails")
const findProductURLs = require("./controller/requests/findProductURLs");
const xpathToIndex = require("./controller/methods/xpathToIndex");

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

scrapImages(app,metaData,xpathToIndex,puppeteer);
downloadImages(app,axios,fs);
scrapProductDetails(app,metaData,puppeteer,xpathToIndex)


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

        await page.goto(baseURL,{waitUntil : 'networkidle0' , timeout : 0 });
        
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

urlScrapRequest = false;

app.post("/scrapURLs",(req,res)=>{
    
    if(urlScrapRequest == false){

        req.setTimeout(0);

        console.log(`==> Request Recieved for scraping product URLs <==`);
        urlScrapRequest = true;
        
        let {productPath , baseURL } = metaData[0];
        let {page} = req.query;

        findProductURLs(productPath,baseURL,metaData,page,puppeteer).then((data)=>{
            
            console.log(`==> Successfully scraped product URLs <==`);
            let {links} = data; 
            console.log(links);
            
            console.log("*************************************************");
            console.log(`==> Successfully Sent Response to the client <==`)
            console.log("**************************************************");
            urlScrapRequest = false;
            res.status(200).json(links);

        }).catch((err)=>{
            console.log(`==> Error Occured while scraping URLs <==`);
            console.log(err);
            res.status(500).end();
            urlScrapRequest = false;
        });


    }

});



app.post("/dropMetadata",(req,res)=>{

    console.log(`==> Request recieved for droping metadata <==`);
    metaData = []; 
    console.log(`==> Successfully dropped metadata file <==`);
    res.status(200).end();

});


app.post(`/validateMetadataURLS`,async(req,res)=>{
    
    console.log(`==> Request recieved for validating catalog urls metadata <==`);
    req.setTimeout(0);

    let {productCatalogURL , productCatalog , productSingleContainer} = req.body.dataToSend;

    try{
    
        let browser = await puppeteer.launch({headless: false});
        let page = await browser.newPage();

        await page.goto(productCatalogURL,{waitUntil : 'networkidle0' , timeout : 0 });

        let productURLs = await page.evaluate((productCatalog,productSingleContainer)=>{

            let product_links = [];
            let mainContainer = document.getElementsByClassName(productCatalog)[0];
            
            let st_in = productSingleContainer.indexOf("\[");
            let st_en = productSingleContainer.indexOf("\]");

            if(st_in < 0 || st_en < 0){
                console.log(`unvalid`);
                return `h26k2-unvalid|can't find main container`;
            }

            let productClass = productSingleContainer.substring(st_in +1 , st_en );
            let products = mainContainer.getElementsByClassName(productClass);

            if(products.length < 0 == true){
                return `h26k2-unvalid|can't find products`
            }

            let product_anchor = {};

            if(productSingleContainer.includes("xpath")){

                let val = productSingleContainer.substr(productSingleContainer.indexOf("|") + 1,productSingleContainer.length - 1);

                product_anchor = {
                    type : 'xpath',
                    value : val
                }

            }
            else{
                //FOR CLASS REMAINING
            }

            if(product_anchor.type == "xpath" ){
                
                let xpath_elem = product_anchor.value;
                xpath_elem.substr(product_anchor.value.indexOf("|"+1),product_anchor.value.length - 1);

                let xpath_elems = xpath_elem.split("/");
                let xpath_elem_index = [];

                Array.from(xpath_elems).forEach((elem)=>{
                    
                    let s = elem.indexOf(`[`) + 1;
                    let e = elem.length - 1;

                    xpath_elem_index.push(parseInt(elem.substr(s,e)))

                });
                
                Array.from(products).forEach((p)=>{

                    if(p !== undefined ){
                        let temp = p;
                        for(let i=0 ; i<xpath_elem_index.length ; i++){
                            temp = temp.children[xpath_elem_index[i]];
                        }
                        product_links.push(temp.getAttribute("href"));
                        
                    }

                });

            }
            else{

            }

            return {
                links : product_links
            }


        },productCatalog,productSingleContainer);

        console.log(`==> Succesfully found product URLS <==`);
        console.log(productURLs);

        res.status(200).json(productURLs);

        await browser.close();

    }
    catch(err){
        console.log(`error : ${err}`);
        res.status(204).end();
    }

});

app.post(`/validateMetadataProduct`,async(req,res)=>{
    
    console.log(`==> Request recieved for validating product details metadata <==`);

    req.setTimeout(0);

    let {productSingleURL , cols} = req.body.dataToSend;

    //finding indexes 

    let indexes = [];
    let objCount = 0;

    Object.entries(cols).forEach((field)=>{
        let {val} = field[1];
        indexes[objCount] = xpathToIndex(val);
        objCount++;
    });

    //scraping stuff

    let productDetails = [];

    try{
        
        let browser = await puppeteer.launch({headless: false});
        let page = await browser.newPage();

        await page.goto(productSingleURL,{waitUntil : 'networkidle0' , timeout : 0 });

        page.on('console',async(msg)=>{
            let data = msg.text();
            if(data.match("h26k2-data")){
                data = data.replace("h26k2-data:","")
                data = data.split("[--]");
                productDetails.push([...data]);
                await browser.close();
                console.log(`successfuly found product details...`);
                res.status(200).json(productDetails);
            }

        })

        await page.evaluate((indexes)=>{

            let temp_product_details = [];

            for(let i=0 ; i<indexes.length ; i++){
                temp = document.body;
                for(let j=0 ; j<indexes[i].length ; j++){
                    let temp_index = indexes[i][j];
                    temp = temp.children[temp_index];
                }
                temp_product_details.push(temp.innerText);
                console.log(temp_product_details);
            } 

            let temp_str = ``;
            
            for(let i=0 ; i<temp_product_details.length ; i++){   
                if(i == temp_product_details.length - 1){
                    temp_str += `${temp_product_details[i]}`;
                }
                else{
                    temp_str += `${temp_product_details[i]}[--]`;
                }
            }

            console.log(`h26k2-data:${temp_str}`);

        },indexes)

    }
    catch(err){
        console.log(`error occured`);
        console.log(err);
        res.status(500).end();
    }


});

app.post(`/validateMetadataImages`,async(req,res)=>{

    req.setTimeout(0);

    let {productSingleURL , productImagesContainer } = req.body.dataToSend;
    console.log(`==> Request recieved for validating images metadata <==`);

    let index = xpathToIndex(productImagesContainer);

    try{
        
        let browser = await puppeteer.launch({headless: false  });
        let page = await browser.newPage();
        await page.goto(productSingleURL,{waitUntil : 'networkidle0' , timeout : 0 });


        page.on('console',(msg)=>{
                    
            let data = msg.text();

            if(data.match("h26k2-data")){

                data = data.replace("h26k2-data:","")
                data = data.split("[--]");
                page.close();
                browser.close();
                console.log(`successfully scraped product images`);
                res.status(200).json(data);
            }

        });


        await page.evaluate((index)=>{
            
            let temp_image_element = null ;
            let temp = document.body;
            
            for(let i=0 ; i<index.length ; i++){
                temp = temp.children[index[i]];    
            }

            temp_image_element= temp.getElementsByTagName("img");

            let img_src = [];
        
            Array.from(temp_image_element).forEach((elem)=>{
                img_src.push(elem.getAttribute("src"));
            })

            let temp_str = ``;
            for(let i=0 ; i<img_src.length ; i++){
                    
                if(i == img_src.length - 1){
                    temp_str += `${img_src[i]}`;
                }
                else{
                    temp_str += `${img_src[i]}[--]`;
                }

            }

            console.log(`h26k2-data:${temp_str}`);

        },index);

    }
    catch(err){
        console.log(`Error occured`);
        console.log(err);
        res.status(500).end();
    }


});


app.listen(port,()=>{
    console.log(`node app is live at port : ${port}`);
});
