document.getElementById('fileButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const imagePreview = document.getElementById('imagePreview');
        const imageAfter = document.getElementById('imageAfter');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        imagePreview.src = e.target.result;

        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // Red
                data[i + 1] = avg; // Green
                data[i + 2] = avg; // Blue
            }

            ctx.putImageData(imageData, 0, 0);
            imageAfter.src = canvas.toDataURL();
        };

        img.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

document.getElementById('imagePreview').addEventListener('change', function (event) {

        const imagePreview = document.getElementById('imagePreview');
        const imageAfter = document.getElementById('imageAfter');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        imagePreview.src = e.target.result;

            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg; // Red
                data[i + 1] = avg; // Green
                data[i + 2] = avg; // Blue
            }

            ctx.putImageData(imageData, 0, 0);
            imageAfter.src = canvas.toDataURL();

        img.src = e.target.result;
});