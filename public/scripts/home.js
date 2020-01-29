
const checkForEmpty = (inputs) => {

    let check = false;

    Array.from(inputs).forEach(input => {
        if(input.value.length < 2){
            check = true;
            return;
        }
    });

    return check;
}

const mainContainerChooser = () => {

    let inputs = document.getElementsByClassName("main-container-chooser");

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

    let websiteURL = inputs[0].value;
    let brandName = inputs[1].value;
    let columns = inputs[2].value.split(",");

    console.log(`website url is : ${websiteURL}`);
    console.log(`brand name is : ${brandName}`);
    console.log(`colum names are : ${columns}`);
    
    fetch(`/mainProducts`,{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json;charset=utf-8'
        },
        body : JSON.stringify({
            url : websiteURL,
        })
    })

}

const productDetailChooser = () => {

    let inputs = document.getElementsByClassName("main-container-chooser");
    
    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }

}

const saveMetaData = () => {

    let inputs = document.getElementsByClassName("main-container-chooser");

    if(checkForEmpty(inputs)){
        alert(`You can't leave above fields empty...`);
        return;
    }




}
