
const findPageRoute = require("../methods/findPageRoute");

const saveMetaData = (app,fs) => {
    
    app.post(`/saveMetaData`,(req,res)=>{
        
        console.log(`==> Request recieved for saving metadata <==`);

        let {dataToSend} = req.body;
        console.log(dataToSend);
        //Saving metadata details to an object

        let {productCatalogURL,productBrandName,productCatalog,productSingleContainer,productImagesContainer,
            cols , productPagination , productPath} = req.body.dataToSend;

        let dataToSave = {
            baseURL : productCatalogURL,
            brandName : productBrandName,
            catalogMainContainer : productCatalog,
            catalogSingleProduct : productSingleContainer,
            productImages : productImagesContainer,
            paginationElem : productPagination, 
            productFields : {
                ...cols
            }
        };
        
        if(productPath.path_type == "custom"){
            dataToSave.productPath = {path_type : 'custom',val : productPath.url.url};
        }
        else if(productPath.path_type == "defined"){
            dataToSave.productPath = {path_type : 'defined' , url : productPath.url}
        }

        try{
            fs.writeFileSync(`${productBrandName}-metadata.json`,JSON.stringify(dataToSave));
            res.status(200).json(`${productBrandName}-metadata.json`);
        }
        catch(err){
            console.log(`==> ERROR OCCURED <==`);
            console.log(err);
            res.status(500).end();
        }


    });

}

module.exports = saveMetaData;