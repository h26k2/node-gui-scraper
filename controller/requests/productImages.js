
const productImages = (app,puppeteer) => {

    app.post(`/productImages`,async(req,res)=>{

        console.log(`==> Request recieved for product images <==`);

        req.setTimeout(0);

        let {url} = req.body;

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

}

module.exports = productImages;