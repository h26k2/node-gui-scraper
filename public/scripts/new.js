
let demo = [
    ["Bottega Vaenta Clutch 1","$289.00","Categories Bags Bottega Veneta" ,`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`,

    ],
    ["Bottega Vaenta Clutch 1","$289.00","Categories Bags Bottega Veneta" ,`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`,

    ],
    ["Bottega Vaenta Clutch 1","$289.00","Categories Bags Bottega Veneta" ,`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`,

    ],
    ["Bottega Vaenta Clutch 1","$289.00","Categories Bags Bottega Veneta" ,`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`,

    ]
    
]


let demo2 = [
    ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg"],
    
    ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg"],

    ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg"],

    ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg"]

]


const viewScrapedData = () => {

    //console.log(demo);
    //console.log(`==> ye rha <==`);
    
    let details = [];

    for(let i=0 ; i<demo.length ; i++){

        let temp = [];
        let temp2 = [];

        //for details
        for(let j=0 ; j<demo[i].length ; j++){
            temp.push(demo[i][j]);
        }

        for(let k=0 ; k<demo2[i].length ; k++){
            temp2.push(demo2[i][k]);            
        }
        
        details.push([...temp,[...temp2]]);

    }
   
    
    let table_elem = document.getElementById("scraped-product-table");

    let heading_html = `<thead><tr>`

    let headings_data = [];

    for(let i=0 ; i<userProductFields.length ; i++){
        heading_html += `<th> ${userProductFields[i]} </th>`
    }

    heading_html += `</tr></thead>`
    
    table_elem.innerHTML = heading_html;
    console.log(heading_html);




}