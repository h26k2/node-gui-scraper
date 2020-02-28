

const findPageRoute = (web_url) => {

    let url = {};
    
    //for routes like [query parameters]

    if(web_url.match(/\?/gi)){        
        url.type = "query";

        if(web_url.match(/page=[0-9]{1,5}/gi)){
            
            url.symbol = "page";
        }
        else if(web_url.match(/p=[0-9]{1,5}/gi)){
            
            url.symbol = "p";            
        }

    }
    
    //for routes which include page with id

    else if(web_url.match(/\/page\//gi)){
        
        url = {
            type : "id",
            symbol : "page"
        }
    }

    //for routes which include [p] with id

    else if(web_url.match(/\/p\//gi)){ console.log(`third`);
        
        url = {
            type : "id",
            symbol : "p"
        }
    }

    // for those routes which can't be recognized our logics

    else{
        return -1;
    }

    return url;
    
}

module.exports = findPageRoute;