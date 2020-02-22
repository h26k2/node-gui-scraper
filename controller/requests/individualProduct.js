
const individualProduct = (app,puppeteer) => {

    app.post(`/individualProduct` , async(req,res)=>{
        
        req.setTimeout(0);

        let {url} = req.body;

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

        await page.evaluate(()=>{
        
            let prev = undefined;
            
            window.addEventListener("mouseover",(e)=>{
    
                let current = e.target;
                
                if(current !== undefined && current.classList.contains("h26k2-color") != true){
                    current.classList.add("h26k2-color");
                    prev = current;
                    e.target.setAttribute("title",e.target.getAttribute("class"));
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
    
                            break;
                        }
                        else{
                            continue;
                        }
        
        
                    }
        
                }
                
            });
    
    
        });

    });

}

module.exports = individualProduct;