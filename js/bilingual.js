(function(){
  function select(lang){
    lang=lang==='zh'?'zh':'en';
    document.documentElement.dataset.readingLang=lang;
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    document.querySelectorAll('[data-set-lang]').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.setLang===lang));});
    document.querySelectorAll('[data-lang]').forEach(function(el){el.hidden=el.dataset.lang!==lang;});
    var title=document.querySelector('h1 [data-lang="'+lang+'"]');
    if(title)document.title=title.textContent;
    if(window.MathJax&&window.MathJax.typesetPromise)window.MathJax.typesetPromise().catch(function(){});
  }
  document.querySelectorAll('[data-set-lang]').forEach(function(b){b.addEventListener('click',function(){var lang=b.dataset.setLang;var u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u);select(lang);});});
  window.addEventListener('popstate',function(){select(new URL(location.href).searchParams.get('lang'));});
  select(new URL(location.href).searchParams.get('lang'));
  // A Chinese deep link may target content hidden until language selection runs.
  if(location.hash)requestAnimationFrame(function(){
    var id;try{id=decodeURIComponent(location.hash.slice(1));}catch(e){return;}
    var target=document.getElementById(id);if(target)target.scrollIntoView();
  });
})();
