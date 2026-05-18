let products = [];

Papa.parse("products.csv", {
    download: true,
    header: true,
    complete: function(results) {

        products = results.data;

        const container = document.getElementById("products");

        products.forEach(product => {

            container.innerHTML += `
                <div class="card">
                    <img src="${product.immagine}">

                    <div class="card-content">
                        <h2>${product.marca}</h2>
                        <h3>${product.modello}</h3>

                        <p>${product.descrizione}</p>

                        <h3>€ ${product.prezzo}</h3>

                        <a href="product.html?id=${product.id}">
                            <button>Dettagli</button>
                        </a>
                    </div>
                </div>
            `;
        });
    }
});
