function closestPowerOfTwo(n) {
    return Math.pow(2, Math.floor(Math.log(n) / Math.log(2)));
}

function applyFFT() {
    const imagePreview = document.getElementById('imagePreview');
    const imageAfter = document.getElementById('imageAfter');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    imagePreview.naturalWidth = 512;
    imagePreview.naturalHeight = 512;

    canvas.width = imagePreview.naturalWidth;
    canvas.height = imagePreview.naturalHeight;
    ctx.drawImage(imagePreview, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const src = imageData.data;

    var w = closestPowerOfTwo(imageData.width),
        h = imageData.height,
        re = [],
        im = [];

    FFT.init(w);
    FrequencyFilter.init(w);
    SpectrumViewer.init(ctx);
    SpectrumViewer.render(re, im);

    ctx.putImageData(imageData, 0, 0, 0, 0, w, h);
    imageAfter.src = canvas.toDataURL();
};

document.getElementById('fileButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.src = e.target.result;
    };

    reader.readAsDataURL(file);
});

