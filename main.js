const apiKey = "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";
const maxImages = 4 ; // nomor untuk menggenerate yang akan di hasilkan
let selectedImageNumber = null;

// function to generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) +
    min ;   
}

//function to disable the generate button during processing
function disableGenerateButton(){
    document.getElementById("generate").disabled = true;
}

//function to disable the generate button after processing
function disableGenerateButton(){
    document.getElementById("generate").disabled = false;
}

//function to clear image grid

function clearImageGrid(){
    const imageGrid = document.getElementById("image-grid")
    imageGrid.innerHTML = "";
}

//Function to generate Image
async function generateImages(input){
    disableGenerateButton();
    clearImageGrid();

    const loading = document.getElementById("loading")
    loading.style.display = "block"

    const imageUrls = [];

    for (let i=0 ; i < maxImages; i++){
    //Generate a random number between 1 and 100 and append
    // it to the prompt
    const randomNumber = getRandomNumber(1,100000);
    const prompt  = `${input} ${randomNumber}`;
    //We Added random number to prompt to create different
    //result
    const response = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney-v4",
        {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({inputs:prompt}),
         }  
        );


        if (!response.ok){
            alert("Failed to generate image!")
        }

        const blob = await response.blob();
        const imgUrl = URL.createObjectURL(blob);
        imageUrls.push(imgUrl);
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = `art-${i + 1}`;
        img.onclick = () => downloadImage(imgUrl, i)
        document.getElementById("image-grid").appendChild(img);
    }

    loading.style.display = "none"
    enableGenerateButton();

    selectedImageNumber = null; // reset selected image number
}

document.getElementById("generate").addEventListener("click", 
    () => { 
        const input = document.getElementById("user-prompt").value;
        generateImages(input);
    });

function downloadImage (imgUrl, imageNumber){
    const link = document.createElement("a");
    link.href = imgUrl;
    //Set File name based on the selected image
    link.download = `image-${imageNumber + 1}.jpg`;
    link.click();

}