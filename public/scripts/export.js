
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
            if(imgs.length > 0){
                Array.from(imgs).forEach((img)=>{
                    imgtemp.push(img.src);
                });
                data.push(imgtemp)
            }
            else{
                let {innerText} = set;
                if(innerText.match("\n")){
                    data.push(innerText.replace(/\n/gi,""));
                }
                else{
                    data.push(set.innerText)
                }
                
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
    let {headings , records} = data;
    console.log(headings);
    console.log(records);
    let rows = [] , i;

    for(i=0 ; i<headings.length ; i++){

        if(i == headings.length - 1){
            rows.push(`${headings[i]}\n`)
        }
        else{
            rows.push(`${headings[i]},`)
        }

    }
    
    for(i=0 ; i<records.length ; i++){

        for(let j=0 ; j<records[i].length ; j++){
            
            let lastchar = (j == records[i].length - 1) ? `\n` : `,`;            
            
            if(typeof records[i][j] == "string"){
                
                if(records[i][j].match(/\,/gi)){
                    rows.push(`\"${records[i][j]}\"${lastchar}`);
                }
                else{
                    rows.push(`${records[i][j]}${lastchar}`);
                }
                
            }
            else if(typeof records[i][j] == "object" && Array.isArray(records[i][j])){
                
                if(records[i][j].length > 1){

                    let temp = `\"`;
                    Array.from(records[i][j]).forEach((record)=>{
                        temp += `${record},`
                    });
                    temp = temp.substr(0,temp.length - 1);
                    temp += `\"`;
                    rows.push(`${temp}${lastchar}`);
                    
                }
                else{
                    rows.push(lastchar);
                }
                

            }
            else{
                rows.push(lastchar);
            }
            
        }

    }

    let csvString = ``;
    console.log(rows);
    for(let row of rows){
        csvString += row;
    }

    const blob = new Blob([csvString] , {type : 'text/csv'});
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('hidden','');
    a.setAttribute('href',url);
    a.setAttribute('download','products_csv.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);


}