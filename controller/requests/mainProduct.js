
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

                        let selectedElem = elem;

                        if(elem.classList.length > 2 ){
                            elem = elem.getAttribute("class");
                            elem = elem.replace("h26k2-color","")
                            elem = prompt(`Type the class name you want to target ? from the below classes ${elem}`)
                        }
                        else{
                            elem = elem.getAttribute("class");
                            elem = elem.replace("h26k2-color","");
                        }
    
                        let dom_elem = document.getElementsByClassName(elem);
                        
                        if(dom_elem.length == 1){
                            
                            data = elem;
                            console.log(`h26k2-data:${data}`);
                            alert(`Element Successfully Select, you can close the window`);
    
                        }
                        else{
                            
                            console.log(`this is element`);
                            console.log(selectedElem);
                            console.log(selectedElem.parentElement);
                            let structureDetails = [];

                            while(true){
                                
                                if(selectedElem.parentElement.nodeName == "HTML"){
                                    break;
                                }

                                console.log(`****************`);
                                console.log(selectedElem.parentElement);
                                console.log(`index of element is : ${[...selectedElem.parentElement.children].indexOf(elem)}`);

                                structureDetails.push(
                                    {
                                        elem : selectedElem.parentElement.nodeName,
                                        index : [...selectedElem.parentElement.children].indexOf(selectedElem)
                                    }
                                );

                                selectedElem = selectedElem.parentElement;

                            }

                            let structureString = ``;

                            for(let i=structureDetails.length  - 1; i>= 0 ; i--){
                            
                                let elem = structureDetails[i].elem;
                                let index = structureDetails[i].index;
        
                                structureString += `${elem}[${index}]/`
                            }

                            structureString = structureString.substr(0,structureString.length - 1);
                            alert(`Successfully chosen!\nXPATH is : ${structureString}\nNow you can close the window`);
                            console.log(`h26k2-data:xpath|${structureString}`);

                        }
    
                    }
    
                }
    
            });
    
        });
        


    });

}

module.exports = mainProduct;
