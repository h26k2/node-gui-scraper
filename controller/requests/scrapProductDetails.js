

const scrapProductDetails = (app,metaData,puppeteer,xpathToIndex) => {
    
    let spd_request = false;

    app.post("/scrapProductDetails",async(req,res)=>{

        if(spd_request == false){

            req.setTimeout(0);

            let {link} = req.body;
            console.log(`===> Request recieved for scraping details : [${link}] <===`);

            //finding indexes of the product details

            let indexes = [];
            let {productFields} = metaData[0];
            let objCount = 0;
            
            Object.entries(productFields).forEach((field)=>{
                let {val} = field[1];
                indexes[objCount] = xpathToIndex(val);
                objCount++;
            });
            
            /*****************
             * Scraping Stuff
            ******************/

            let productDetails = [];

            try{
            
                let browser = await puppeteer.launch({headless: false  });
    
                let page = await browser.newPage();
                await page.goto(link,{waitUntil : 'networkidle2' , timeout : 0 });
    
                //page console
                page.on('console',(msg)=>{
                    
                    let data = msg.text();
    
                    if(data.match("h26k2-data")){
    
                        data = data.replace("h26k2-data:","")
                        data = data.split("[--]");
                        productDetails.push([...data]);
                        console.log("**************************************************");
                        console.log(`==> Successfully scraped product details <==`);
                        console.log("**************************************************");
                        spd_request = false;
                        page.close();
                        browser.close();
                        res.status(200).json(productDetails);
    
                    }
    
                });
    
                //page evaluation method pupeeteer
                await page.evaluate((indexes)=>{
                    
                    let temp_product_details = [];
    
                    //Saving data into temporary variable
                    for(let i=0 ; i<indexes.length ; i++){
                        temp = document.body;
                        for(let j=0 ; j<indexes[i].length ; j++){
                            let temp_index = indexes[i][j];
                            temp = temp.children[temp_index];
                        }
                        temp_product_details.push(temp.innerText);
                        console.log(temp_product_details);
                    } 
                    
                    //chaning the aray into string so that data can easily be retrieved
                    let temp_str = ``;
                    for(let i=0 ; i<temp_product_details.length ; i++){
                            
                        if(i == temp_product_details.length - 1){
                            temp_str += `${temp_product_details[i]}`;
                        }
                        else{
                            temp_str += `${temp_product_details[i]}[--]`;
                        }
    
                    }
    
                    console.log(`h26k2-data:${temp_str}`);
    
                },indexes);
    
    
            }
            catch(err){
                res.status(500).end();
                console.log(`==> Error occured while scraping product details <==`);
                console.log(err);
                spd_request = false;
            }


        }

    });

}

module.exports = scrapProductDetails;