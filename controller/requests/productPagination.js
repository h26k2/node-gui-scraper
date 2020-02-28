

const productPagination = (app,puppeteer) => {

    app.post(`/catalogPagination`,async(req,res) =>{

        let {url} = req.body;
        req.setTimeout(0);

        let browser = await puppeteer.launch({headless: false  });
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
                        alert(`Successfully chosen!\nXPATH is : ${structureString}\nNow you can close the window`);
                        console.log(`h26k2-data:${structureString}`);

                    }

                }

            });

        });

    }); 

}


module.exports = productPagination;