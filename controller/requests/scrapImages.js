

const scrapImages = (app , metaData , xpathToIndex , puppeteer) => {
    
    let si_request = false;

    app.post("/scrapImages",async(req,res)=>{

        if(si_request == false){

            req.setTimeout(0);
        
            let {link} = req.body;
            console.log(`==> Request recieved for scraping images [${link}] <===`);

            let {productImages} = metaData[0];
    
            let index = xpathToIndex(productImages);

            try{
    
                let browser = await puppeteer.launch({headless: false  });
        
                let page = await browser.newPage();
                await page.goto(link,{waitUntil : 'networkidle0' , timeout : 0 });
                
                page.on('console',(msg)=>{
                    
                    let data = msg.text();
        
                    if(data.match("h26k2-data")){
        
                        data = data.replace("h26k2-data:","")
                        data = data.split("[--]");
        
                        console.log("**************************************************");
                        console.log(`==> Successfully scraped product images <==`);
                        console.log("**************************************************");
                        
                        page.close();
                        browser.close();
                        si_request = false;
                        res.status(200).json(data);
                    }
        
                }) 
                
                await page.evaluate((index)=>{
                    
                    let temp_image_element = null ;
                    let temp = document.body;
        
                    for(let i=0 ; i<index.length ; i++){
                        temp = temp.children[index[i]];    
                    }
                    
                    temp_image_element= temp.getElementsByTagName("img");
        
                    if(temp_image_element == null){
                        //log error
                        console.log(`it is null`);
                    }
        
                     //extracting urls from images
                     let img_src = [];
        
                     Array.from(temp_image_element).forEach((elem)=>{
                         img_src.push(elem.getAttribute("src"));
                     })
        
        
                    //chaning the array into string so that data can easily be retrieved
                    let temp_str = ``;
                    for(let i=0 ; i<img_src.length ; i++){
                            
                        if(i == img_src.length - 1){
                            temp_str += `${img_src[i]}`;
                        }
                        else{
                            temp_str += `${img_src[i]}[--]`;
                        }
        
                    }
        
                    console.log(`h26k2-data:${temp_str}`);
        
                },index);
        
            }
            catch(err){
                res.status(500).end();
                si_request = false;
                console.log(`==> Error occured while scraping product details <==`);
                console.log(err);
            }

        }

    });

}

module.exports = scrapImages;