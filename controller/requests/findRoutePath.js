

const findRoutePath = (baseURL,productPath,page) => {

    let newURL = baseURL;
    console.log(newURL);
    if(productPath.path_type == "defined"){
            
        let {url}  = productPath;
        let {type , symbol} = url;
        
        if(type == "id"){
            if(url[url.length - 1] != "/"){
                newURL += "/";
            }
            newURL += `${symbol}/${page}`;
        }
        else if(type == "query"){
            
            if(newURL.match(/\?/)){
               
                let symbol_index = newURL.indexOf(`${symbol}`);
                symbol_index += symbol.length;
               
                if(newURL[symbol_index] == "="){
                    symbol_index++;
                    i = symbol_index;
                    //finding the number which the current parameter has
                    let number = "";
                    
                    if(i == newURL.length - 1){
                        number = newURL[i];
                        newURL = newURL.replace(`${symbol}=${number}`,`${symbol}=${page}`);
                    }
                    else{
                        while(i <= newURL.length - 1){
                            if(newURL[i] != "&"){
                                number += newURL[i];
                                i++;
                            }
                            else{
                                break;
                            }
                        }
                    }
                    
                    newURL = newURL.replace(`${symbol}=${number}`,`${symbol}=${page}`);
                    
                }

               

            }
            else{
                newURL += `?${symbol}=${page}`
            }

        }

    }
    else if(productPath.path_type == "custom"){
        
        let {val} = productPath;
        newURL = val.replace(/\{[0-9]{1,4}\}/gi,page)
       
    }

    //return newURL;

}

module.exports = findRoutePath;