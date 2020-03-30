
const getDataFromTable = () => {

    let table = document.getElementById("scraped-product-table");
    let headingsElem  = table.getElementsByTagName("th");
    let recordsElem = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    let headings = [];
    Array.from(headingsElem).forEach((heading)=>{
        headings.push(heading.innerText);
    });

    let records = [];

    Array.from(recordsElem).forEach((record)=>{

        let dataSet = record.getElementsByTagName("td");
        let data = [];
        Array.from(dataSet).forEach((set)=>{

            let imgs = set.getElementsByTagName("img")
            let imgtemp = [];
            if(set.innerText == "" && imgs != undefined ){
                Array.from(imgs).forEach((img)=>{
                    imgtemp.push(img.src);
                });
                data.push(imgtemp)
            }
            else{
                data.push(set.innerText)
            }

        });
        records.push([...data])

    });

    return {
        headings , records
    }

}



const generateCSV = () => {

    let data = getDataFromTable();
    console.log(data);
    
}