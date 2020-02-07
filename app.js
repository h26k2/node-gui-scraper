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

const openPuppeteer = async(url  , filename , brandName , uniqueCheck , isLinkElement) =>{

    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();

    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});
    
    await page.evaluate((filename , brandName , uniqueCheck , isLinkElement)=>{
        
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
            
            let anchors = elem.getElementsByTagName("a");

            for(let i=0 ; i<anchors.length ; i++){
                
                let a_href = anchors[i].getAttribute("href");
                let a_class = anchors[i].getAttribute("class");

                let confirm_string = `URL : ${a_href}\nElement : ${a_class}\nDo you want to want to select this element ? `;

                if(confirm(confirm_string)){
                    alert("done");
                    break;
                }
                else{
                    continue;
                }


            }

           

            return;
            if(elem !== undefined && elem.getAttribute("data-name") == undefined){

                let status = window.confirm("Select this element ? ");
                
                if(status == true){
                    

                    if(isLinkElement){
                        console.log(elem);
                    }
                    else{
                        elem = elem.getAttribute("class");
                        elem = elem.replace("h26k2-color","");
                    }

                    let dom_elem = document.getElementsByClassName(elem);
                    
                    if(dom_elem.length == 1 || uniqueCheck == false){
                        
                        data = elem;
                        console.log(data);
                        alert(data); /*
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

                    }
                    else{
                        alert(`This element can't be select as there are some conflicts in XPATH`)
                    }


                }

            }

        });

    },filename  , brandName , uniqueCheck , isLinkElement);


}


app.get("/",async(req,res) => {
    res.render("home");
});

app.post("/mainProducts",async(req,res)=>{

    let {url , filename ,brand} = req.body;

    let uniqueCheck = true;
    let isLinkElement = false;

    openPuppeteer(url, filename,brand , uniqueCheck , isLinkElement);

}); 


app.post("/productPageLink",async(req,res)=>{

    let {url , filename ,brand} = req.body;

    let uniqueCheck = false;
    let isLinkElement = true;

    openPuppeteer(url,filename,brand , uniqueCheck , isLinkElement);

});



app.listen(port,()=>{
    console.log(`node app is live at port : ${port}`);
});
