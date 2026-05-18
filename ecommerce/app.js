const csvUrl = localStorage.getItem('shop_csv') || 'default.csv'; // Fallback
const cssUrl = localStorage.getItem('shop_css');

if (cssUrl) {
    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    document.head.appendChild(link);
}

document.getElementById('shopTitle').innerText = "Shop Attivo - " + csvUrl;

let carrello = [];

Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
        const prodotti = results.data;
        mostraProdotti(prodotti);
    },
    error: function(err) {
        alert("Errore nel caricamento del file CSV. Assicurati di aver configurato ini.html correttamente.");
    }
});
function mostraProdotti(prodotti) {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = ''; // Pulisce la griglia

    prodotti.forEach((p, index) => {
        // Ignora righe vuote del CSV
        if(!p.marca || !p.prezzo) return; 

        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${p.immagine}" alt="${p.modello}" onerror="this.src='https://via.placeholder.com/250x150?text=No+Image'">
            <h3>${p.marca} - ${p.modello}</h3>
            <p>${p.descrizione}</p>
            <p class="prezzo">€ ${parseFloat(p.prezzo).toFixed(2)}</p>
            <button onclick="aggiungiAlCarrello('${p.marca}', '${p.modello}', ${p.prezzo})">Aggiungi al Basket</button>
        `;
        grid.appendChild(card);
    });
}

function aggiungiAlCarrello(marca, modello, prezzo) {
    carrello.push({ marca, modello, prezzo: parseFloat(prezzo) });
    aggiornaCarrello();
}

function aggiornaCarrello() {
    const lista = document.getElementById('cartItems');
    const totaleSpan = document.getElementById('cartTotal');
    
    lista.innerHTML = '';
    let totale = 0;

    carrello.forEach((item) => {
        const li = document.createElement('li');
        li.innerText = `${item.marca} ${item.modello} - €${item.prezzo.toFixed(2)}`;
        lista.appendChild(li);
        totale += item.prezzo;
    });

    totaleSpan.innerText = totale.toFixed(2);
}
function stampaPDF() {
    if(carrello.length === 0) {
        alert("Il basket è vuoto!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Ricevuta / Ordine", 20, 20);
    
    doc.setFontSize(12);
    let y = 40;
    let totale = 0;

    carrello.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.marca} ${item.modello} - Euro ${item.prezzo.toFixed(2)}`, 20, y);
        totale += item.prezzo;
        y += 10;
    });

    doc.setFontSize(16);
    doc.text(`TOTALE: Euro ${totale.toFixed(2)}`, 20, y + 10);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 20, y + 20);

    // Salva il PDF sul pc/telefono dell'utente
    doc.save("ordine_shop.pdf");
}
