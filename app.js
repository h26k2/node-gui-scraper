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
const productPagination = require("./controller/requests/productPagination");

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
productPagination(app,puppeteer);


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
            urlScrapRequest = true;
            res.status(200).json(links);

        }).catch((err)=>{
            console.log(`==> Error Occured while scraping URLs <==`);
            console.log(err);
            res.status(500).end();
            urlScrapRequest = true;
        })


    }

});


//creating a global variable so that the client don't send multiple request
let spd_request = false;

app.post(`/scrapProductDetails`,async(req,res)=>{

    if(spd_request == false){

        req.setTimeout(0);

        let {link} = req.body;
        console.log(`===> Request recieved for scraping details : [${link}] <===`);

        //finding indexes of the product details

        let indexes = [];
        let {productFields} = metaData[0];
        let objCount = 0;
        
        Object.entries(productFields).forEach((field)=>{
            let {val} = field[1];
            indexes[objCount] = xpathToIndex(val);
            objCount++;
        });
       
        
        /*****************
         * Scraping Stuff
        ******************/

        let productDetails = [];

        try{
            
            let browser = await puppeteer.launch({headless: false  });

            let page = await browser.newPage();
            await page.goto(link,{waitUntil : 'networkidle0' , timeout : 0 });

            //page console
            page.on('console',(msg)=>{
                
                let data = msg.text();

                if(data.match("h26k2-data")){

                    data = data.replace("h26k2-data:","")
                    data = data.split("[--]");
                    productDetails.push([...data]);
                    console.log("**************************************************");
                    console.log(`==> Successfully scraped product details <==`);
                    console.log("**************************************************");
                    //spd_request = false;
                    page.close();
                    browser.close();
                    res.status(200).json(productDetails);

                }

            }) ;

            //page evaluation method pupeeteer
            await page.evaluate((indexes)=>{
                
                let temp_product_details = [];

                //Saving data into temporary variable
                for(let i=0 ; i<indexes.length ; i++){
                    temp = document.body;
                    for(let j=0 ; j<indexes[i].length ; j++){
                        let temp_index = indexes[i][j];
                        temp = temp.children[temp_index];
                    }
                    temp_product_details.push(temp.innerText);
                    console.log(temp_product_details);
                } 
                
                //chaning the aray into string so that data can easily be retrieved
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

            },indexes);


        }
        catch(err){
            res.status(500).end();
            console.log(`==> Error occured while scraping product details <==`);
            console.log(err);
            //spd_request = false;
        }


    }

});


let si_request = false;

app.post('/scrapImages',async(req,res)=>{

    if(si_request == false){
        
        req.setTimeout(0);
        
        let {link} = req.body;
        console.log(`==> Request recieved for scraping images , [${link}] <===`);
        
        let {productImages} = metaData[0];
    
        let index = xpathToIndex(productImages);
        
        try{
    
            let browser = await puppeteer.launch({headless: false  });
    
            let page = await browser.newPage();
            await page.goto(link,{waitUntil : 'networkidle0' , timeout : 0 });
            
            page.on('console',(msg)=>{
                
                let data = msg.text();
    
                if(data.match("h26k2-data")){
    
                    data = data.replace("h26k2-data:","")
                    data = data.split("[--]");
    
                    console.log("**************************************************");
                    console.log(`==> Successfully scraped product images <==`);
                    console.log("**************************************************");
                    
                    page.close();
                    browser.close();
                    res.status(200).json(data);
                }
    
            }) 
            
            await page.evaluate((index)=>{
                
                let temp_image_element = null ;
                let temp = document.body;
    
                for(let i=0 ; i<index.length ; i++){
                    temp = temp.children[index[i]];    
                }
                
                temp_image_element= temp.getElementsByTagName("img");
    
                if(temp_image_element == null){
                    //log error
                    console.log(`it is null`);
                }
    
                 //extracting urls from images
                 let img_src = [];
    
                 Array.from(temp_image_element).forEach((elem)=>{
                     img_src.push(elem.getAttribute("src"));
                 })
    
    
                //chaning the array into string so that data can easily be retrieved
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
            res.status(500).end();
            console.log(`==> Error occured while scraping product details <==`);
            console.log(err);
        }
    }


});

/*
let di_request = false;

app.post('/downloadImages',async(req,res)=>{

    if(di_request == false){
        
        req.setTimeout(0);
        console.log(`request recieved for downloading images...`);

        let {links} = req.body;
        console.log(links);
        let folder = "test";
        //for creating folder

        try{
            fs.readdirSync(folder);
        }
        catch(err){
            fs.mkdirSync(folder);
        }

        let savedCount = 0;

        try{

            for(let i=0 ; i<links.length ; i++){
            
                if(links[i] == null || links[i].length < 1){
                    savedCount++;
                    continue;
                }
    
                let imageName = links[i];
                imageName = imageName.toLowerCase();
    
                let startIndex = imageName.lastIndexOf("/") + 1;
                let endIndex = imageName.length;
    
                imageName = imageName.toLowerCase().substr(startIndex,endIndex);
    
                const writer = fs.createWriteStream(`${folder}/${imageName}`);
    
                let img_url = links[i];
    
                const response = await axios({
                    url : encodeURI(img_url),
                    method: 'GET',
                    responseType: 'stream'
                });
    
                response.data.pipe(writer);
    
                writer.on('finish',()=>{
    
                    savedCount++;
                    console.log(`saved image : ${savedCount} / ${links.length}`);
                    
    
                    if(savedCount == links.length){
                        console.log(`Successfully saved images...`)
                        res.end();
                    }
        
                });
    
                writer.on('error',()=>{
                    reject('IDK-ERROR');
                })
    
    
            }

        }
        catch(err){
            console.log(`==> ERROR OCCURED WHILE DOWNLOADING IMAGES <==`)
            console.log(err);
        }
        


       

    }

});

*/

let requested = false;
app.post("/scrapProducts[prev]",async(req,res)=>{

    if(requested == false){
        
        console.log(`==> REQUEST RECIEVED FOR SCRAPING <==`);

        req.setTimeout(0);
        let allProducts = [];

        requested = true;
    
        let {page} = req.query;
        let {productPath , baseURL , productFields} = metaData[0];

        let indexes = [];
        Object.entries(productFields).forEach((field)=>{
            let {val} = field[1];
            indexes.push([...xpathToIndex(val)]);
        });

        findProductURLs(productPath,baseURL,metaData,page , puppeteer).then(async(data)=>{
           
            console.log(`==> Successfully found product URLs <==`);
            let {links} = data;
            console.log(links);
            let productDetails = [];

            for(let i=0 ; i<links.length ; i++){

                let br = await puppeteer.launch({headless: false});
                let p = await br.newPage();
                await p.goto(links[i],{waitUntil : 'networkidle2' , timeout : 0 });

                p.on('console',(msg)=>{

                    let data = msg.text();

                    if(data.match(`h26k2-data`)){
                        data = data.replace("h26k2-data:","")
                        data = data.split("[--]");
                        productDetails.push([...data])
                        console.log(`==> Product Scraped ${i+1} <==`);
                        p.close();
                        br.close();
                        setTimeout(()=>{

                        },10000)
                    }

                    if(i == links.length - 1){
                        requested = false;
                        res.status(200).json(productDetails);
                    }

            
                });

                await p.evaluate((indexes)=>{
                    
                
                    let temp_product_details = [];

                    //Saving data into a temporary element

                    for(let i=0 ; i<indexes.length ; i++){
                        let temp = document.body;
                        for(let j=0 ; j<indexes[i].length ; j++){
                            let temp_index = indexes[i][j];
                            temp = temp.children[temp_index];
                        }
                        temp_product_details.push(temp.innerText);
                    }
                    
                    //chaning the aray into string so that data can easily be retrieved
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
                    
                } , indexes)

               // productDetails.push(temp_product_details.details);
                
               // console.log(`==> Product Scraped : ${i+1} <==`);

            }
           // console.log(`THIS IS PRODUCT DETAILS...`);
           // console.log(productDetails);
            //requested = false;
            //res.status(200).json(productDetails);
        }).catch((err)=>{
            requested = false;
            console.log(err);
            res.status(500).end();
        })


    } //requested delimeter
    

});


app.listen(port,()=>{
    console.log(`node app is live at port : ${port}`);
});
