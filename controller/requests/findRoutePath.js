

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
                
                let onlyQueries = newURL.substr(newURL.indexOf("?"),newURL.length - 1);
                
                if(onlyQueries.match(`${symbol}`)){
                    
                    let symbol_index = onlyQueries.indexOf(`${symbol}`);
                    symbol_index += symbol.length;
                
                    if(onlyQueries[symbol_index] == "="){
                        symbol_index++;
                        i = symbol_index;
                        //finding the number which the current parameter has
                        let number = "";
                        
                        if(i == onlyQueries.length - 1){
                            number = onlyQueries[i];
                            onlyQueries = onlyQueries.replace(`${symbol}=${number}`,`${symbol}=${page}`);
                        }
                        else{
                            while(i <= onlyQueries.length - 1){
                                if(onlyQueries[i] != "&"){
                                    number += onlyQueries[i];
                                    i++;
                                }
                                else{
                                    break;
                                }
                            }
                            onlyQueries = onlyQueries.replace(`${symbol}=${number}`,`${symbol}=${page}`);
                        }
                        let onlyURL = newURL.substr(0,newURL.indexOf("?"));
                        newURL = onlyURL + onlyQueries;
                    }
                    
                }
                else{
                    newURL += `&${symbol}=${page}`
                }
            }
            else{console.log(`else wala`);
                newURL += `?${symbol}=${page}`
            }

        }

    }
    else if(productPath.path_type == "custom"){
        
        let {val} = productPath;
        newURL = val.replace(/\{[0-9]{1,4}\}/gi,page)
       
    }
    console.log(newURL , `final`);
    
    //return newURL;

}

module.exports = findRoutePath;