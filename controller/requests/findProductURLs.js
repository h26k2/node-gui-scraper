

const findRoutePath = require("./findRoutePath");
const xpathToIndex = require("../methods/xpathToIndex")

const findProductURLs = (productPath , baseURL , metaData , page , puppeteer) => {

    return new Promise(async(resolve,reject)=>{

        let url = findRoutePath(baseURL,productPath,page);
        console.log(`Scraping started for this page : ${url} `);

        let {catalogMainContainer , catalogSingleProduct } = metaData[0];

        let index ;
        if(catalogMainContainer.match("xpath")){
            let xpath = catalogMainContainer.substr(catalogMainContainer.indexOf("|") +1,catalogMainContainer.length - 1);
            index = xpathToIndex(xpath);
        }

        try{
            
            let browser = await puppeteer.launch({headless : false , timeout : 0});
            let page = await browser.newPage();

            await page.goto(url , {waitUntil : 'networkidle2'});

            let productURLs = await page.evaluate((catalogMainContainer , catalogSingleProduct,index)=>{
                
                let product_links = [];
                let mainContainer ;

                if(catalogMainContainer.match("xpath") == false){
                    mainContainer =  document.getElementsByClassName(catalogMainContainer)[0];
                }
                else{
                    let temp_elem = document.body;

                    for(let i=0 ; i<index.length ; i++){
                        temp_elem = temp_elem.children[index[i]];
                    }

                    if(temp_elem != undefined){
                        mainContainer = temp_elem;
                    }
                    else{
                        alert(`There are conflits while getting the xpath`);
                        return;
                    }

                }
                
                
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
                    
                    let val = catalogSingleProduct.substr(catalogSingleProduct.indexOf("|") + 1,catalogSingleProduct.length - 1);

                    product_anchor = {
                        type : 'class',
                        value : val
                    }

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
                    let {value} = product_anchor;
                    Array.from(products).forEach((p)=>{
                        
                        if( p != undefined){
                            let temp_href_elem =  p.getElementsByClassName(value)[0]
                            if(temp_href_elem != undefined){
                                product_links.push(temp_href_elem.getAttribute("href"));
                            }
                        }

                    })
                }
                
                return {
                    links : product_links
                }


            },catalogMainContainer,catalogSingleProduct,index);

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
            else if(productURLs.links.length > 1){

                if(productURLs.links[0].includes("wwww.") == false){
               
                    let p_urls = [];
                    let mainURL = url;
                    let partToAdd ;
                    
                    if(mainURL.match("https://")){
                        mainURL = mainURL.replace("https://","");
                    }
                    else if(mainURL.match("http://")){
                        mainURL = mainURL.replace("http://","");
                    }
                    
                    partToAdd = mainURL.substr(0,mainURL.indexOf("/")).trim();
                    
                    for(let u of productURLs.links){
                        u = u.trim();
                        if(u[0] == "/"){
                            p_urls.push(`https://${partToAdd}${u}`);
                        }
                        else{
                            p_urls.push(`https://${partToAdd}/${u}`)
                        }
                        
                    }
                    resolve({links : p_urls});;
                }
            }
            else{
                resolve(productURLs);
            }

        }
        catch(err){
            console.log(`ERROR OCCURED!`);
            console.log(err);
            reject(err);
        }



    });
}


module.exports = findProductURLs;