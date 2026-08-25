(function(){
  "use strict";

  /* ---------- Мягкие анимации при скролле ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if(reveals.length && 'IntersectionObserver' in window){
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold: 0.1});
    reveals.forEach(function(el){ revealObserver.observe(el); });
  }

  /* ---------- Мобильное меню ---------- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobile-nav');
  var scrim = document.getElementById('scrim');

  function openMobileNav(){
    mobileNav.classList.add('open');
    scrim.classList.add('show');
    burger.setAttribute('aria-expanded','true');
    document.body.style.overflow='hidden';
  }
  function closeMobileNav(){
    mobileNav.classList.remove('open');
    scrim.classList.remove('show');
    burger.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }
  if(burger){
    burger.addEventListener('click', function(){
      mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });
  }
  scrim.addEventListener('click', closeMobileNav);
  document.querySelectorAll('.mobile-nav .nav-link').forEach(function(link){
    link.addEventListener('click', closeMobileNav);
  });

  /* ---------- Модальное окно записи ---------- */
  var modalScrim = document.getElementById('modal-scrim');
  var modalEl = modalScrim.querySelector('.modal');
  var modalTitle = document.getElementById('modal-title');
  var modalClose = document.getElementById('modal-close');

  var modalTitles = {
    hero: 'Бесплатное ознакомительное занятие',
    booking: 'Забронируйте место в группе',
    a23: 'Забронируйте место в группе',
    oldprice: 'Запись по старой цене'
  };

  document.querySelectorAll('[data-open-modal]').forEach(function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var key = btn.getAttribute('data-open-modal');
      modalTitle.textContent = modalTitles[key] || 'Забронируйте место в группе';
      modalEl.classList.remove('success');
      modalScrim.classList.add('open');
      document.body.style.overflow='hidden';
    });
  });

  function closeModal(){
    modalScrim.classList.remove('open');
    document.body.style.overflow='';
  }
  modalClose.addEventListener('click', closeModal);
  modalScrim.addEventListener('click', function(e){
    if(e.target === modalScrim) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeModal(); closeLightbox(); }
  });

  /* ---------- Отправка форм (демо: без бэкенда) ---------- */
  document.querySelectorAll('.lead-form').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      // TODO: подключите приём заявок (Tilda forms / CRM / вебхук)
      if(form.closest('.modal')){
        form.closest('.modal').classList.add('success');
      } else {
        form.reset();
        alert('Спасибо! Заявка отправлена — мы скоро свяжемся с вами.');
      }
    });
  });

  /* ---------- Аккордеон FAQ ---------- */
  document.querySelectorAll('.accordion-item').forEach(function(item){
    var trigger = item.querySelector('.accordion-trigger');
    var panel = item.querySelector('.accordion-panel');
    trigger.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      item.closest('.accordion').querySelectorAll('.accordion-item').forEach(function(other){
        other.classList.remove('open');
        other.querySelector('.accordion-panel').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Слайдер тарифов ---------- */
  var tariffScroll = document.getElementById('tariff-scroll');
  var tariffTrack = document.getElementById('tariff-track');
  var tariffDotsWrap = document.getElementById('tariff-dots');
  var tariffPrev = document.querySelector('.tariff-arrow--prev');
  var tariffNext = document.querySelector('.tariff-arrow--next');
  if(tariffScroll && tariffTrack){
    var tariffCards = Array.prototype.slice.call(tariffTrack.children);
    tariffCards.forEach(function(_, i){
      var dot = document.createElement('span');
      if(i===0) dot.classList.add('active');
      dot.addEventListener('click', function(){
        tariffScroll.scrollTo({left: tariffCards[i].offsetLeft - tariffScroll.offsetLeft, behavior:'smooth'});
      });
      if(tariffDotsWrap) tariffDotsWrap.appendChild(dot);
    });
    function updateTariffDots(){
      if(!tariffDotsWrap) return;
      var scrollLeft = tariffScroll.scrollLeft;
      var closest = 0, min = Infinity;
      tariffCards.forEach(function(card, i){
        var d = Math.abs(card.offsetLeft - tariffScroll.offsetLeft - scrollLeft);
        if(d < min){ min = d; closest = i; }
      });
      Array.prototype.forEach.call(tariffDotsWrap.children, function(dot, i){
        dot.classList.toggle('active', i === closest);
      });
    }
    tariffScroll.addEventListener('scroll', function(){
      window.requestAnimationFrame(updateTariffDots);
    });
    if(tariffPrev) tariffPrev.addEventListener('click', function(){
      tariffScroll.scrollBy({left: -tariffScroll.clientWidth*0.85, behavior:'smooth'});
    });
    if(tariffNext) tariffNext.addEventListener('click', function(){
      tariffScroll.scrollBy({left: tariffScroll.clientWidth*0.85, behavior:'smooth'});
    });
  }

  /* ---------- Лайтбокс галереи ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var lightboxClose = document.getElementById('lightbox-close');
  var lightboxPrev = document.getElementById('lightbox-prev');
  var lightboxNext = document.getElementById('lightbox-next');
  var lightboxItems = Array.prototype.slice.call(document.querySelectorAll('[data-full]'));
  var currentIndex = 0;

  function showLightbox(index){
    if(!lightboxItems.length) return;
    currentIndex = (index + lightboxItems.length) % lightboxItems.length;
    var item = lightboxItems[currentIndex];
    if(item.classList.contains('no-photo')) return;
    var full = item.getAttribute('data-full');
    var img = item.querySelector('img');
    lightboxImg.src = full;
    lightboxImg.alt = img ? img.alt : '';
    lightbox.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow='';
  }
  lightboxItems.forEach(function(item, i){
    item.addEventListener('click', function(){ showLightbox(i); });
    item.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' ') showLightbox(i);
    });
  });
  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', function(){ showLightbox(currentIndex-1); });
  lightboxNext.addEventListener('click', function(){ showLightbox(currentIndex+1); });
  lightbox.addEventListener('click', function(e){
    if(e.target === lightbox) closeLightbox();
  });

  /* ---------- Слайдер отзывов ---------- */
  var track = document.getElementById('reviews-track');
  var dotsWrap = document.getElementById('reviews-dots');
  var prevBtn = document.querySelector('.review-arrow--prev');
  var nextBtn = document.querySelector('.review-arrow--next');
  if(track){
    var cards = Array.prototype.slice.call(track.children);
    cards.forEach(function(_, i){
      var dot = document.createElement('span');
      if(i===0) dot.classList.add('active');
      dot.addEventListener('click', function(){
        track.scrollTo({left: cards[i].offsetLeft - track.offsetLeft, behavior:'smooth'});
      });
      dotsWrap.appendChild(dot);
    });
    function updateDots(){
      var scrollLeft = track.scrollLeft;
      var closest = 0, min = Infinity;
      cards.forEach(function(card, i){
        var d = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
        if(d < min){ min = d; closest = i; }
      });
      Array.prototype.forEach.call(dotsWrap.children, function(dot, i){
        dot.classList.toggle('active', i === closest);
      });
    }
    track.addEventListener('scroll', function(){
      window.requestAnimationFrame(updateDots);
    });
    if(prevBtn) prevBtn.addEventListener('click', function(){
      track.scrollBy({left: -track.clientWidth*0.9, behavior:'smooth'});
    });
    if(nextBtn) nextBtn.addEventListener('click', function(){
      track.scrollBy({left: track.clientWidth*0.9, behavior:'smooth'});
    });
  }

  /* ---------- Обратный отсчёт до старта группы ---------- */
  var countdownEl = document.getElementById('countdown');
  if(countdownEl){
    // TODO: укажите реальную дату старта следующей группы (ISO-формат)
    var explicitTarget = countdownEl.getAttribute('data-target');
    var target;
    if(explicitTarget){
      target = new Date(explicitTarget);
    } else {
      // по умолчанию — ближайшее 1 или 15 число месяца, 10:00
      var now = new Date();
      target = new Date(now.getFullYear(), now.getMonth(), now.getDate() <= 14 ? 15 : 1, 10, 0, 0);
      if(target <= now){ target = new Date(now.getFullYear(), now.getMonth()+ (now.getDate() <=14?0:1), now.getDate()<=14?15:1,10,0,0); }
    }
    var elDays = countdownEl.querySelector('[data-cd="days"]');
    var elHours = countdownEl.querySelector('[data-cd="hours"]');
    var elMinutes = countdownEl.querySelector('[data-cd="minutes"]');
    var elSeconds = countdownEl.querySelector('[data-cd="seconds"]');

    function pad(n){ return String(n).padStart(2,'0'); }
    function tick(){
      var diff = target - new Date();
      if(diff < 0) diff = 0;
      var days = Math.floor(diff / 86400000);
      var hours = Math.floor((diff % 86400000) / 3600000);
      var minutes = Math.floor((diff % 3600000) / 60000);
      var seconds = Math.floor((diff % 60000) / 1000);
      elDays.textContent = pad(days);
      elHours.textContent = pad(hours);
      elMinutes.textContent = pad(minutes);
      elSeconds.textContent = pad(seconds);
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Header: тень при прокрутке ---------- */
  var header = document.getElementById('site-header');
  window.addEventListener('scroll', function(){
    header.style.boxShadow = window.scrollY > 8 ? '0 8px 24px -16px rgba(0,0,0,.6)' : 'none';
  });

})();