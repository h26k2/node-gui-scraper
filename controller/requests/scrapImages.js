

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
                    //console.log(temp);
                    for(let i=0 ; i<index.length ; i++){
                        temp = temp.children[index[i]];    
                        //console.log(temp);
                    }
                    //console.log(temp);

                    if(temp == undefined){
                        
                        let returnAlertStatus = confirm(`Couldn't complete this action. This could occured because of server or DOM element error\nclick yes if you want to target custom DOM element`);

                        if(returnAlertStatus){
                            
                            let new_dom_input = prompt("Enter parent container class which contains images you want to target");

                            if(new_dom_input != undefined && new_dom_input != null){
                                let imgs = document.getElementsByClassName(new_dom_input)[0].getElementsByTagName("img");
                                if(imgs != undefined && imgs.length > 1){
                                    let images_urls = [];
                                    for(let i of imgs){
                                        images_urls.push(i.getAttribute("src"));
                                    }
                                    let str_data_to_return = ``;
                                    for(let i=0 ; i<images_urls.length ; i++){
                                        if(i == images_urls.length - 1){
                                            str_data_to_return += `${images_urls[i]}`;
                                        }
                                        else{
                                            str_data_to_return += `${images_urls[i]}[--]`;
                                        }
                                    }
                                    console.log(`h26k2-data:${str_data_to_return}`);

                                }
                                else{
                                    console.log(`h26k2-data:`);
                                }
                            }

                        }
                        else{
                            console.log(`h26k2-data:`);
                        }
                        return;
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