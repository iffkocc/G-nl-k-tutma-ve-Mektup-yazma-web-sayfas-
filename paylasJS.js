document.addEventListener('DOMContentLoaded', function () {

    // Bu sayfanın hangi "sayfa" (1-5) olduğunu belirtmek için
    // ilgili secilen-sayfa-N.html dosyasındaki <body> etiketine
    // data-sayfa="1"  (veya 2,3,4,5) eklemen gerekiyor.
    const sayfaNo = document.body.dataset.sayfa || '1';
    const editor = document.getElementById('editor');
    const aracKutusu = document.querySelector('.aracKutusu');

    // --- "Bağlantıyı Kopyala" butonu ---
    const linkBtn = document.createElement('button');
    linkBtn.type = 'button';
    linkBtn.id = 'linkOlusturBtn';
    linkBtn.className = 'btn btn-secondary';
    linkBtn.innerHTML = '🔗 Bağlantıyı Kopyala';
    linkBtn.style.marginTop = '20px';
    linkBtn.style.marginLeft = '20px';
    linkBtn.style.background = 'white';
    linkBtn.style.color = 'black';

    if (aracKutusu) {
        aracKutusu.appendChild(linkBtn);
    }

    // --- İsim modalı HTML'i sayfaya ekleniyor ---
    const modalHTML = `
    <div id="isimModalArka" class="isim-modal-arka">
      <div class="isim-modal-kutu">
        <p>Mektubu göndereceğiniz kişiye, kimden geldiğini göstermek için adınızı yazın:</p>
        <input type="text" id="gonderenIsim" placeholder="Adınız" maxlength="30">
        <div class="isim-modal-btnler">
          <button id="isimOnayla" type="button" class="btn btn-secondary">Bağlantıyı Oluştur</button>
          <button id="isimVazgec" type="button" class="btn btn-secondary">Vazgeç</button>
        </div>
        <p id="linkSonucMesaj" class="link-sonuc-mesaj"></p>
      </div>
    </div>`;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    const modalArka = document.getElementById('isimModalArka');
    const isimInput = document.getElementById('gonderenIsim');
    const sonucMesaj = document.getElementById('linkSonucMesaj');

    linkBtn.addEventListener('click', function () {
        modalArka.style.display = 'flex';
        isimInput.value = '';
        sonucMesaj.style.display = 'none';
        isimInput.focus();
    });

    document.getElementById('isimVazgec').addEventListener('click', function () {
        modalArka.style.display = 'none';
    });

    modalArka.addEventListener('click', function (e) {
        if (e.target === modalArka) modalArka.style.display = 'none';
    });

    document.getElementById('isimOnayla').addEventListener('click', function () {
        const isim = isimInput.value.trim();
        if (!isim) {
            isimInput.focus();
            return;
        }

        const veri = {
            m: editor.innerHTML,
            i: isim,
            s: sayfaNo
        };

        let kodlanmis;
        try {
            kodlanmis = btoa(unescape(encodeURIComponent(JSON.stringify(veri))));
        } catch (err) {
            sonucMesaj.textContent = 'Bağlantı oluşturulamadı, mektup çok uzun olabilir.';
            sonucMesaj.style.display = 'block';
            return;
        }

        // goruntule.html'in, secilen-sayfa dosyalarıyla AYNI klasörde olduğu varsayılıyor.
        const klasorYolu = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
        const link = window.location.origin + klasorYolu + 'goruntule.html?d=' + kodlanmis;

        navigator.clipboard.writeText(link).then(function () {
            sonucMesaj.textContent = 'Bağlantı kopyalandı! Artık paylaşabilirsiniz.';
            sonucMesaj.style.display = 'block';
        }).catch(function () {
            sonucMesaj.textContent = 'Otomatik kopyalanamadı, linki elle seçip kopyalayın:\n' + link;
            sonucMesaj.style.display = 'block';
        });
    });
});
