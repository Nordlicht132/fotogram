
// Speichern der Bilder in einer Konstanten Variable "images"!
// mit document.querySelectorAll werden alle img Elemente mit der Klasse '.content img' gesucht und img ist somit eine Liste!
const images = document.querySelectorAll('.contentimg img');


const lightbox = document.createElement('div'); // document.createElement erzeugt ein neues 'div' (noch nicht im HTML sichtbar)
lightbox.classList.add('lightbox'); // classList fügt dem div eine Klasse hinzu, um es in CSS Stylen zu können. 
lightbox.setAttribute('role', 'dialog'); // setAttribute role, dialog, aria-modal, aria-lable macht die Lightbox WCAG konform. 
lightbox.setAttribute('aria-modal', 'true');
lightbox.setAttribute('aria-label', 'Bildanzeige');
lightbox.style.display = 'none'; // lightbox ist auf der Seite nicht sichtbar (none), erst mit Klick auf ein Bild wird der Befehl ausgeführt.

lightbox.innerHTML = 
    `<button class="lightbox-close" aria-label="Schließen (Esc)">×</button> 
    <button class="lightbox-prev" aria-label="Vorheriges Bild">❮</button>
    <img class="lightbox-image" src="" alt="">
    <p class="lightbox-caption" aria-live="polite"></p>
    <button class="lightbox-next" aria-label="Nächstes Bild">❯</button>`; // innerHTML fügt dem HTML/div inhalte hinzu. Wie z.B "button".

document.body.appendChild(lightbox); //hängt die lightbox am ende des HTML Code.

// Fügt der lightbox funktionen hinzu, wie z.B. öffnen des Bildes, Pfeiltaste links und rechts.
const lightboxImage = lightbox.querySelector('.lightbox-image');
const lightboxCaption = lightbox.querySelector('.lightbox-caption');
const btnClose = lightbox.querySelector('.lightbox-close');
const btnPrev = lightbox.querySelector('.lightbox-prev');
const btnNext = lightbox.querySelector('.lightbox-next');

let currentIndex = 0;   // let ist eine veränderbare Variable, mit currentIndex = 0 ist der Startwert des Bildes null. 
 

// Funktionen der lightbox 
function openLightbox(index) {
    currentIndex = index;
    const img = images[index]; 

    // Bildquelle und Beschreibung übernehmen
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;

    // Bildbeschreibung aus data-Attribut
    const description = img.getAttribute('data-description') || '';
    lightboxCaption.textContent = description;

    lightbox.style.display = 'flex';
    btnClose.focus();

    // Zoom-Effekt beim Öffnen
    lightboxImage.classList.add('active');
}

function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImage.classList.remove('active');
    images[currentIndex].focus(); // nach schließen wird die Bilder Galarie wieder angezeig und die lightbox verschwindet. 
}

// erhöht den Index um +1 um zum nächsten Bild zu gelangen. 
function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    openLightbox(currentIndex);
}
// zeigt das vorherige Bild an, auch wenn currentIndex 0 ist - das erfolgt durch + images.length) % images.length.
function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    openLightbox(currentIndex);
}

// Klick-Events für Bilder
images.forEach((img, index) => {
    img.setAttribute('tabindex', '0'); // Fokus mit Tab
    img.addEventListener('click', () => openLightbox(index));
    img.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') openLightbox(index);
    });
});

// Buttons
btnClose.addEventListener('click', closeLightbox);
btnNext.addEventListener('click', showNext);
btnPrev.addEventListener('click', showPrev);

// Klick außerhalb des Bildes schließt lightbox
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
}); // === ist ein strenger Vergleich, ergibt es true, wird funktion ausgeführt. 

// Tastatursteuerung
document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    }
});