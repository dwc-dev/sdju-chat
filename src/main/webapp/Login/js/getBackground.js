fetch("https://background.sdju.chat")
    .then((response) => {
        return response.blob();
    })
    .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        document.body.style.background = `url('${imageUrl}') no-repeat fixed`;
        document.body.style.backgroundSize = 'cover';
        console.log("Fetch background success!");
    })
    .catch((error) => {
        console.error("Fetch background error:", error);
    });
