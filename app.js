const port = 3000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs");

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

const selectMainContainer = async(url  , filename , brandName , uniqueCheck ) =>{

    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();

    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});
    
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
                        console.log(data);
                        alert(data); 
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
                        }

                    }
                    else{
                        alert(`This element can't be select as there are some conflicts in XPATH`)
                    }


                }

            }

        });

    },filename  , brandName , uniqueCheck );


}

const selectProduct = async (url,filename,brandName ) => {

    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();

    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});

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
                        }

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
    
    await page.evaluate((filename,brandName,uniqueCheck)=>{

        let prev = undefined;
        let data = [];

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
                        while(true){
                            
                            if(elem.parentElement.nodeName == "HTML"){
                                break;
                            }

                            console.log(`****************`);
                            console.log(elem.parentElement);
                            console.log(`index of element is : ${[...elem.parentElement.children].indexOf(elem)}`)
                            elem = elem.parentElement;
                            
                           

                        }


                        elem = elem.getAttribute("class");
                        elem = elem.replace("h26k2-color","")

                        let dom_elem = document.getElementsByClassName(elem);

                        if(dom_elem.length == 1 || uniqueCheck == false){
                            
                            data = elem;
                            console.log(data);
                            alert(data); 
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
                            }

                        }
                        else{
                            alert(`This element can't be select as there are some conflicts in XPATH`)
                        }



                    }
                    

            }

        });

    },filename,brandName,uniqueCheck);

    

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
    let filename = `product_detail_${col}_${sku}`;
    selectProductDetails(url,filename,brand,true);

});


app.listen(port,()=>{
    console.log(`node app is live at port : ${port}`);
});
