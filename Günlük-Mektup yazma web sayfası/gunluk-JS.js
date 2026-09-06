document.addEventListener('DOMContentLoaded', function() {

        document.getElementById('fontSecici').addEventListener('change', function() {
        document.getElementById('editor').focus();
        document.execCommand('fontName', false, this.value);
        
        if(this.value == 'none'){

            document.execCommand('fontName',false,'Arial, sans-serif');
        }else{
            document.execCommand('fontName', false, this.value);
        }
    });

      document.getElementById('boldBtn').addEventListener('click', function() {

        document.getElementById('editor').focus();
        document.execCommand('bold', false, null);
    });

    document.getElementById('italicBtn').addEventListener('click', function() {

        document.getElementById('editor').focus();
        document.execCommand('italic', false, null);
    });

    document.getElementById('boyutSecici').addEventListener('change', function() {

    document.getElementById('editor').focus();
    document.execCommand('fontSize', false, this.value);
});

document.getElementById('renkSecici').addEventListener('input', function() {

    document.getElementById('editor').focus();
    document.execCommand('foreColor', false, this.value);
});

document.getElementById('sol-yazi').addEventListener('click',function(){

     document.execCommand('justifyLeft');

});

document.getElementById('orta-yazi').addEventListener('click',function(){

     document.execCommand('justifyCenter');
  
});

document.getElementById('sag-yazi').addEventListener('click', function(){

    document.execCommand('justifyRight');
    
});




const editor = document.getElementById('editor');
const sagOkBtn = document.getElementById('sagOk');
const solOkBtn = document.getElementById('solOk');
const gunlukKutusu = document.querySelector('.gunlukk');

let sayfalar = [];
let sayfaGorselleri = []; 
let suankiSayfa = 0;

function verileriYukle(){

    const kayitliVeri = localStorage.getItem('gunlukSayfalari');

    if(kayitliVeri){
        sayfalar = JSON.parse(kayitliVeri);
    }else{
        sayfalar = [''];
    }

    const kayitliGorseller = localStorage.getItem('gunlukGorselleri');
    sayfaGorselleri = kayitliGorseller ? JSON.parse(kayitliGorseller) : [];

    const kayitliSayfaNo = localStorage.getItem('suankiSayfaNo');
    suankiSayfa = kayitliSayfaNo ? parseInt(kayitliSayfaNo): 0;

    sayfayiGoster();

}

function verileriKaydet(){

    sayfalar[suankiSayfa] = editor.innerHTML;

    localStorage.setItem('gunlukSayfalari', JSON.stringify(sayfalar));
    localStorage.setItem('suankiSayfaNo', suankiSayfa);
    localStorage.setItem('gunlukGorselleri', JSON.stringify(sayfaGorselleri));
}

function sayfayiGoster(){

    editor.innerHTML = sayfalar[suankiSayfa] || '';
      gorselleriGoster();

    if(suankiSayfa == 0){

        solOkBtn.style.display = 'none';
        gunlukKutusu.classList.remove('sag-sayfa-acik');
    }else{

        solOkBtn.style.display = 'inline-block';
        gunlukKutusu.classList.add('sag-sayfa-acik');
    }
}

    editor.addEventListener('input', verileriKaydet);

   sagOkBtn.addEventListener('click', function(){

    verileriKaydet();
    suankiSayfa++;

    if(!sayfalar[suankiSayfa]){
        sayfalar[suankiSayfa] = '';
    }

    sayfayiGoster();


});

function gorselleriGoster(){

   const eskiGorseller = document.querySelectorAll('img.eklenen-gorsel');
    eskiGorseller.forEach(function(img){ img.remove(); });

    const buSayfaninGorselleri = sayfaGorselleri[suankiSayfa] || [];

    buSayfaninGorselleri.forEach(function(veri){

        const img = document.createElement('img');
        img.src = veri.src;
        img.className = 'eklenen-gorsel';
        img.draggable = false;
        img.style.position = 'absolute';
        img.style.left = veri.left;
        img.style.top = veri.top;
        img.style.width = veri.width;
        img.style.cursor = 'move';
        img.style.zIndex = '9999';

        document.body.appendChild(img);
        suruklemeEkle(img, veri);
    });
}

solOkBtn.addEventListener('click', function(){

    verileriKaydet();   // önce mevcut sayfayı kaydet

    if(suankiSayfa > 0){
        suankiSayfa--;
    }

    sayfayiGoster();     // sonra yeni sayfayı göster — ikinci kaydet YOK
});

    verileriYukle();


    document.getElementById('gorselAcBtn').addEventListener('click', function(){
    document.getElementById('galeriInput').click();
});

document.getElementById('galeriInput').addEventListener('change', function(e){
    const dosya = e.target.files[0];
    if(!dosya) return;

    const reader = new FileReader();
    reader.onload = function(event){
        if(!sayfaGorselleri[suankiSayfa]){
            sayfaGorselleri[suankiSayfa] = [];
        }

        const kutuRect = gunlukKutusu.getBoundingClientRect();

        const veri = {

            src: event.target.result,
            left: (kutuRect.left + window.scrollX + kutuRect.width / 2 - 75) + 'px',
            top: (kutuRect.top + window.scrollY + kutuRect.height / 2 - 75) + 'px',
            width: '150px'
        };

        sayfaGorselleri[suankiSayfa].push(veri);
        verileriKaydet();
        gorselleriGoster();
    };
    reader.readAsDataURL(dosya);

    e.target.value = '';
});

function suruklemeEkle(eleman, veri){
    let aktif = false;
    let sonX, sonY;

    eleman.addEventListener('mousedown', function(e){
        aktif = true;
        sonX = e.clientX;
        sonY = e.clientY;
    });

    document.addEventListener('mousemove', function(e){
        if(!aktif) return;

        const renderRect = eleman.getBoundingClientRect();
        const yazilanGenislik = parseFloat(eleman.style.width) || renderRect.width;
        const olcek = renderRect.width / yazilanGenislik;

        const deltaX = (e.clientX - sonX) / olcek;
        const deltaY = (e.clientY - sonY) / olcek;

        const mevcutLeft = parseFloat(eleman.style.left) || 0;
        const mevcutTop = parseFloat(eleman.style.top) || 0;

        eleman.style.left = (mevcutLeft + deltaX) + 'px';
        eleman.style.top = (mevcutTop + deltaY) + 'px';

        sonX = e.clientX;
        sonY = e.clientY;

        const silRect = silKutusu.getBoundingClientRect();
        const ustundeMi = e.clientX >= silRect.left && e.clientX <= silRect.right &&
                           e.clientY >= silRect.top && e.clientY <= silRect.bottom;

        silKutusu.classList.toggle('sil-aktif', ustundeMi);
    });

    document.addEventListener('mouseup', function(e){
        if(!aktif) return;
        aktif = false;

        const silRect = silKutusu.getBoundingClientRect();
        const ustundeMi = e.clientX >= silRect.left && e.clientX <= silRect.right &&
                           e.clientY >= silRect.top && e.clientY <= silRect.bottom;

        silKutusu.classList.remove('sil-aktif');

        if(ustundeMi){
            const dizi = sayfaGorselleri[suankiSayfa];
            const index = dizi.indexOf(veri);
            if(index > -1) dizi.splice(index, 1);

            eleman.remove();
        }else{
            veri.left = eleman.style.left;
            veri.top = eleman.style.top;
        }

        verileriKaydet();
    });
}















});








