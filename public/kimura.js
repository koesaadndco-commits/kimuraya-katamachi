(function () {

  var IMG=function(p){return p;};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  if (reduce) root.classList.add('static');
  var clamp = function(v,a,b){return Math.max(a,Math.min(b,v));};
  var ease = function(t){return 1-Math.pow(1-t,3);};
  var prog = function(el){var r=el.getBoundingClientRect(),d=r.height-innerHeight;return d>0?clamp(-r.top/d,0,1):0;};

  var hdr=document.getElementById('hdr'), xp=document.getElementById('xp'), xpCopy=document.getElementById('xpCopy');
  var film=document.getElementById('film'), pp=document.getElementById('pp'), bar=document.getElementById('xpBar');

  // reading reveal: split into characters
  var rt=document.getElementById('readText'), chars=[];
  (function split(node){
    Array.prototype.slice.call(node.childNodes).forEach(function(n){
      if(n.nodeType===3){
        var frag=document.createDocumentFragment();
        Array.from(n.textContent).forEach(function(c){var s=document.createElement('span');s.className='ch';s.textContent=c;frag.appendChild(s);chars.push(s);});
        n.parentNode.replaceChild(frag,n);
      } else if(n.nodeType===1){ split(n); }
    });
  })(rt);
  var marks=rt.querySelectorAll('.mk'), read=document.querySelector('.read'), readImg=document.querySelector('.read-side');

  var hs=document.getElementById('story'), track=document.getElementById('hsTrack'), hsProg=document.getElementById('hsProg'), hsYear=document.getElementById('hsYear'), cards=track.querySelectorAll('.hs-card');
  var wg=document.getElementById('fukui'), wgT=document.getElementById('wgTitles').children, wgSub=document.getElementById('wgSub'), wgDots=document.getElementById('wgDots').children;
  var subs=['福井の恵みを知りつくした目利きが、毎朝売り場に並べます。','港から、その日のうちに。越前の海の幸を、いちばん近くで。','木村フーズの手づくり惣菜と一緒に、今日の「いただきます」を。'];
  var wgIdx=0;

  function sizeHS(){
    if(reduce){hs.style.height='';return;}
    var extra=track.scrollWidth-innerWidth;
    hs.style.height=(innerHeight+Math.max(extra,0))+'px';
  }

  function frame(){
    var y=scrollY;
    // header state
    hdr.classList.toggle('solid', y > xp.offsetHeight - 90 || reduce);
    document.body.classList.toggle('has-ribbon', y < 30);

    if(!reduce){
      // HERO expansion
      var p=prog(xp), e=ease(clamp(p/0.8,0,1));
      var mobile=innerWidth<768;
      var w0=mobile?Math.min(240,innerWidth*.62):300, h0=mobile?320:400;
      xp.style.setProperty('--p',e.toFixed(4));
      xp.style.setProperty('--mw',(w0+(innerWidth-w0)*e)+'px');
      xp.style.setProperty('--mh',(h0+(innerHeight-h0)*e)+'px');
      xp.style.setProperty('--tx',(e*(mobile?180:150)).toFixed(2));
      var c=clamp((p-0.72)/0.2,0,1);
      xp.style.setProperty('--c',c.toFixed(3));
      xpCopy.classList.toggle('on',c>0.5);

      // reading reveal
      var rp=prog(read), n=Math.floor(clamp(rp/0.85,0,1)*chars.length);
      for(var i=0;i<chars.length;i++){chars[i].classList.toggle('on',i<n);}
      marks.forEach(function(m){var last=m.querySelectorAll('.ch');m.classList.toggle('on',last.length&&last[last.length-1].classList.contains('on'));});
      if(readImg) readImg.style.setProperty('--rp',rp.toFixed(3));

      // horizontal story
      var hp=prog(hs), extra=Math.max(track.scrollWidth-innerWidth,0);
      track.style.transform='translate3d('+(-hp*extra)+'px,0,0)';
      hsProg.style.width=(hp*100)+'%';
      var ci=Math.round(hp*(cards.length-1));
      var yr=cards[ci].getAttribute('data-y'); if(hsYear.textContent!==yr) hsYear.textContent=yr;

      // wipe gallery
      var gp=prog(wg);
      var w1=1-clamp((gp-0.18)/0.25,0,1), w2=1-clamp((gp-0.58)/0.25,0,1);
      wg.style.setProperty('--w1',w1.toFixed(4)); wg.style.setProperty('--w2',w2.toFixed(4));
      var idx=gp<0.3?0:(gp<0.7?1:2);
      if(idx!==wgIdx){
        for(var k=0;k<wgT.length;k++){wgT[k].className=k<idx?'out':(k>idx?'in':'');wgDots[k].className=k===idx?'on':'';}
        wgSub.textContent=subs[idx]; wgIdx=idx;
      }
    }
    ticking=false;
  }
  var ticking=false;
  function onScroll(){ if(!ticking){ticking=true;requestAnimationFrame(frame);} }
  addEventListener('scroll',onScroll,{passive:true});
  addEventListener('resize',function(){sizeHS();onScroll();});
  sizeHS(); frame();
  addEventListener('load',function(){sizeHS();frame();});

  // film controls
  if(film){
    film.addEventListener('timeupdate',function(){ if(film.duration) bar.style.width=(film.currentTime/film.duration*100)+'%'; });
    pp.addEventListener('click',function(){ if(film.paused){film.play();pp.textContent='Ⅱ 一時停止';pp.setAttribute('aria-label','映像を一時停止');} else {film.pause();pp.textContent='▶ 再生';pp.setAttribute('aria-label','映像を再生');} });
    if(reduce){film.pause();pp.textContent='▶ 再生';}
  }

  // ---- THEATER opening ----
  var th=document.getElementById('theater'), thFilm=document.getElementById('thFilm'), thPre=document.getElementById('thPre'), thBar=document.getElementById('thBar'), thCtrl=document.getElementById('thCtrl'), thMute=document.getElementById('thMute');
  var seen=false; try{ seen=sessionStorage.getItem('kimura-theater')==='1'; }catch(e){}
  function closeTheater(){
    if(th.classList.contains('gone')) return;
    th.classList.add('fade'); try{thFilm.pause();}catch(e){}
    document.body.style.overflow='';
    try{ sessionStorage.setItem('kimura-theater','1'); }catch(e){}
    setTimeout(function(){ th.classList.add('gone'); th.classList.remove('fade'); },1200);
    if(film) { var p=film.play(); if(p&&p.catch) p.catch(function(){}); }
  }
  function openTheater(){
    th.classList.remove('gone','fade'); thPre.classList.remove('off'); thFilm.classList.remove('on'); thCtrl.classList.remove('on');
    thBar.style.width='0'; thFilm.currentTime=0; document.body.style.overflow='hidden';
    if(film) film.pause();
  }
  document.getElementById('thPlay').addEventListener('click',function(){
    thPre.classList.add('off'); thFilm.muted=false; thFilm.currentTime=0;
    var p=thFilm.play(); if(p&&p.catch) p.catch(function(){ thFilm.muted=true; thFilm.play(); thMute.textContent='音を出す'; });
    thFilm.classList.add('on'); thCtrl.classList.add('on');
  });
  document.getElementById('thSkip').addEventListener('click',closeTheater);
  document.getElementById('thEnd').addEventListener('click',closeTheater);
  thMute.addEventListener('click',function(){ thFilm.muted=!thFilm.muted; thMute.textContent=thFilm.muted?'音を出す':'音を消す'; });
  thFilm.addEventListener('timeupdate',function(){ if(thFilm.duration) thBar.style.width=(thFilm.currentTime/thFilm.duration*100)+'%'; });
  thFilm.addEventListener('ended',closeTheater);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && !th.classList.contains('gone')) closeTheater(); });
  document.querySelectorAll('.js-replay').forEach(function(b){ b.addEventListener('click',openTheater); });
  if(seen){ th.classList.add('gone'); } else { document.body.style.overflow='hidden'; if(film) film.pause(); }

  // ---- narration with subtitles ----
  var narr=document.getElementById('narr'), sub=document.getElementById('xpSub'), vbtns=document.querySelectorAll('.js-voice');
  // 字幕の切り替え時刻（秒）は narration.mp3 の各行の開始位置に合わせてある（docs/narration-script.md 参照）
  var cues=[[0.0,'昭和二十一年、福井。'],[3.68,'小さな食料品店の木村屋から、すべては始まりました。'],[10.62,'毎朝、誰よりも早く売り場に立つ。'],[14.89,'昭和四十年には、片町フードセンターとして歩みはじめました。'],[22.06,'あの日の「いらっしゃい」から、今日の「ありがとう」まで。'],[26.57,'八十年たった今も、私たちは、この町の台所です。']];
  function setOn(on){ vbtns.forEach(function(b){ b.classList.toggle('on',on); b.lastChild.textContent= on?'再生中…':'物語を聴く'; }); sub.classList.toggle('on',on); if(!on) sub.textContent=''; }
  vbtns.forEach(function(b){ b.addEventListener('click',function(){
    if(!narr.paused){ narr.pause(); narr.currentTime=0; setOn(false); return; }
    var pr=narr.play(); if(pr&&pr.catch) pr.catch(function(){ setOn(false); });
    setOn(true);
  });});
  narr.addEventListener('timeupdate',function(){
    var t=narr.currentTime, txt=cues[0][1];
    for(var i=0;i<cues.length;i++){ if(t>=cues[i][0]) txt=cues[i][1]; }
    if(sub.textContent!==txt) sub.textContent=txt;
  });
  narr.addEventListener('ended',function(){ setOn(false); });

  // ---- today strip: wareki + season ----
  (function(){
    var d=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Tokyo'}));
    var y=d.getFullYear(), m=d.getMonth()+1, day=d.getDate(), wd='日月火水木金土'[d.getDay()];
    var rw=y-2018; document.getElementById('wareki').textContent='令和'+rw+'年'+m+'月'+day+'日（'+wd+'）';
    var s={1:'寒さのなかに、甘みを増した冬野菜。',2:'越前がにの季節も、いよいよ終盤です。',3:'春の芽吹き。山菜が並びはじめました。',4:'新生活のお弁当に、手づくり惣菜を。',5:'初夏の風。新茶とアスパラの季節です。',6:'梅しごとの季節。青梅が入荷しています。',7:'夏本番。冷やしておいしいものを、たっぷりと。',8:'お盆の集まりに、特製オードブルを。',9:'実りの秋。新米が並びはじめました。',10:'きのこと秋鮭がおいしい季節です。',11:'越前がに、解禁の季節がやってきました。',12:'一年の締めくくりに、ごちそうを。'};
    document.getElementById('season').textContent=s[m];
    var ann=document.querySelector('.finale .count'); if(ann) ann.textContent='1946 — '+y+' — 創業'+(y-1946)+'年目';
  })();

  // ---- dinner picker ----
  var dishes={
    warm:{tag:'あったまりたい夜に',name:'秋鮭と根菜の粕汁',text:'脂ののった秋鮭と、大根・人参・ごぼう。酒粕でコクを足せば、体の芯からぽかぽかに。',items:[['鮮魚','秋鮭'],['青果','大根・人参・ごぼう'],['日配','酒粕・油揚げ']],img:'/img/table.jpg'},
    fresh:{tag:'さっぱりしたい日に',name:'越前おろしそば',text:'たっぷりの大根おろしに、かつお節とねぎ。福井の食卓でおなじみの、つるっと食べられる一杯。',items:[['乾麺','そば'],['青果','辛み大根・ねぎ'],['乾物','かつお節']],img:'/img/fields.jpg'},
    feast:{tag:'ごちそうの日に',name:'ソースカツ丼',text:'薄めのカツをくぐらせた甘辛ソース。福井のごちそうといえば、やっぱりこれ。家族みんなで。',items:[['精肉','豚ロース'],['日配','パン粉・卵'],['調味料','ウスターソース']],img:'/img/hands.jpg'},
    quick:{tag:'10分で済ませたい日に',name:'手づくり惣菜で、あと一品',text:'木村フーズの煮物や揚げもの、旬のサラダをひと皿。温めて盛るだけで、ちゃんとした食卓に。',items:[['惣菜','煮物・唐揚げ'],['青果','カット野菜'],['ベーカリー','焼きたてパン']],img:'/img/crab.jpg'}
  };
  var dish=document.getElementById('dish'), chips=document.querySelectorAll('.chip');
  chips.forEach(function(c){ c.addEventListener('click',function(){
    chips.forEach(function(x){x.setAttribute('aria-pressed',x===c?'true':'false');});
    var d=dishes[c.getAttribute('data-k')]; dish.classList.add('swap');
    setTimeout(function(){
      document.getElementById('dishTag').textContent=d.tag; document.getElementById('dishName').textContent=d.name; document.getElementById('dishText').textContent=d.text;
      document.getElementById('dishImg').src=IMG(d.img);
      document.getElementById('dishList').innerHTML=d.items.map(function(it){return '<li><b>'+it[0]+'</b>'+it[1]+'</li>';}).join('');
      dish.classList.remove('swap');
    },280);
  });});

  // ---- store map ----
  var stores=[['大宮',36.07927,136.19795],['四ツ居',36.06345,136.24404],['やしろ',36.05575,136.18609],['西福井',36.07447,136.21021],['丸岡',36.11699,136.25716],['みくに',36.21449,136.15948],['東部',36.05234,136.24406]];
  var svg=document.getElementById('mapSvg'), NS='http://www.w3.org/2000/svg';
  var LON0=136.075, LON1=136.305, LAT1=36.245, LAT0=36.02;
  function P(lat,lon){ return [ (lon-LON0)/(LON1-LON0)*480, (LAT1-lat)/(LAT1-LAT0)*600 ]; }
  function el(n,a){ var e=document.createElementNS(NS,n); for(var k in a) e.setAttribute(k,a[k]); return e; }
  function path(pts){ return pts.map(function(p,i){var q=P(p[0],p[1]);return (i?'L':'M')+q[0].toFixed(1)+' '+q[1].toFixed(1);}).join(' '); }
  // sea (west of coast)
  var coast=[[36.245,136.140],[36.225,136.135],[36.205,136.122],[36.17,136.105],[36.13,136.088],[36.09,136.079],[36.05,136.075],[36.02,136.075]];
  svg.appendChild(el('path',{d:path(coast)+' L0 600 L0 0 Z',fill:'#16202e'}));
  svg.appendChild(el('path',{d:path(coast),fill:'none',stroke:'rgba(217,162,59,.5)','stroke-width':'1.2'}));
  // paddy grid
  for(var gx=0;gx<480;gx+=24){ svg.appendChild(el('line',{x1:gx,y1:0,x2:gx,y2:600,stroke:'rgba(255,255,255,.035)'})); }
  for(var gy=0;gy<600;gy+=24){ svg.appendChild(el('line',{x1:0,y1:gy,x2:480,y2:gy,stroke:'rgba(255,255,255,.035)'})); }
  // Kuzuryu river (approximate)
  var river=[[36.085,136.305],[36.095,136.27],[36.108,136.245],[36.12,136.222],[36.14,136.20],[36.165,136.185],[36.19,136.168],[36.212,136.152],[36.228,136.138]];
  svg.appendChild(el('path',{d:path(river),fill:'none',stroke:'rgba(120,160,210,.55)','stroke-width':'3','stroke-linecap':'round'}));
  var lab=function(t,lat,lon){var q=P(lat,lon);var x=el('text',{x:q[0],y:q[1],class:'lbl'});x.textContent=t;svg.appendChild(x);};
  lab('日 本 海',36.16,136.078); lab('九頭竜川',36.15,136.205); lab('坂井市',36.14,136.245); lab('福井市',36.035,136.13);
  var eki=P(36.0620,136.2233); svg.appendChild(el('rect',{x:eki[0]-4,y:eki[1]-4,width:8,height:8,fill:'none',stroke:'rgba(255,255,255,.6)'})); var et=el('text',{x:eki[0]+8,y:eki[1]+14,class:'lbl'}); et.textContent='福井駅'; svg.appendChild(et);
  var rows=document.querySelectorAll('#storeList .store'), pins=[];
  stores.forEach(function(s,i){
    var q=P(s[1],s[2]), g=el('g',{class:'pin',transform:'translate('+q[0].toFixed(1)+','+q[1].toFixed(1)+')',tabindex:'0',role:'button','aria-label':'食彩館 '+s[0]+'店'});
    g.appendChild(el('circle',{class:'halo',r:'9'})); g.appendChild(el('circle',{class:'core',r:'6'}));
    var t=el('text',{x:'10',y:'-8'}); t.textContent=s[0]; g.appendChild(t);
    svg.appendChild(g); pins.push(g);
    var hl=function(on){ g.classList.toggle('hl',on); if(rows[i]) rows[i].classList.toggle('hl',on); };
    g.addEventListener('mouseenter',function(){hl(true);}); g.addEventListener('mouseleave',function(){hl(false);});
    g.addEventListener('click',function(){ if(rows[i]) rows[i].scrollIntoView({behavior:'smooth',block:'center'}); });
    if(rows[i]){ rows[i].addEventListener('mouseenter',function(){hl(true);}); rows[i].addEventListener('mouseleave',function(){hl(false);}); }
  });
  document.getElementById('nearBtn').addEventListener('click',function(){
    var out=document.getElementById('nearOut');
    if(!navigator.geolocation){ out.textContent='この端末では現在地を取得できません'; return; }
    out.textContent='現在地を確認しています…';
    navigator.geolocation.getCurrentPosition(function(pos){
      var la=pos.coords.latitude, lo=pos.coords.longitude, best=0, bd=1e9;
      stores.forEach(function(s,i){ var dy=(s[1]-la)*111, dx=(s[2]-lo)*111*Math.cos(la*Math.PI/180), d=Math.sqrt(dx*dx+dy*dy); if(d<bd){bd=d;best=i;} });
      out.textContent='いちばん近いのは 食彩館 '+stores[best][0]+'店（約'+bd.toFixed(1)+'km）';
      pins.forEach(function(p,i){p.classList.toggle('hl',i===best);}); rows.forEach(function(r,i){r.classList.toggle('hl',i===best);});
    },function(){ out.textContent='現在地を取得できませんでした。一覧からお選びください。'; },{timeout:8000});
  });

  // ---- memories form (sample) ----
  document.getElementById('memForm').addEventListener('submit',function(e){
    e.preventDefault();
    var t=document.getElementById('mText');
    if(!t.value.trim()){ t.focus(); t.setAttribute('aria-invalid','true'); t.placeholder='ひとことでも大丈夫です。思い出を書いてください。'; return; }
    this.innerHTML='<p class="mem-thanks">すてきな思い出を、ありがとうございます。</p><p class="note-s" style="margin:0">［サンプル］本番では、スタッフが確認したあとにこのページへ掲載されます。</p>';
  });

  // ---- finale film: play when visible ----
  var ff=document.getElementById('finaleFilm');
  if(ff && 'IntersectionObserver' in window && !reduce){
    new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ ff.preload='auto'; var pr=ff.play(); if(pr&&pr.catch) pr.catch(function(){}); } else { ff.pause(); } }); },{threshold:.35}).observe(ff);
  }

  // store open status (JST)
  var now=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Tokyo'})),h=now.getHours()+now.getMinutes()/60;
  document.querySelectorAll('.store').forEach(function(s){
    var c=parseFloat(s.getAttribute('data-close')),o=s.querySelector('.open'),on=h>=8&&h<c;
    o.textContent=on?'営業中':'営業時間外';o.className='open '+(on?'on':'off');
  });

  // fade-up for blocks below the fold
  if('IntersectionObserver' in window && !reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.remove('pre');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.rv').forEach(function(el){ if(el.getBoundingClientRect().top>innerHeight){el.classList.add('pre');io.observe(el);} });
  }

})();
