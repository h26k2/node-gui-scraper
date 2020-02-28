

const loadMetaData = (metaData,app) => {

    app.post(`/loadMetaData`,(req,res)=>{

        console.log(`==> REQUEST RECIEVED FOR LOADING META DATA <==`)

        try{
            let data = JSON.parse(req.body.data);
            metaData.push(data);
            console.log(`==> SUCCESSFULLY LOADED METADATA <==`);
            res.status(200).end();
        }
        catch(err){
            console.log(`==> ERROR OCCURED WHILE LOADING METADATA <==`);
            console.log(err);
            res.status(500).end();
        }

    });

}

module.exports = loadMetaData;