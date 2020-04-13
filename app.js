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

    let index ;

    if(productCatalog.includes("xpath")){
        let xpath = productCatalog.substr(productCatalog.indexOf("|") +1,productCatalog.length - 1);
        index = xpathToIndex(xpath);
    }

    try{
    
        let browser = await puppeteer.launch({headless: false});
        let page = await browser.newPage();

        await page.goto(productCatalogURL,{waitUntil : 'networkidle0' , timeout : 0 });
        
        let productURLs = await page.evaluate((productCatalog,productSingleContainer,index)=>{
            console.log(index);
            let product_links = [];
            let mainContainer ;

            if(productCatalog.includes("xpath") == false){
                mainContainer =  document.getElementsByClassName(productCatalog)[0];
            }
            else{
                let temp_elem = document.body;
                for(let i=0 ; i<index.length ; i++){
                    temp_elem = temp_elem.children[index[i]];
                }
                if(temp_elem != undefined){
                    mainContainer = temp_elem;
                }
                else{
                    alert(`There are conflits while getting the xpath`);
                    return;
                }
            }

            
            let st_in = productSingleContainer.indexOf("\[");
            let st_en = productSingleContainer.indexOf("\]");

            if(st_in < 0 || st_en < 0){
                console.log(`unvalid`);
                return `h26k2-unvalid|can't find main container`;
            }

            let productClass = productSingleContainer.substring(st_in +1 , st_en );
            let products = mainContainer.getElementsByClassName(productClass);
            console.log(products);
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
                
                let val = productSingleContainer.substr(productSingleContainer.indexOf("|") + 1,productSingleContainer.length - 1);

                product_anchor = {
                    type : 'class',
                    value : val
                }

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
                let {value} = product_anchor;

                Array.from(products).forEach((p)=>{
                    if(p != undefined){
                        let temp_anchor = p.getElementsByClassName(value)[0];
                        if(temp_anchor != undefined){
                            product_links.push(temp_anchor.getAttribute("href"));
                        }
                    }
                })

            }
            
            return {
                links : product_links
            }


        },productCatalog,productSingleContainer,index);


        await browser.close();
            
            
        if(productURLs.links.length > 1){

            let baseURL = url;
            
            if(baseURL.includes("http://")){
                baseURL = baseURL.replace("http://","");
            }
            else if(baseURL.includes("https://")){
                baseURL = baseURL.replace("https://","");
            }
        
            let domain = baseURL.substr(0,baseURL.indexOf("/")).trim();

            if(productURLs.links[0].includes(domain)){
                res.json(productURLs);
            }
            else{
                
                let p_urls = [];

                for(let l of productURLs.links){
                    
                    l = l.trim();

                    if(l.includes("https://")){
                        l = l.replace("https://","");
                    }
                    else if(l.includes("http://")){
                        l = l.replace("http://","");
                    }

                    if(l[0] == "/"){
                        p_urls.push(`https://${domain}${l}`)
                    }
                    else{
                        p_urls.push(`https://${domain}/${l}`)
                    }
                }

                res.json({links : p_urls});;

            }



        }
        else{
            res.json(productURLs);
        }



        /*
        if(productURLs.links.length > 1){
            
            if(productURLs.links[0].includes("https://") == false || productURLs.links[0].includes("http://") == false ){
                
                let p_urls = [];
                let mainURL = productCatalogURL;
                let partToAdd ;
                
                if(mainURL.includes("https://")){
                    mainURL = mainURL.replace("https://","");
                }
                else if(mainURL.includes("http://")){
                    mainURL = mainURL.replace("http://","");
                }
                
                partToAdd = mainURL.substr(0,mainURL.indexOf("/")).trim();
                
                for(let u of productURLs.links){
                    u  = u.trim();
                    if(u[0] == "/"){
                        p_urls.push(`https://${partToAdd}${u}`);
                    }
                    else{
                        p_urls.push(`https://${partToAdd}/${u}`)
                    }
                    
                }
                console.log(`==> Succesfully found product URLS <==`);
                console.log(p_urls);
        
                res.status(200).json({links : p_urls});
        
                await browser.close();
            }
            else{

                console.log(`==> Succesfully found product URLS <==`);
                console.log(productURLs);
                res.status(200).json(productURLs);
                await browser.close();

            }
        }
        else{
            console.log(`==> Succesfully found product URLS <==`);
            console.log(productURLs);
    
            res.status(200).json(productURLs);
    
            await browser.close();
        }*/

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
