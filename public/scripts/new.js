
products_scraped = [
    ["Bottega Vaenta Clutch","$289.00","Categories Bags Bottega Veneta",`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`],
    [
        "Bottega Vaenta Clutch","$289.00","Categories Bags Bottega Veneta",
        `Description

        Product code #191213-24
        100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
        Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
        Counter Quality Replica (True Mirror Image Replica)
        Dimensions: 35x19x1
        
        Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
        
        Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`
    ]
]

all_products_url_images = [
    ["http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5266-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5267-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5274-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5273-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5272-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5271-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5270-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5269-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5268-1-100x100.jpg"],
    ["http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5266-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5267-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5274-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5273-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5272-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5271-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5270-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5269-1-100x100.jpg","http://designer-discreet.ru/wp-content/uploads/2019/12/IMG_5268-1-100x100.jpg"],
]


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