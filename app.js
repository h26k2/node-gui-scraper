const port = 3000;
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");

app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));

async function logic(){

    let url = "http://designer-discreet.ru/product-category/replica-bags/";
    let browser = await puppeteer.launch({headless: false});

    let page = await browser.newPage();

    await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
    await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});
    
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
                    
                    elem = elem.getAttribute("class");
                    elem = elem.replace("h26k2-color","");
                    let dom_elem = document.getElementsByClassName(elem);
                    
                    if(dom_elem.length == 1){
                        
                        data = elem;

                        const blob = new Blob([`main_container\n${data}`],{type : 'text/csv'});
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.setAttribute("data-name","csv");
                        a.setAttribute('hidden','');
                        a.setAttribute('href',url);
                        a.setAttribute('download','products_csv.csv');
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        alert(data);
                        alert("done hogaya");
                    }
                    else{
                        alert(`This element can't be select as there are some conflicts in XPATH`)
                    }


                }

            }

        });

    });


}


app.get("/",async(req,res) => {
    res.render("home");
});

app.listen(port,()=>{
    console.log(`node app is live at port : ${port}`);
});
