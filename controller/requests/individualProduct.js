
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
                    e.target.setAttribute("title",e.target.getAttribute("class").replace("h26k2-color",""));
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
                    let element_classes = elem.parentElement.getAttribute("class");
                    let  clicked_elem_classes = elem.getAttribute("class");
                    let dataToSend ;
    
                    for(let i=0 ; i<anchors.length ; i++){
                    
                        let a_href = anchors[i].getAttribute("href");
                        let a_class = anchors[i].getAttribute("class");
                        
                        let confirm_string;

                        if(a_class != null && a_class != undefined){
                            confirm_string = `URL : ${a_href}\nElement with class : [a].${a_class}\nIs this the product URL ?  `;
                        }
                        else{
                            confirm_string = `URL : ${a_href}\nElement : [a]\nIs this the product URL ?  `;
                        }
                        
                        
                        
                        if(confirm(confirm_string) ){
                           
                            if(elem.getElementsByClassName(a_class).length == 1){
                                dataToSend = `class|${a_class}`;
                            }
                            else{
                                
                                let temp_an = anchors[i];
                                let structureDetails = [];

                                //for getting XPATH of the element

                                while(true){
                                    
                                    let len = structureDetails.length ; 
                                    let temp_an_cls = temp_an.parentElement.getAttribute("class");

                                    if( temp_an_cls == element_classes ){

                                        if(len < 1){
                                            structureDetails.push(
                                                {
                                                    elem : temp_an.parentElement.nodeName,
                                                    index : [...temp_an.parentElement.children].indexOf(temp_an)
                                                }
                                            );
                                        }
                                        break;
                                    }
                                    
                                    structureDetails.push(
                                        {
                                            elem : temp_an.parentElement.nodeName,
                                            index : [...temp_an.parentElement.children].indexOf(temp_an)
                                        }
                                    );

                                    temp_an = temp_an.parentElement;

                                }

                                //For printing the XPATH structure of the string

                                let structureString = ``;

                                for(let i=structureDetails.length  - 1; i>= 0 ; i--){
                        
                                    let s_elem = structureDetails[i].elem;
                                    let index = structureDetails[i].index;
            
                                    structureString += `${s_elem}[${index}]/`
                                }
            
                                structureString = structureString.substr(0,structureString.length - 1);
                                alert(`Done! Xpath is : ${structureString}`);
                                dataToSend = `xpath|${structureString}`;

                            }

                            
                            let product_string = `Please enter the name you want us to target on individual product from the given below data\n${clicked_elem_classes}`;
                            
                            let product_elem = prompt(product_string);
                            alert(`Successfully Selected!\nYou can close the window.`);
                            
                            console.log(`h26k2-data:[${product_elem}]${dataToSend}`);
    
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