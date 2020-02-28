
const findPageRoute = require("../methods/findPageRoute");

const saveMetaData = (app,fs) => {
    
    app.post(`/saveMetaData`,(req,res)=>{
        
        let {dataToSend} = req.body;
        let {custom_path} = req.query;

        //Saving metadata details to an object

        let {productCatalogURL,productBrandName,productCatalog,productSingleContainer,productImagesContainer,
            cols , productPagination} = req.body.dataToSend;

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
        
        if(custom_path == undefined){

            let {productSecondPageURL} = dataToSend;

            let returned_data = findPageRoute(productSecondPageURL);

            if(returned_data == -1){
                res.status(204).end();
                return;
            }

            dataToSave.productPath = {path_type : 'defined',returned_data};
            
        }
        else{
            dataToSave.productPath = {path_type : 'custom' , val : custom_path}
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