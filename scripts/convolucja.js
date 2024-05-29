const kernelgauss = [ //Gauss 
    [1, 2, 1],
    [2, 4, 2],
    [1, 2, 1]
];
const factorgauss = 1 / 16; //normalizacja bo z sumy 16 z macierzy
const biasgauss = 0; //jasnosc na +, a - ciemnieje

document.getElementById('fileButton').addEventListener('click', function () {
    document.getElementById('fileInput').click();
});

document.getElementById('selectMatrix').addEventListener('change', function (event) {

    const selectedValue = event.target.value;

    fetch('/data/matrix.json')
        .then(response => response.json())
        .then(data => {
            const matrixes = data.matrixes;
            const emboss = matrixes.Emboss;
            const highPass = matrixes.HighPass;
            const edgeDetection = matrixes.EdgeDetection;
            let matrixToIterate

            switch (selectedValue) {
                case "1":
                    matrixToIterate = emboss;
                    break;
                case "2":
                    matrixToIterate = highPass;
                    break;
                case "3":
                    matrixToIterate = edgeDetection;
                    break;
            }

            for (i = 0; i < matrixToIterate.length; i++) {
                document.getElementById('input' + (i+1)).value = matrixToIterate[i]
            }
            //console.log(matrixToIterate.length);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

document.getElementById('fileInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const imagePreview = document.getElementById('imagePreview');
        const imageAfter = document.getElementById('imageAfter');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const factor = 1 / parseInt(document.getElementById('factor').value, 10);
        const bias = parseInt(document.getElementById('bias').value, 10);

        console.log(bias + "" + factor);
        const kernel = [
            [],
            [],
            []
        ];

        for (let i = 1; i <= 9; i++) {
            const row = Math.floor((i - 1) / 3);
            const col = (i - 1) % 3;
            const input = document.getElementById('input' + i);
            kernel[row][col] = parseInt(input.value, 10);
        }

        imagePreview.src = e.target.result;

        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const width = imageData.width;
            const height = imageData.height;

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    let r = 0, g = 0, b = 0;

                    for (let j = 0; j < 3; j++) { //na sztywno najwyzej zmeinic gdy matrix bedzie mial inne wymiary
                        for (let i = 0; i < 3; i++) {
                            const pixelIndex = ((y + j) * width + (x + i)) * 4;
                            const weight = kernel[j][i];

                            r += data[pixelIndex] * weight;
                            g += data[pixelIndex + 1] * weight;
                            b += data[pixelIndex + 2] * weight;
                            //pamietac ze tu jest alfa!!!!!!!!!! [pixelIndex + 3]
                        }
                    }

                    r = Math.min(255, Math.max(0, Math.round(factor * r + bias)));
                    g = Math.min(255, Math.max(0, Math.round(factor * g + bias)));
                    b = Math.min(255, Math.max(0, Math.round(factor * b + bias)));

                    const dataIndex = (y * width + x) * 4;
                    data[dataIndex] = r;
                    data[dataIndex + 1] = g;
                    data[dataIndex + 2] = b;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            imageAfter.src = canvas.toDataURL();
        };
        img.src = e.target.result;
        event.target.value = '';
    };

    reader.readAsDataURL(file);
});

function applyConvolution() {
    const kernel = [
        [
            parseInt(document.getElementById('input1').value),
            parseInt(document.getElementById('input2').value),
            parseInt(document.getElementById('input3').value)
        ],
        [
            parseInt(document.getElementById('input4').value),
            parseInt(document.getElementById('input5').value),
            parseInt(document.getElementById('input6').value)
        ],
        [
            parseInt(document.getElementById('input7').value),
            parseInt(document.getElementById('input8').value),
            parseInt(document.getElementById('input9').value)
        ]
    ];

    const imagePreview = document.getElementById('imagePreview');
    const imageAfter = document.getElementById('imageAfter');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const factor = 1 / parseInt(document.getElementById('factor').value, 10);
    const bias = parseInt(document.getElementById('bias').value, 10);

    canvas.width = imagePreview.naturalWidth;
    canvas.height = imagePreview.naturalHeight;
    ctx.drawImage(imagePreview, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let r = 0, g = 0, b = 0;

            for (let j = 0; j < 3; j++) { //na sztywno najwyzej zmeinic gdy matrix bedzie mial inne wymiary
                for (let i = 0; i < 3; i++) {
                    const pixelIndex = ((y + j) * width + (x + i)) * 4;
                    const weight = kernel[j][i];

                    r += data[pixelIndex] * weight;
                    g += data[pixelIndex + 1] * weight;
                    b += data[pixelIndex + 2] * weight;
                    //pamietac ze tu jest alfa!!!!!!!!!! [pixelIndex + 3]
                }
            }

            r = Math.min(255, Math.max(0, Math.round(factor * r + bias)));
            g = Math.min(255, Math.max(0, Math.round(factor * g + bias)));
            b = Math.min(255, Math.max(0, Math.round(factor * b + bias)));

            const dataIndex = (y * width + x) * 4;
            data[dataIndex] = r;
            data[dataIndex + 1] = g;
            data[dataIndex + 2] = b;
        }
    }

    ctx.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    imageAfter.src = canvas.toDataURL();
};

