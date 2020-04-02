

const findRoutePath = require("./findRoutePath");


const findProductURLs = (productPath , baseURL , metaData , page , puppeteer) => {

    return new Promise(async(resolve,reject)=>{

        let {productPath} = metaData[0];

        let url = findRoutePath(baseURL,productPath,page);return;
        console.log(`Scraping started for this page : ${url} `);

        let {catalogMainContainer , catalogSingleProduct } = metaData[0];

        try{
            
            let browser = await puppeteer.launch({headless : false , timeout : 0});
            let page = await browser.newPage();

            await page.goto(url , {waitUntil : 'networkidle2'});

            let productURLs = await page.evaluate((catalogMainContainer , catalogSingleProduct)=>{
                
                let product_links = [];
                
                let mainContainer = document.getElementsByClassName(catalogMainContainer)[0];
                
                let st_in = catalogSingleProduct.indexOf("\[");
                let st_en = catalogSingleProduct.indexOf("\]");
                
                if(st_in < 0 || st_en < 0){
                    console.log(`unvalid`);
                    return `h26k2-unvalid|can't find main container`;
                }

                let productClass = catalogSingleProduct.substring(st_in +1 , st_en );
                let products = mainContainer.getElementsByClassName(productClass);

                if(products.length < 0 == true){
                    return `h26k2-unvalid|can't find products`
                }

                //checking how to get the anchor elements from the single product container
                let product_anchor = {};
                
                if(catalogSingleProduct.includes("xpath")){

                    let val = catalogSingleProduct.substr(catalogSingleProduct.indexOf("|") + 1,catalogSingleProduct.length - 1);

                    product_anchor = {
                        type : 'xpath',
                        value : val
                    }

                }
                else{

                }

                //performing actions when the element has xpath

                if(product_anchor.type == "xpath" ){
                        
                    let xpath_elem = product_anchor.value;
                    xpath_elem.substr(product_anchor.value.indexOf("|"+1),product_anchor.value.length - 1);

                    let xpath_elems = xpath_elem.split("/");
                    let xpath_elem_index = [];

                    Array.from(xpath_elems).forEach((elem)=>{
                        
                        let s = elem.indexOf(`[`) + 1;
                        let e = elem.length - 1;

                        xpath_elem_index.push(parseInt(elem.substr(s,e)))

                    });
                    
                    Array.from(products).forEach((p)=>{

                        if(p !== undefined ){

                            let temp = p;
                            for(let i=0 ; i<xpath_elem_index.length ; i++){
                                temp = temp.children[xpath_elem_index[i]];
                            }
                            product_links.push(temp.getAttribute("href"));
                        }

                    });

                }
                else{

                }
                
                return {
                    links : product_links
                }


            },catalogMainContainer,catalogSingleProduct);

            await browser.close();
            
            //It happened when an error occured while finding the product URLs

            if(productURLs.links == undefined){
                if(productURLs.includes(`h26k2-unvalid`)){
                    let s_in = productURLs.indexOf("|");
                    console.log(`ERROR OCCURED!`);
                    console.log(productURLs.substr(s_in + 1 , productURLs.length  - 1));
                    reject(productURLs.substr(s_in + 1 , productURLs.length  - 1));
                }
            }
            resolve(productURLs);

        }
        catch(err){
            console.log(`ERROR OCCURED!`);
            console.log(err);
            reject(err);
        }



    });
}


module.exports = findProductURLs;