// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // Set tahun di footer
  // ===============================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ===============================
  // Dropdown & Mobile Menu
  // ===============================
  const dropdownBtn = document.getElementById('dropdownBtn');
  const dropdownMenu = document.getElementById('dropdownMenu');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');

  if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('hidden');
    });
    document.addEventListener('click', (e) => {
      if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
        dropdownMenu.classList.add('hidden');
      }
    });
  }

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  // ===============================
  // Data Dummy Campaign
  // ===============================
  const campaigns = [
    { id: 1, name: 'Siti - Kanker Payudara', target: 100000000, collected: 25000000, img: 'pasien1.jpg', desc: 'Bantuan untuk pengobatan Siti' },
    { id: 2, name: 'Budi - Kanker Hati', target: 80000000, collected: 50000000, img: 'pasien2.jpeg', desc: 'Perawatan dan operasi' },
    { id: 3, name: 'Ani - Kanker Anak', target: 120000000, collected: 90000000, img: 'pasien3.jpg', desc: 'Kemoterapi lanjutan' },
    { id: 4, name: 'Rina - Kanker Paru', target: 60000000, collected: 45000000, img: 'pasien3.jpg', desc: 'Perawatan suportif' }
  ];

  const formatRupiah = (num) => 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const calcPercent = (c, t) => Math.min(100, Math.round((c / t) * 100));

  // ===============================
  // Buat Kartu Kampanye
  // ===============================
  function createCard(camp) {
    const card = document.createElement('div');
    card.className = 'campaign-card p-4 fade-in';
    card.innerHTML = `
      <img src="${camp.img}" alt="${camp.name}" class="w-full h-40 object-cover rounded-md" />
      <h4 class="font-semibold mt-3">${camp.name}</h4>
      <p class="text-sm text-gray-500 mt-1">${camp.desc}</p>
      <div class="mt-3">
        <div class="text-sm">${formatRupiah(camp.collected)} dari ${formatRupiah(camp.target)}</div>
        <div class="progress mt-2"><div class="progress-fill" style="width:0%" data-percent="${calcPercent(camp.collected, camp.target)}"></div></div>
      </div>
      <div class="mt-4 flex items-center justify-between">
        <button class="love-btn btn-love" data-id="${camp.id}">❤ <span class="ml-1 count">0</span></button>
        <div class="flex gap-2">
          <button class="px-3 py-1 bg-pink-500 text-white rounded donate-btn" data-id="${camp.id}">Donasi Sekarang</button>
        </div>
      </div>
    `;
    return card;
  }

  const slider = document.getElementById('campaignSlider');
  const allCampaigns = document.getElementById('allCampaigns');
  if (slider) campaigns.slice(0, 3).forEach(c => slider.appendChild(createCard(c)));
  if (allCampaigns) campaigns.forEach(c => allCampaigns.appendChild(createCard(c)));

  // Animasi muncul & progress bar
  document.querySelectorAll('.fade-in').forEach((el, i) => {
    setTimeout(() => el.classList.add('show'), 100 * i);
  });
  document.querySelectorAll('.progress-fill').forEach(p => {
    const percent = p.dataset.percent || 0;
    setTimeout(() => p.style.width = percent + '%', 400);
  });

  // ===============================
  // Fungsi Klik Tombol
  // ===============================
  document.addEventListener('click', (e) => {
    if (e.target.closest('.donate-btn')) {
      // tombol Donasi Sekarang
      window.location.href = 'formdonasi.html';
    }

    if (e.target.closest('.view-detail')) {
      // tombol Lihat Detail
      window.location.href = 'formdonasi.html';
    }

    if (e.target.closest('.btn-love')) {
      const btn = e.target.closest('.btn-love');
      const id = btn.dataset.id;
      const likes = JSON.parse(localStorage.getItem('likes') || '{}');
      likes[id] = (likes[id] || 0) + 1;
      localStorage.setItem('likes', JSON.stringify(likes));
      btn.querySelector('.count').textContent = likes[id];
      btn.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2)' }, { transform: 'scale(1)' }], { duration: 200 });
    }
  });

  // ===============================
  // Testimoni Carousel
  // ===============================
  const testimonials = [
    { name: 'Feast', text: 'Terima kasih, donasi membantu proses kemoterapi anak saya.', img: 'testi1.jpg' },
    { name: 'Murp', text: 'Proses verifikasi cepat dan transparan.', img: 'testi2.jpg' },
    { name: 'Hindia', text: 'Saya mendapat dukungan luar biasa dari komunitas.', img: 'testi3.jpg' }
  ];
  const testimonialInner = document.getElementById('testimonialInner');
  if (testimonialInner) {
    testimonials.forEach(t => {
      const slide = document.createElement('div');
      slide.className = 'min-w-full flex gap-4 items-center';
      slide.innerHTML = `
        <img src="${t.img}" class="w-20 h-20 rounded-full object-cover" />
        <div>
          <h5 class="font-semibold">${t.name}</h5>
          <p class="text-gray-600">${t.text}</p>
        </div>
      `;
      testimonialInner.appendChild(slide);
    });
    let testiIndex = 0;
    setInterval(() => {
      testiIndex = (testiIndex + 1) % testimonials.length;
      testimonialInner.style.transform = `translateX(-${testiIndex * 100}%)`;
    }, 10000);
  }

  // ===============================
  // Progress & Donasi Page
  // ===============================
  const progressBar = document.getElementById('progress-bar');
  const terkumpulEl = document.getElementById('terkumpul');
  if (progressBar && terkumpulEl) {
    let terkumpul = 25000000;
    const target = 100000000;
    const persen = (terkumpul / target) * 100;
    progressBar.style.width = `${persen}%`;

    let angka = 0;
    const animasi = setInterval(() => {
      if (angka >= terkumpul) {
        clearInterval(animasi);
      } else {
        angka += 500000;
        terkumpulEl.textContent = `Rp ${angka.toLocaleString('id-ID')}`;
      }
    }, 50);
  }

  // Notifikasi donasi
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Terima kasih atas donasi Anda! 💖');
      donationForm.reset();
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const loveButtons = document.querySelectorAll('.love-btn');

  // Ambil data love tersimpan
  let lovedItems = JSON.parse(localStorage.getItem('lovedItems')) || [];

  // Set status awal (jika sudah dilove sebelumnya)
  loveButtons.forEach((btn) => {
    const id = btn.dataset.id;
    if (lovedItems.includes(id)) {
      btn.classList.add('active');
    }

    // Saat tombol love diklik
    btn.addEventListener('click', () => {
      if (lovedItems.includes(id)) {
        lovedItems = lovedItems.filter((item) => item !== id);
        btn.classList.remove('active');
      } else {
        lovedItems.push(id);
        btn.classList.add('active');
      }

      // Simpan ke localStorage
      localStorage.setItem('lovedItems', JSON.stringify(lovedItems));
    });
  });
});
