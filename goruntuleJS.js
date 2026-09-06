document.addEventListener('DOMContentLoaded', function () {

    // Her sayfa numarasına karşılık gelen arkaplan görseli.
    // Dosya adlarını/uzantılarını kendi "arkaplan" klasörüne göre düzenle.
    const SAYFA_BILGILERI = {
        '1': 'mektup-imgs/mektup-sayfa-1.jpg',
        '2': 'mektup-imgs/mektup-sayfa-2.jpg',
        '3': 'mektup-imgs/mektup-sayfa-3.png',
        '4': 'mektup-imgs/mektup-sayfa-4.jfif',
        '5': 'mektup-imgs/mektup-sayfa-5.jpg'
    };
    const bilgi_sayfa = {
        '1':'arkaplan/arkaplan-sayfa-1.jfif',
        '2':'arkaplan/arkaplan-sayfa-2.png',
        '3':'arkaplan/arkaplan-sayfa-3.png',
        '4':'arkaplan/arkaplan-sayfa-4.png',
        '5':'arkaplan/arkaplan-sayfa-5.jpg',
        
    };

    function veriyiCoz() {
        const params = new URLSearchParams(window.location.search);
        const kod = params.get('d');
        if (!kod) return null;

        try {
            const binary = atob(kod);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
                bytes[i] = binary.charCodeAt(i);
            }
            // fatal:false -> bozuk bir bayt olsa bile çökmez, o karakteri
            // "�" ile değiştirip devam eder.
            const json = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    }

    const veri = veriyiCoz();

    const soruEkrani = document.getElementById('soruEkrani');
    const zarfSahne = document.getElementById('zarfSahne');
    const mektupEkrani = document.getElementById('mektupEkrani');
    const hataEkrani = document.getElementById('hataEkrani');

    if (!veri || !veri.m || !veri.i) {
        soruEkrani.style.display = 'none';
        hataEkrani.style.display = 'flex';
        return;
    }

    document.getElementById('soruMetni').textContent =
        veri.i + ' tarafından size bir mektup var. Açmak ister misiniz?';

    document.getElementById('hayirBtn').addEventListener('click', function () {
        document.getElementById('soruMetni').textContent =
            'Tamam. Ne zaman isterseniz bu bağlantıya tekrar dönüp açabilirsiniz.';
        document.querySelector('.soru-btnler').style.display = 'none';
    });

    document.getElementById('evetBtn').addEventListener('click', function () {
        soruEkrani.style.display = 'none';
        zarfSahne.style.display = 'flex';

        requestAnimationFrame(function () {
            zarfSahne.classList.add('ac');
        });

        setTimeout(function () {
            zarfSahne.style.display = 'none';
            mektupEkrani.style.display = 'block';

            const arkaplanYolu = SAYFA_BILGILERI[String(veri.s)] || SAYFA_BILGILERI['1'];
            document.getElementById('mektupKutu').style.backgroundImage =
                "url('" + arkaplanYolu + "')";

            document.getElementById('mektupIcerik').innerHTML = veri.m;
        }, 1700);
    });
});
