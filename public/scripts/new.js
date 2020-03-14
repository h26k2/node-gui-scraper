
let demo = [
    ["Bottega Vaenta Clutch 1","$289.00","Categories Bags Bottega Veneta" ,`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`,

    ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/44-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/Adidas/16-570x570.JPG",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/27-570x570.jpeg]"]

    ],
    ["Bottega Vaenta Clutch 2","$289.00","Categories Bags Bottega Veneta" ,`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`,

    ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/44-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/Adidas/16-570x570.JPG",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/27-570x570.jpeg]"]

    ],
    ["Bottega Vaenta Clutch 3","$289.00","Categories Bags Bottega Veneta" ,`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`,

    ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/44-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/Adidas/16-570x570.JPG",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/27-570x570.jpeg]"]

    ],
    ["Bottega Vaenta Clutch 4","$289.00","Categories Bags Bottega Veneta" ,`Description

    Product code #191213-23
    100% Genuine Leather Matching Quality of Original Louis Vuitton Production (imported from Europe)
    Comes with dust bag, authentication cards, box, shopping bag and pamphlets. Receipts are only included upon request.
    Counter Quality Replica (True Mirror Image Replica)
    Dimensions: 35x19x1
    
    Our Guarantee: The handbag you receive will look exactly as pictured on our professionally shot photos on our website (of our own stock) in terms of quality and description! Order from Designer Discreet and experience the difference today!
    
    Receive 15% off when you pay through Moneygram, Western Union, or wire transfer.`,

    ["https://officialchansneakers.com/image/cache/catalog/d_social_login/48-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/44-570x570.jpeg",
    "https://officialchansneakers.com/image/cache/catalog/Adidas/16-570x570.JPG",
    "https://officialchansneakers.com/image/cache/catalog/d_social_login/27-570x570.jpeg]"]

    ]
    
]

const viewScrapedData = () => {

    console.log(demo)

    

    for(let i=0 ; i<demo.length ; i++){
        
        let fields_len = demo[i].length;

        for(let j=0 ; j<fields_len ; j++ ){
            
            if(Array.isArray(demo[i][j])){
                console.log(j);
            }

        }

    }


}