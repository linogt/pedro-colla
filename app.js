(()=>{
const P=PROJECTS,C=COOL,n=P.length,$=s=>document.querySelector(s),app=$('#app'),hd=$('#hd'),lb=$('#lb'),pad=i=>String(i).padStart(2,'0');
const m=(s,a,r)=>s?(/\.mp4$/i.test(s)?`<video src="${s}" muted loop playsinline preload="metadata" aria-label="${a}"></video>`:`<img src="${s}" alt="${a}" loading="lazy" decoding="async">`):`<div class="ph"${r?` style="aspect-ratio:${r}"`:''}><span>Imagem a definir</span></div>`;
let cur=0,li=0,opener=null,setHome=null,LIST=C,PL=[];

/* HOME — coluna vertical */
const homeHTML=()=>`<section class="home"><p class="intro rv"><span>Desenvolvendo identidades, imagens e ideias que conversam com o mundo através do design, da criatividade e da experimentação.</span></p>
<div class="sb"><div class="vw" id="st"><div class="vs">${P.map((p,i)=>`<button class="win" data-i="${i}" aria-label="${p.title}"><div class="fl" style="animation-delay:${-i*1.3}s">${m(p.cover,p.title)}</div></button>`).join('')}</div></div><div class="cap2" id="in"></div></div></section>`;
function initHome(){
 const wins=[...app.querySelectorAll('.win')],st=$('#st'),inf=$('#in');let lock=0;
 const set=i=>{cur=(i+n)%n;
  wins.forEach((w,k)=>{let d=(k-cur)%n;if(d>n/2)d-=n;if(d<-n/2)d+=n;const a=Math.abs(d);
   w.className='win'+(d==0?' c':'');w.style.setProperty('--s',d<0?-1:1);w.style.setProperty('--a',a);
   w.style.opacity=a>3?0:'';w.style.pointerEvents=a>3?'none':'';w.tabIndex=a>3?-1:0;});
  const p=P[cur];inf.innerHTML=`<b>${p.title}</b><span>${p.role}</span>`;
  inf.classList.remove('up');void inf.offsetWidth;inf.classList.add('up');};
 setHome=set;set(cur);
 wins.forEach(w=>w.onclick=()=>{if(w.classList.contains('c'))location.hash='#/work/'+P[cur].slug;else set(+w.dataset.i)});
 st.addEventListener('wheel',e=>{e.preventDefault();const t=Date.now();if(t-lock<650||Math.abs(e.deltaY)<8)return;lock=t;set(cur+(e.deltaY>0?1:-1))},{passive:false});
 let y0=null;st.addEventListener('touchstart',e=>y0=e.touches[0].clientY,{passive:true});
 st.addEventListener('touchend',e=>{if(y0===null)return;const d=e.changedTouches[0].clientY-y0;y0=null;if(Math.abs(d)>50)set(cur+(d<0?1:-1))});
}

/* WORK */
const work=()=>`<section class="work"><h1 class="rv">Work</h1><ol>${P.map((p,i)=>`<li class="rv"><a href="#/work/${p.slug}"><span>${pad(i+1)}</span><b>${p.title}</b><em>${p.role}</em><u>${p.year}</u></a></li>`).join('')}</ol></section>`;
const SP=[8,4,6,6,10];
function proj(s){const i=P.findIndex(p=>p.slug===s);if(i<0)return work();
 const p=P[i],pv=P[(i+n-1)%n],nx=P[(i+1)%n],off=0,z=(h,k)=>`<button class="zb" data-g="${k}" aria-label="Ampliar">${h}</button>`;
 PL=p.gallery.map(g=>({src:typeof g=='string'?g:g.src,alt:p.title}));
 return `<article class="proj"><div class="top"><h1 class="rv">${p.title}${p.sub?`<br><span>${p.sub}</span>`:''}</h1><p class="rv">${p.year?p.year+'<br>':''}<b>${p.role}</b></p></div>
<p class="desc rv">${p.full}</p>
<div class="gal">${p.gallery.length?p.gallery.map((g,k)=>{const o=typeof g=='string'?{src:g}:g;return `<figure class="rv" style="grid-column:span ${SP[k%SP.length]}">${z(m(o.src,o.cap||p.title,'4/3'),k+off)}${o.cap?`<figcaption>${o.cap}</figcaption>`:''}</figure>`}).join(''):'<p class="note rv">Galeria do projeto a definir</p>'}</div>
<nav class="pn"><a href="#/work/${pv.slug}"><small>← Projeto anterior</small><span>${pv.title}</span></a><a href="#/work/${nx.slug}"><small>Próximo projeto →</small><b>${nx.title}</b></a></nav></article>`}

/* COOL THINGS — [coluna inicial, largura, deslocamento topo(px), proporção] */
const L=[[1,4,0,'4/5'],[6,3,60,'1/1'],[10,3,20,'3/4'],[2,3,0,'1/1'],[5,5,40,'3/2'],[11,2,0,'3/4'],[1,5,20,'4/3'],[7,3,70,'4/5'],[10,3,0,'1/1'],[3,3,10,'3/4'],[6,4,50,'3/2'],[11,2,20,'1/1'],[1,4,0,'3/2'],[6,3,40,'3/4'],[9,4,10,'4/3'],[3,4,30,'4/3']];
const cool=()=>`<section class="cs"><p class="intro rv"><b>A collection</b> of experiments, concepts and <b>creative explorations</b></p><div class="wall">${C.map((c,i)=>{const l=L[i%L.length];return `<button class="cw rv" data-i="${i}" aria-label="Ampliar ${c.alt}" style="grid-column:${l[0]}/span ${l[1]};margin-top:${l[2]}px">${m(c.src,c.alt,l[3])}</button>`}).join('')}</div><canvas id="pad"></canvas><div class="tools"><button id="tg">Desenhar</button><button id="cl">Limpar</button></div></section>`;
const show=i=>{li=(i+LIST.length)%LIST.length;const c=LIST[li];$('#lf').innerHTML=m(c.src,c.alt,'4/3').replace(' loading="lazy"','').replace('<video','<video controls autoplay');$('#lc').textContent=pad(li+1)+' / '+LIST.length};
const open=(i,l)=>{LIST=l||C;opener=document.activeElement;$('#lp').hidden=$('#ln').hidden=LIST.length<2;show(i);lb.hidden=false;document.body.style.overflow='hidden';$('#lx').focus()};
const close=()=>{lb.hidden=true;document.body.style.overflow='';opener&&opener.focus({preventScroll:true})};
$('#lx').onclick=close;$('#lp').onclick=()=>show(li-1);$('#ln').onclick=()=>show(li+1);
lb.onclick=e=>{if(!e.target.closest('img,video,.ph,button'))close()};
let sx=null;lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>50)show(li+(d<0?1:-1))});
app.addEventListener('click',e=>{const b=e.target.closest('.cw');if(b)return open(+b.dataset.i,C);const zb=e.target.closest('.zb');if(zb)open(+zb.dataset.g,PL)});

function initCool(){
 const cv=$('#pad'),sec=cv.parentElement,c=cv.getContext('2d'),tg=$('#tg');let on=false,go=false;
 const fit=()=>{const d=devicePixelRatio||1,W=sec.clientWidth,H=sec.scrollHeight;if(cv.width==Math.round(W*d)&&cv.height==Math.round(H*d))return;
  const t=document.createElement('canvas');t.width=cv.width;t.height=cv.height;t.getContext('2d').drawImage(cv,0,0);
  cv.width=W*d;cv.height=H*d;cv.style.width=W+'px';cv.style.height=H+'px';c.drawImage(t,0,0);
  c.setTransform(d,0,0,d,0,0);c.lineWidth=3;c.lineCap=c.lineJoin='round';c.strokeStyle='#ff4f9a'};
 const pt=e=>{const b=cv.getBoundingClientRect();return[e.clientX-b.left,e.clientY-b.top]};
 tg.onclick=()=>{on=!on;if(on)fit();cv.classList.toggle('on',on);tg.classList.toggle('on',on);tg.textContent=on?'Parar':'Desenhar'};
 $('#cl').onclick=()=>{c.save();c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,cv.width,cv.height);c.restore()};
 cv.onpointerdown=e=>{fit();go=true;cv.setPointerCapture(e.pointerId);const p=pt(e);c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[0]+.1,p[1]);c.stroke()};
 cv.onpointermove=e=>{if(!go)return;const p=pt(e);c.lineTo(p[0],p[1]);c.stroke()};
 cv.onpointerup=cv.onpointercancel=()=>go=false;
}

/* ABOUT */
const about=()=>`<section class="about"><h1 class="rv">Sobre</h1><figure class="pf rv">${window.ABOUT_PHOTO?m(ABOUT_PHOTO.src,ABOUT_PHOTO.alt,'4/5'):''}</figure><div>${ABOUT.map(t=>`<p class="rv">${t}</p>`).join('')}<p class="lk rv"><a class="ic" href="mailto:pedro.colla1@gmail.com" aria-label="Enviar e-mail"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3.5 6.5l8.5 7 8.5-7"/></svg></a><a class="ic" href="https://www.instagram.com/pedrocolla__/" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6"/></svg></a></p></div></section>`;

/* ANIMAÇÃO DE ENTRADA, MENU, TECLADO, ROTAS */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.08});
const vio=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?e.target.play().catch(()=>{}):e.target.pause()),{threshold:.25});
const reveal=()=>{app.querySelectorAll('.rv').forEach((e,k)=>{e.style.transitionDelay=(k%5)*70+'ms';io.observe(e)});app.querySelectorAll('video').forEach(v=>vio.observe(v))};
$('#mb').onclick=()=>$('#mb').setAttribute('aria-expanded',hd.classList.toggle('open'));
addEventListener('keydown',e=>{
 if(!lb.hidden){if(e.key=='Escape')close();else if(e.key=='ArrowRight')show(li+1);else if(e.key=='ArrowLeft')show(li-1);return}
 if(setHome&&app.querySelector('.home')){if(e.key=='ArrowRight'||e.key=='ArrowDown')setHome(cur+1);else if(e.key=='ArrowLeft'||e.key=='ArrowUp')setHome(cur-1)}});
function route(){
 const[a,b]=location.hash.replace(/^#\/?/,'').split('/'),k=['work','about','cool'].includes(a)?a:'home';
 if(!lb.hidden)close();setHome=null;
 app.innerHTML={home:homeHTML,work:()=>b?proj(b):work(),about,cool}[k]();
 if(k=='home')initHome();if(k=='cool')initCool();
 document.querySelectorAll('nav a').forEach(x=>x.classList.toggle('on',x.dataset.k==k));
 const pr=k=='work'&&b&&P.find(p=>p.slug==b);
 document.title='Pedro Colla'+(k=='home'?'':' — '+(pr?pr.title:k.toUpperCase()));
 scrollTo({top:0,behavior:'instant'});reveal();hd.classList.remove('open');$('#mb').setAttribute('aria-expanded','false');}
addEventListener('hashchange',route);route();
/* cursor: bolinha amarelo neon */
if(matchMedia('(pointer:fine)').matches){const d=document.createElement('div');d.id='cur';document.body.appendChild(d);
 const f=matchMedia('(prefers-reduced-motion:reduce)').matches?1:.25;let x=0,y=0,tx=0,ty=0;
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;d.style.opacity=1});document.documentElement.addEventListener('mouseleave',()=>d.style.opacity=0);
 (function l(){x+=(tx-x)*f;y+=(ty-y)*f;d.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(l)})()}
})();
