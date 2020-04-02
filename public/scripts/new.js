
const viewScrapedData = () => {


    let table_elem = document.getElementById("scraped-product-table");

    let heading_html = `<thead><tr>`;

    for(let i=0 ; i<userProductFields.length ; i++){
        heading_html += `<th> ${userProductFields[i]} </th>`
    }

    heading_html += `</tr></thead>`;
    

    let body_html = `<tbody>`;


    for(let i=0 ;i<products_scraped.length ; i++){
        
        body_html += `<tr>`;

        //for details
        for(let j=0 ; j<products_scraped[i].length  ; j++){
            body_html += `<td> ${products_scraped[i][j]} </td>`;
        }

        //for images
        
        body_html += `<td>`;
        for(let k=0 ; k<all_products_url_images[i].length ; k++){
            body_html += `<img src="${all_products_url_images[i][k]}"  />`
        }
        body_html += `<ol>`;
        for(let k=0 ; k<all_products_url_images[i].length ; k++){
            body_html += `<li>${all_products_url_images[i][k]}</li>`
        }


        body_html += `</ol></td>`;

        body_html += `</tr>`;

    }

    let all_temp_html = `${heading_html}${body_html}`;

    table_elem.innerHTML = all_temp_html;
    

}

const stopScraping = (ask) => {

    let remove = false;

    let btn = document.getElementById("scrap-products-btn");

    if(btn.hasAttribute("data-action") == false){
        return;
    }

    if(ask){
        let userWish = confirm("Do you really want to stop scraping, the current state will be lost ");
        if(userWish){
            remove = true;
        }
    }
    else{
        remove = true;
    }
    
    if(remove){

        let attributesToRemove = ["data-scraped-product-current","data-scraped-product-start",
        "data-scraped-product-end","data-page-start","data-page-current","data-page-end" , "data-action"];

        for(attr of attributesToRemove){
            btn.removeAttribute(attr);
        }

        alert("Scraping state set to default.");

    }

}