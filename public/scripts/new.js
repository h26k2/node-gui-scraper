
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
            body_html += `<img src="${all_products_url_images[i][k]}" style="width:50px;margin:1px;"  />`;
        }

        body_html += `</td>`;

        body_html += `</tr>`;

    }

    let all_temp_html = `${heading_html}${body_html}`;

    table_elem.innerHTML = all_temp_html;
    

}