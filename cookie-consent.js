(function(){
  "use strict";

  var CONSENT_KEY = "site_cookie_consent"; // "accepted" | "declined"

  // !!! Укажите номер вашего счётчика Яндекс.Метрики (только цифры) !!!
  var YM_COUNTER_ID = 90280024

  function getConsent(){
    try { return localStorage.getItem(CONSENT_KEY); } catch(e){ return null; }
  }
  function setConsent(value){
    try { localStorage.setItem(CONSENT_KEY, value); } catch(e){ /* localStorage недоступен — баннер будет появляться повторно */ }
  }

  /* ---------- Загрузка Яндекс.Метрики (только после согласия) ---------- */
  function loadYandexMetrika(){
    if(!YM_COUNTER_ID || !/^\d+$/.test(YM_COUNTER_ID) || window.ym) return;

    (function(m,e,t,r,i,k,a){
      m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
      m[i].l=1*new Date();
      for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) { return; }
      }
      k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
    })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

    ym(YM_COUNTER_ID, "init", {
      clickmap:true,
      trackLinks:true,
      accurateTrackBounce:true,
      webvisor:true
    });

    // noscript-пиксель добавляем через JS, чтобы счётчик тоже включался
    // только после согласия пользователя
    var pixel = document.createElement("img");
    pixel.src = "https://mc.yandex.ru/watch/" + YM_COUNTER_ID;
    pixel.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;";
    pixel.alt = "";
    document.body.appendChild(pixel);
  }

  /* ---------- Баннер согласия на использование cookie ---------- */
  function initBanner(){
    var banner = document.getElementById("cookie-banner");
    if(!banner) return;

    var acceptBtn = document.getElementById("cookie-accept");
    var declineBtn = document.getElementById("cookie-decline");

    function hideBanner(){
      banner.classList.remove("show");
    }

    acceptBtn && acceptBtn.addEventListener("click", function(){
      setConsent("accepted");
      hideBanner();
      loadYandexMetrika();
    });

    declineBtn && declineBtn.addEventListener("click", function(){
      setConsent("declined");
      hideBanner();
    });

    var consent = getConsent();
    if(consent === "accepted"){
      loadYandexMetrika();
    } else if(consent !== "declined"){
      // согласие ещё не получено — показываем баннер
      window.requestAnimationFrame(function(){ banner.classList.add("show"); });
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", initBanner);
  } else {
    initBanner();
  }
})();