const port = 3000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");
const htmlparser2 = require("htmlparser2");
const jsdom = require("jsdom");
const {JSDOM} = jsdom;

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

let metadata = [];
let JSON_file;

const selectMainContainer = async(url  , filename , brandName , uniqueCheck ) =>{

    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();

    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});

    page.on('console',(msg)=>{
        
        let val = msg.text();
        
        if(val.match("h26k2-data:")){
            
            let data = val.substr(val.indexOf(":")+1,val.length);    
            metadata.push({
                type : 'mainContainer',
                val : data
            })
        }

    });
    
    await page.evaluate((filename , brandName , uniqueCheck )=>{
        
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
                        }*/

                    }
                    else{
                        alert(`This element can't be select as there are some conflicts in XPATH`)
                    }


                }

            }

        });

    },filename  , brandName , uniqueCheck  );
    
    
}

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

app.post("/mainProducts",async(req,res)=>{

    let {url , filename ,brand} = req.body;

    selectMainContainer(url, filename,brand ,true);

}); 


app.post("/productPageLink",async(req,res)=>{

    let {url , filename ,brand} = req.body;

    selectProduct(url,filename,brand);

});

app.post("/productDetail",(req,res)=>{
   
    let {col , sku , url ,brand} = req.body;
    let filename = `product-detail_${col}`;
    selectProductDetails(url,filename,brand,true);

});

app.post("/saveMetaData",(req,res)=>{

    let {url,brand,p_url} = req.body;
    console.log(`here is all the data : ${metadata}`);
    console.log(metadata);
    metadata.push(
        {
            type : 'websiteURL',
            val : url
        },
        {
            type : 'brand',
            val : brand
        },
        {
            type : 'productURL',
            val : p_url
        }
    )
    try{
        let data = metadata;
        fs.writeFileSync(`${brand}-metadata.json`,JSON.stringify(data));
        res.status(200).json(JSON.stringify(`${brand}-metadata.json`));
    }catch(err){
        console.log(err);
    }

});

let requested = false;
app.post("/scrapProducts",async(req,res)=>{
    
    if(requested == false){

        req.setTimeout(0);
        let allProducts = [];

        requested = true;
    
        console.log(`request recieved`);

        let metadata = fs.readFileSync("replica-bags-metadata.json");
        metadata = JSON.parse(metadata);
        
        let {page} = req.query;
        let mainContainerClass  , productCatalog , url , brand , productCatalog_a;
        let productDetails = [];
        
        for(let i=0 ; i<metadata.length ; i++){

            let type = metadata[i].type;
            let val = metadata[i].val;
            
            if(type == 'mainContainer'){
                mainContainerClass = val;
            }
            else if(type == 'productCatalogProduct'){
                let index = val.indexOf("|");
                productCatalog= val.substr(index+1,val.length);
                productCatalog_a = val.substr(0,index);
            }
            else if(type == 'productDetail'){
                
                let name = metadata[i].name;

                productDetails.push({
                    name , val
                })
            }
            else if(type == 'websiteURL'){
                url = val;
            }
            else if(type == 'brand'){
                brand = val;
            }

        }

        let urlToFetch = `${url}page/${page}`;
        //console.log(urlToFetch,`fetching this url`);
        try{

            let browser = await puppeteer.launch({headless : true});
            let page = await browser.newPage();

            await page.goto(urlToFetch , {waitUntil : 'networkidle2'});

            let data = await page.evaluate((mainContainerClass,productCatalog,productCatalog_a)=>{
                
                let mainContainer = document.getElementsByClassName(mainContainerClass)[0];
            
                let products = mainContainer.getElementsByClassName(productCatalog);
            
                let urls = [];

                Array.from(products).forEach((p)=>{
                    
                    let temp = p.getElementsByClassName(productCatalog_a)[0].getAttribute("href");
                    urls.push(temp);

                });

                return{
                    urls
                }

            },mainContainerClass,productCatalog,productCatalog_a);

            await browser.close();
            
            //getting individual product details

            let {urls} = data;
            console.log(urls);

            for(let i=0 ; i<2 ; i++){

                let single_p_detail = [];

                let br = await puppeteer.launch({headless: true});

                let p = await br.newPage();

                p.on('console',(e)=>{

                    let console_text = e.text();
                    
                    if(console_text.match("h26k2-last-data")){
                        
                        let s = console_text.indexOf("|") + 1;
                        let e = console_text.length;
                        let detail = console_text.substr(s,e);
                        single_p_detail.push(detail);
                        allProducts.push([...single_p_detail]);
                        console.log(` ==> scraped product : ${allProducts.length}  / ${urls.length}<==`);
                        if(allProducts.length == 2){
                            console.log(`==> [successfully scraped all products] <==`);
                            requested = false;
                            res.json(allProducts);
                        }
                    }
                    else if(console_text.match("h26k2-data")){

                        let s = console_text.indexOf("|") + 1;
                        let e = console_text.length;
                        let detail = console_text.substr(s,e);
                        single_p_detail.push(detail);

                    }
                    
                })

                await p.goto(urls[i],{waitUntil : 'networkidle2' , timeout : 0 });

                await p.evaluate((productDetails)=>{

                    console.log(productDetails);
                    let indexes = [];
                    Array.from(productDetails).forEach((p_detail)=>{
                        
                        let val = p_detail.val;
                        let elems = val.split("/");
                        let temp_index = [];
                        Array.from(elems).forEach((elem)=>{
                            
                            let s = elem.indexOf(`[`) + 1;
                            let e = elem.length - 1;

                            temp_index.push(parseInt(elem.substr(s,e)));

                        });
                        indexes.push([...temp_index]);
                    });

                    console.log("h26k2");
                    console.log(indexes);
                    
                    for(let j=0 ; j<indexes.length ; j++ ){
                        let temp = document.body;
                        for(let k=0 ; k<indexes[j].length; k++){
                            let index = indexes[j][k];
                            temp = temp.children[index];
                        }
                        if(j == indexes.length - 1){
                            console.log(`h26k2-last-data|${temp.innerText}`);
                        }
                        else{
                            console.log(`h26k2-data|${temp.innerText}`);
                        }
                    }
                    
                    
                },productDetails)

                await br.close();
                
            }

        }
        catch(err){
            console.log(`******************`);
            console.log(`ERROR OCCURED`);
            console.log(err);
            console.log(`*******************`);
        }
    }
    

});

app.post('/loadMetaData',(req,res)=>{

    let {path} = req.body;
    let start_index = path.lastIndexOf(`\\`) + 1;
    let end_index = path.length;
    path = path.substr(start_index,end_index);
    console.log(`Here is path : ${path}`);
    JSON_file = path;
    res.status(200).end();
    

});

app.get("/check",(req,res)=>{
    
    axios.get("http://designer-discreet.ru/product/bottega-vaenta-butter/").then((data)=>{
    
        let $$ = cheerio.load(data.data);
        let text = $$("html").html();
        const dom = new JSDOM(text);
        //console.log(dom.window.document.body.children[5].children[2]);
    })
   
})

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
                    
                    let images = document.getElementsByTagName("img");
                    console.log(images);

                    if(images.length < 1){
                        alert(`The container which you've selected doesn't have any image element`);
                    }
                    else{

                        if(confirm(`The container have ${images.length} images, we'll let you choose which element you want, for now if you are okay with this press YES`)){
                            
                            let structureDetails = [];

                            while(true){
                            
                                if(elem.parentElement.nodeName  == "HTML"){
                                    break;
                                }
    
                                console.log(`****************`);
                                console.log(elem.parentElement);
                                console.log(`index of element is : ${[...elem.parentElement.children].indexOf(elem)}`);
    
                                structureDetails.push(
                                    {
                                        elem : elem.parentElement.nodeName,
                                        index : [...elem.parentElement.children].indexOf(elem)
                                    }
                                );
    
                                elem = elem.parentElement;
    
                            }

                            console.log(structureDetails);

                            let structureString = ``;
                    
                            for(let i=structureDetails.length  - 1; i>= 0 ; i--){
                                
                                let elem = structureDetails[i].elem;
                                let index = structureDetails[i].index;

                                structureString += `${elem}[${index}]/`
                            }

                            structureString = structureString.substr(0,structureString.length - 1);
                            alert(`Done! Xpath is : ${structureString}`);
                            
                            let str_imgs = ``;

                            Array.from(images).forEach((image)=>{
                                str_imgs += `${image.getAttribute("src")},`;
                            });

                            str_imgs = str_imgs.substr(0,str_imgs.length - 1);

                            console.log(`h26k2-data:${structureString}||${str_imgs}`);
                        }

                    }
                    

                }

            }

        });

    })


});


app.listen(port,()=>{
    console.log(`node app is live at port : ${port}`);
});
