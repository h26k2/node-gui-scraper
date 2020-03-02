

const findRoutePath = (baseURL,productPath) => {

    let url = baseURL;

    if(productPath.path_type == "defined"){
            
        let {returned_data}  = productPath;
        let {type , symbol} = returned_data;
        
        if(type == "id"){
            if(url[url.length - 1] != "/"){
                url += "/";
            }
            url += `${symbol}/${page}`;
        }
        else if(type == "query"){

        }

    }
    else if(productPath.path_type == "custom"){

    }

    return url;

}

module.exports = findRoutePath;