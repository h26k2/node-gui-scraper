
const downloadImages = (app) => {

    let di_request = false;

    app.post("/downloadImages",(req,res)=>{

        if(di_request == false){
            
            req.setTimeout(0);
            console.log(`Request recieved for downloading images...`);

            let {links} = req.body;
            console.log(links);
            let folder = "test";

            try{
                fs.readdirSync(folder);
            }
            catch(err){
                fs.mkdirSync(folder);
            }

            let savedCount = 0;

            try{

                for(let i=0 ; i<links.length ; i++){
                
                    if(links[i] == null || links[i].length < 1){
                        savedCount++;
                        continue;
                    }
        
                    let imageName = links[i];
                    imageName = imageName.toLowerCase();
        
                    let startIndex = imageName.lastIndexOf("/") + 1;
                    let endIndex = imageName.length;
        
                    imageName = imageName.toLowerCase().substr(startIndex,endIndex);
        
                    const writer = fs.createWriteStream(`${folder}/${imageName}`);
        
                    let img_url = links[i];
        
                    const response = await axios({
                        url : encodeURI(img_url),
                        method: 'GET',
                        responseType: 'stream'
                    });
        
                    response.data.pipe(writer);
        
                    writer.on('finish',()=>{
        
                        savedCount++;
                        console.log(`saved image : ${savedCount} / ${links.length}`);
                        
        
                        if(savedCount == links.length){
                            console.log(`Successfully saved images...`)
                            res.status(200).end();
                        
                        }
            
                    });
        
                    writer.on('error',()=>{
                        console.log(`==> Writer Error <== `);
                    })
        
        
                }
    
            }
            catch(err){
                console.log(`==> ERROR OCCURED WHILE DOWNLOADING IMAGES <==`)
                console.log(err);
                res.status(500).end();
            }

        }

    });

}

module.exports = downloadImages;