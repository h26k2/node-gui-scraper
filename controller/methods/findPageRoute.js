

const findPageRoute = (web_url) => {

    let url = {};

    if(web_url.match(/\?/gi)){
        
        url.type = "query";

        if(web_url.match(/page=[0-9]{1,5}/gi)){
            
            url.symbol = "page";
        }
        else if(web_url.match(/p=[0-9]{1,5}/gi)){
            
            url.symbol = "p";            
        }

    }
    else if(web_url.match(/\/page\//gi)){
        
        url = {
            type : "id",
            symbol : "page"
        }
    }
    else if(web_url.match(/\/p\//gi)){
        
        url = {
            type : "id",
            symbol : "p"
        }
    }
    else{
        //alert(`We're unable to analyse the route path of the website...`);
        return -1;
    }

    return url;
    
}

module.exports = findPageRoute;