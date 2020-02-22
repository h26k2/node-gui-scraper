
const mainProduct = (app,puppeteer) => {

    app.post(`/mainProducts`,async(req,res)=>{

        req.setTimeout(0);
        
        let {url } = req.body;
        
        let browser = await puppeteer.launch({headless: false});

        let page = await browser.newPage();

        await page.goto(url,{waitUntil : 'networkidle2' , timeout : 0 });
    
        await page.addStyleTag({content : '.h26k2-color{background : yellow!important}'});

        page.on('console',(msg)=>{
        
            let val = msg.text();
            
            if(val.match("h26k2-data:")){
                
                let data = val.substr(val.indexOf(":")+1,val.length);  
                res.json(data);
                
            }
    
        });

        await page.evaluate(( )=>{
        
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
                        
                        if(dom_elem.length == 1){
                            
                            data = elem;
                            console.log(`h26k2-data:${data}`);
                            alert(`Element Successfully Select, you can close the window`);
    
                        }
                        else{
                            alert(`This element can't be select as there are some conflicts in XPATH`);
                        }
    
    
                    }
    
                }
    
            });
    
        });
        


    });

}

module.exports = mainProduct;
