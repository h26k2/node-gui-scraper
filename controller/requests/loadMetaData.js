

const loadMetaData = (metaData,app) => {

    app.post(`/loadMetaData`,(req,res)=>{

        console.log(`==> Request recieved for loading metadata <==`)

        try{
            let data = JSON.parse(req.body.data);
            metaData.push(data);
            console.log(metaData);
            console.log(`==> Successfully loaded Metadata <==`);
            res.status(200).json(data);
        }
        catch(err){
            console.log(`==> ERROR OCCURED WHILE LOADING METADATA <==`);
            console.log(err);
            res.status(500).end();
        }

    });

}

module.exports = loadMetaData;