import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  Home, Calendar, Smile, AlertTriangle, Plus, Search, Check, X, 
  ChevronDown, ChevronLeft, ChevronRight, Phone, Clock, ArrowRight, 
  BookOpen, Brain, RefreshCw, Eye, EyeOff, LogOut, ExternalLink, 
  Filter, Flame, Menu, Bell, Settings, TrendingUp, TrendingDown, 
  Minus, MessageSquare, Leaf, Star, AlertCircle, CheckCircle,
  Play, Pause, RotateCcw, Target, Sparkles
} from "lucide-react";

// ═══════════════════════════════════════════════════
//  CONSTANTS & CONFIG
// ═══════════════════════════════════════════════════
const BURNOUT_KW = [
  "nie mam siły","przytłacza","koniec z tym","dość","nie mogę",
  "wypalenie","rezygnuję","za dużo","zmęczony","zmęczona",
  "załamanie","beznadziejna","desperacja","płaczę","nie daję rady"
];
const CATS = [
  { id:"praca",   label:"Praca",   emoji:"💼", tw:"bg-sky-50 text-sky-700 border-sky-200" },
  { id:"dom",     label:"Dom",     emoji:"🏠", tw:"bg-amber-50 text-amber-700 border-amber-200" },
  { id:"zdrowie", label:"Zdrowie", emoji:"💚", tw:"bg-emerald-50 text-emerald-700 border-emerald-200" },
];
const PRIOS = [
  { id:"niski",  label:"niski priorytet",  tw:"bg-green-100 text-green-700",  dot:"bg-green-400"  },
  { id:"sredni", label:"średni priorytet", tw:"bg-yellow-100 text-yellow-700", dot:"bg-yellow-400" },
  { id:"wysoki", label:"wysoki priorytet", tw:"bg-red-100 text-red-700",       dot:"bg-red-400"    },
];
const CONTACTS = [
  { org:"Instytut Psychologii Zdrowia PTP",  name:"Kryzysowy Telefon Zaufania",      phone:"116 123",      hours:"14:00–22:00",    url:"psychologia.edu.pl" },
  { org:"Fundacja ITAKA (na zlecenie NFZ)",  name:"Centrum Wsparcia",                phone:"800 70 22 22", hours:"24/7 Całodobowy", url:"psychologia.edu.pl" },
  { org:"Fundacja ITAKA",                    name:"Antydepresyjny Telefon Zaufania", phone:"22 484 88 01", hours:"Różne dyżury",    url:"stopdepresji.pl"    },
  { org:'Stow. "Niebieska Linia"',           name:"Niebieska Linia",                 phone:"800 120 002",  hours:"24/7 Całodobowy", url:"niebieskalinia.pl"  },
  { org:"Fundacja Dajemy Dzieciom Siłę",     name:"Telefon dla Dzieci i Młodzieży", phone:"116 111",      hours:"24/7 Całodobowy", url:"116111.pl"          },
  { org:"Państwowe Ratownictwo Medyczne",    name:"Numer Alarmowy",                  phone:"112",          hours:"24/7 Całodobowy", url:"gov.pl"             },
];
const EMOJIS = ["😫","😟","😐","😊","😄"];
const MOOD_L = ["Bardzo źle","Źle","Neutralnie","Dobrze","Świetnie"];
const DAYS   = ["Pon","Wt","Śr","Czw","Pt","Sb","Ndz"];

const INIT_TASKS = [
  { id:1, title:"Spotkanie zespołowe",  cat:"praca", w:8, p:"wysoki", done:false, t:"08:00–10:00",  desc:"Omówienie materiałów", hour:8  },
  { id:2, title:"Praca nad raportem A", cat:"praca", w:6, p:"sredni", done:true,  t:"10:00–11:00", desc:"Dokończenie wniosków", hour:10 },
  { id:3, title:"Code review",          cat:"praca", w:10, p:"niski",  done:false, t:"11:40–12:40", desc:"", hour:11 },
];
const INIT_MOODS = [
  {id:1,d:"2025-10-13",v:2},{id:2,d:"2025-10-14",v:3},
];

// ═══════════════════════════════════════════════════
//  STORAGE & TOASTS
// ═══════════════════════════════════════════════════
const ls = {
  get:(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}},
  set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
};
function usePersist(key, init) {
  const [s,set] = useState(()=>ls.get(key,init));
  const save = useCallback(v=>set(p=>{const n=typeof v==="function"?v(p):v;ls.set(key,n);return n;}),[key]);
  return [s,save];
}
function useToasts() {
  const [ts,setTs]=useState([]);
  const add=useCallback((msg,type="ok")=>{
    const id=Date.now()+Math.random();
    setTs(p=>[...p,{id,msg,type}]);
    setTimeout(()=>setTs(p=>p.filter(t=>t.id!==id)),4000);
  },[]);
  const rm=useCallback(id=>setTs(p=>p.filter(t=>t.id!==id)),[]);
  return {ts,add,rm};
}

// ═══════════════════════════════════════════════════
//  UI ELEMENTS
// ═══════════════════════════════════════════════════
function Font() {
  useEffect(()=>{
    const el=Object.assign(document.createElement("link"),{
      rel:"stylesheet",
      href:"https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
    });
    document.head.appendChild(el);
    return ()=>{try{document.head.removeChild(el);}catch{}};
  },[]);
  return null;
}
function Toasts({ts,rm}) {
  return (
    <div className="fixed top-5 right-5 z-[9999] space-y-2 max-w-xs pointer-events-none">
      {ts.map(t=>(
        <div key={t.id} className={`flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-medium pointer-events-auto border ${
          t.type==="warn" ? "bg-red-600 text-white border-red-500" : "bg-[#1E5C36] text-white border-[#164a2c]"
        } transition-all duration-300 animate-in slide-in-from-right`}>
          <span className="flex-1 leading-relaxed">{t.msg}</span>
          <button onClick={()=>rm(t.id)} className="opacity-60 hover:opacity-100 flex-shrink-0 mt-0.5"><X size={14}/></button>
        </div>
      ))}
    </div>
  );
}
function Sk({cls=""}) {
  return <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded-2xl ${cls}`}/>;
}
function SkeletonScreen() {
  return (
    <div className="p-6 space-y-4 pt-14">
      <Sk cls="h-7 w-44"/>
      <Sk cls="h-4 w-64"/>
      <div className="space-y-3 mt-4">
        {[80,72,72,72].map((h,i)=><Sk key={i} cls={`h-${h===80?"20":"16"} w-full`}/>)}
      </div>
      <Sk cls="h-48 w-full mt-2"/>
    </div>
  );
}
function PBadge({p}) {
  const pr=PRIOS.find(x=>x.id===p)||PRIOS[0];
  return <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${pr.tw}`}>{pr.label}</span>;
}

// ═══════════════════════════════════════════════════
//  LANDING PAGE
// ═══════════════════════════════════════════════════
function Landing({onCTA}) {
  const S={fontFamily:"'DM Sans',sans-serif"};
  const H={fontFamily:"'Lora',serif"};
  return (
    <div style={S} className="bg-[#F5EFE6] min-h-screen">
      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#E8DDD0] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span style={H} className="text-[#1E5C36] font-bold text-xl tracking-tight">Wellbeing app</span>
          <div className="flex gap-2">
            <button onClick={()=>onCTA("login")} className="px-5 py-2 text-sm font-semibold text-[#1E5C36] border-2 border-[#1E5C36] rounded-full hover:bg-[#1E5C36] hover:text-white transition-all duration-200">Zaloguj się</button>
            <button onClick={()=>onCTA("register")} className="px-5 py-2 text-sm font-semibold bg-[#1E5C36] text-white rounded-full hover:bg-[#164a2c] transition-all duration-200 shadow-lg shadow-green-900/20">Zarejestruj się</button>
          </div>
        </div>
      </nav>
      <section className="px-6 py-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h1 style={H} className="text-5xl font-bold text-[#1A2F22] leading-[1.12] mb-6">
            Zdobądź kontrolę<br/>nad swoim dniem<br/><em className="not-italic text-[#2D9E6B]">i zadbaj<br/>o dobrostan</em>
          </h1>
          <p className="text-[#5A7368] text-lg leading-relaxed mb-8">
            Aplikacja dla pracowników, która łączy inteligentny harmonogram z monitorowaniem nastroju, by wcześnie wykrywać możliwe symptomy wypalenia zawodowego.
          </p>
          <button onClick={()=>onCTA("register")} className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#1E5C36] text-white rounded-full font-semibold hover:bg-[#164a2c] shadow-xl shadow-green-900/25 transition-all hover:-translate-y-0.5">
            Dowiedz się więcej <ArrowRight size={18}/>
          </button>
        </div>
        <div className="relative flex items-center justify-center h-72">
          <div className="absolute w-72 h-72 rounded-full bg-[#E8B94F]/12 blur-3xl"/>
          <div className="absolute w-48 h-48 rounded-full bg-[#2D9E6B]/10 blur-2xl translate-x-10"/>
          <span className="relative z-10 text-[120px] leading-none select-none drop-shadow-2xl">🌿</span>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-[11px] font-bold text-[#2D9E6B] uppercase tracking-[0.25em] mb-3">Nasz produkt</p>
          <h2 style={H} className="text-4xl font-bold text-center text-[#1A2F22] mb-14">Największe korzyści</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {icon:"📅",title:"Spersonalizowany harmonogram zadań dopasowany do Twojego obciążenia."},
              {icon:"😊",title:"Codzienne monitorowanie nastroju i cotygodniowe raporty."},
              {icon:"🔔",title:"Wczesne ostrzeganie i bezpieczne rekomendacje"},
            ].map((f,i)=>(
              <div key={i} className="p-7 rounded-3xl bg-[#F5EFE6] hover:shadow-xl hover:shadow-green-100 transition-all duration-300 hover:-translate-y-1 cursor-default">
                <div className="text-4xl mb-4">{f.icon}</div>
                <p className="text-[#1A2F22] font-medium leading-relaxed">{f.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  AUTH VIEW & ONBOARDING
// ═══════════════════════════════════════════════════
function AuthView({mode, onAuth, onSwitch, onBack}) {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [pw,setPw]=useState("");
  const [pw2,setPw2]=useState("");
  const [show,setShow]=useState(false);
  const [agreed,setAgreed]=useState(false);
  const [err,setErr]=useState("");
  const S={fontFamily:"'DM Sans',sans-serif"};
  const H={fontFamily:"'Lora',serif"};
  const submit=()=>{
    setErr("");
    if(mode==="register"){
      if(!name||!email||!pw){setErr("Uzupełnij wszystkie pola.");return;}
      if(pw!==pw2){setErr("Hasła nie są identyczne.");return;}
      if(pw.length<8){setErr("Hasło musi mieć min. 8 znaków.");return;}
      if(!agreed){setErr("Zaakceptuj regulamin.");return;}
    } else {
      if(!email||!pw){setErr("Uzupełnij e-mail i hasło.");return;}
    }
    onAuth({name:name||email.split("@")[0],email});
  };
  return (
    <div style={S} className="min-h-screen bg-[#F5EFE6] flex flex-col">
      <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-[#E8DDD0] px-6 py-4 flex items-center justify-between">
        <button onClick={onBack}><span style={H} className="text-[#1E5C36] font-bold text-xl">Wellbeing app</span></button>
        <div className="flex gap-2">
          <button onClick={()=>onSwitch("login")} className={`px-5 py-2 text-sm font-semibold rounded-full border-2 transition-all ${mode==="login"?"bg-[#1E5C36] text-white border-[#1E5C36]":"text-[#1E5C36] border-[#1E5C36] hover:bg-[#f0f9f4]"}`}>Zaloguj się</button>
          <button onClick={()=>onSwitch("register")} className={`px-5 py-2 text-sm font-semibold rounded-full border-2 transition-all ${mode==="register"?"bg-[#1E5C36] text-white border-[#1E5C36]":"text-[#1E5C36] border-[#1E5C36] hover:bg-[#f0f9f4]"}`}>Zarejestruj się</button>
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl shadow-green-900/10 p-8 w-full max-w-sm border border-[#E8DDD0]">
          <h2 style={H} className="text-2xl font-bold text-[#1A2F22] text-center mb-1">
            {mode==="register"?"Utwórz konto":"Zaloguj się"}
          </h2>
          <p className="text-center text-[#5A7368] text-sm mb-6">
            {mode==="register"?"Cześć, cieszymy się, że będziemy mogli Ci pomóc!":"Cześć, dobrze Cię widzieć!"}
          </p>
          {err && <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600">{err}</div>}
          <div className="space-y-3">
            {mode==="register"&&<input value={name} onChange={e=>setName(e.target.value)} placeholder="Podaj swoje imię" className="w-full px-4 py-3 rounded-2xl border border-[#E8DDD0] text-sm focus:outline-none focus:border-[#2D9E6B] transition-all"/>}
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Wprowadź swój e-mail" type="email" className="w-full px-4 py-3 rounded-2xl border border-[#E8DDD0] text-sm focus:outline-none focus:border-[#2D9E6B] transition-all"/>
            <div className="relative">
              <input value={pw} onChange={e=>setPw(e.target.value)} placeholder="Wprowadź hasło" type={show?"text":"password"} className="w-full px-4 py-3 pr-10 rounded-2xl border border-[#E8DDD0] text-sm focus:outline-none focus:border-[#2D9E6B] transition-all"/>
              <button onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9FB5AD] hover:text-[#5A7368]">{show?<EyeOff size={16}/>:<Eye size={16}/>}</button>
            </div>
            {mode==="register"&&<>
              <p className="text-[10px] text-[#9FB5AD] -mt-1 ml-1">*minimum 8 znaków</p>
              <input value={pw2} onChange={e=>setPw2(e.target.value)} placeholder="Powtórz hasło" type="password" className="w-full px-4 py-3 rounded-2xl border border-[#E8DDD0] text-sm focus:outline-none focus:border-[#2D9E6B] transition-all"/>
              <label className="flex items-start gap-2 text-xs text-[#5A7368] cursor-pointer leading-relaxed">
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)} className="mt-0.5 rounded accent-[#1E5C36]"/>
                Wyrażam zgodę na warunki Regulaminu.
              </label>
            </>}
            <button onClick={submit} className="w-full py-3.5 bg-[#1E5C36] text-white rounded-2xl font-semibold text-sm hover:bg-[#164a2c] transition-all shadow-lg mt-1">
              {mode==="register"?"Kontynuuj":"Zaloguj się"}
            </button>
            <p className="text-center text-sm text-[#5A7368] mt-4">
              <button onClick={()=>onSwitch(mode==="register"?"login":"register")} className="text-[#2D9E6B] font-semibold hover:underline">
                {mode==="register"?"Zaloguj się":"Zarejestruj się"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Onboarding({onComplete}) {
  const [step,setStep]=useState(0);
  const [hours,setHours]=useState(8);
  const [focus,setFocus]=useState("Rano");
  const [picks,setPicks]=useState([]);
  const S={fontFamily:"'DM Sans',sans-serif"};
  const H={fontFamily:"'Lora',serif"};
  const OPTS=["Wyjście na słońce","Kilka minut przerwy","Dobra kawa","Krótki spacer","Rozmowa z bliskim","Mała przekąska","Przerwa od pracy","Muzyka","Zmiana otoczenia"];
  const toggle=b=>setPicks(p=>p.includes(b)?p.filter(x=>x!==b):[...p,b]);
  return (
    <div style={S} className="min-h-screen bg-[#F5EFE6] flex flex-col">
      <nav className="bg-white/85 backdrop-blur-xl border-b border-[#E8DDD0] px-6 py-4"><span style={H} className="text-[#1E5C36] font-bold text-xl">Wellbeing app</span></nav>
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-[#E8DDD0]">
          <div className="flex justify-center gap-2 mb-7">
            {[0,1,2].map(i=>(
              <div key={i} className={`h-1.5 rounded-full transition-all duration-400 ${i<=step?"w-10 bg-[#1E5C36]":"w-5 bg-[#E8DDD0]"}`}/>
            ))}
          </div>
          {step===0&&<>
            <h2 style={H} className="text-2xl font-bold text-center text-[#1A2F22] mb-2">Pytanie 1 z 3</h2>
            <p className="text-center text-[#5A7368] mb-8 text-sm">Ile godzin dziennie spędzasz w pracy?</p>
            <div className="flex items-center justify-center gap-6">
              <button onClick={()=>setHours(h=>Math.max(1,h-1))} className="w-12 h-12 rounded-2xl border-2 border-[#E8DDD0] flex items-center justify-center text-xl font-bold text-[#5A7368] transition-all">−</button>
              <span className="text-6xl font-bold text-[#1A2F22] w-20 text-center">{hours}</span>
              <button onClick={()=>setHours(h=>Math.min(24,h+1))} className="w-12 h-12 rounded-2xl border-2 border-[#E8DDD0] flex items-center justify-center text-xl font-bold text-[#5A7368] transition-all">+</button>
            </div>
          </>}
          {step===1&&<>
            <h2 style={H} className="text-2xl font-bold text-center text-[#1A2F22] mb-2">Pytanie 2 z 3</h2>
            <p className="text-center text-[#5A7368] mb-6 text-sm">W jakich godzinach zazwyczaj czujesz największy przypływ koncentracji?</p>
            <select value={focus} onChange={e=>setFocus(e.target.value)} className="w-full px-4 py-3 rounded-2xl border-2 border-[#E8DDD0] text-sm focus:outline-none focus:border-[#2D9E6B] bg-white appearance-none">
              {["Rano (7:00–12:00)","Środek dnia (11:00–16:00)","Wieczór/Noc (po 17:00)","To zależy / Różnie"].map(o=><option key={o}>{o}</option>)}
            </select>
          </>}
          {step===2&&<>
            <h2 style={H} className="text-2xl font-bold text-center text-[#1A2F22] mb-1">Pytanie 3 z 3</h2>
            <p className="text-center text-[#5A7368] text-sm mb-1">Co najszybciej poprawia Ci nastrój kiedy masz kryzys w ciągu dnia?</p>
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1 mt-4">
              {OPTS.map(b=>(
                <label key={b} className={`flex items-start gap-2 p-3 rounded-2xl cursor-pointer transition-all text-xs leading-relaxed ${picks.includes(b)?"bg-[#E8F4ED] border-2 border-[#2D9E6B] text-[#1E5C36]":"bg-[#F5EFE6] border-2 border-transparent text-[#1A2F22] hover:border-[#E8DDD0]"}`}>
                  <input type="checkbox" checked={picks.includes(b)} onChange={()=>toggle(b)} className="mt-0.5 rounded accent-[#1E5C36] flex-shrink-0"/>
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </>}
          <button onClick={()=>{if(step<2)setStep(s=>s+1);else onComplete();}} className="w-full py-3.5 mt-6 bg-[#1E5C36] text-white rounded-2xl font-semibold hover:bg-[#164a2c] transition-all shadow-lg">
            Kontynuuj
          </button>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════
//  APP: SIDEBAR / LAYOUT
// ═══════════════════════════════════════════════════
function Sidebar({active,onNav,user,onLogout,collapsed,setCollapsed}) {
  const [menu,setMenu]=useState(false);
  const NAV=[
    {id:"dashboard",icon:<Home size={18}/>,label:"Strona główna"},
    {id:"calendar", icon:<Calendar size={18}/>,label:"Kalendarz"},
    {id:"mood",     icon:<Smile size={18}/>,label:"Monitor nastroju"},
    {id:"warning",  icon:<AlertTriangle size={18}/>,label:"System ostrzegania"},
  ];
  const H={fontFamily:"'Lora',serif"};
  return (
    <aside className={`${collapsed?"w-16":"w-56"} flex-shrink-0 bg-white border-r border-[#E8DDD0] flex flex-col transition-all duration-300 h-full sticky top-0`}>
      <div className={`px-4 py-4 border-b border-[#E8DDD0] flex items-center ${collapsed?"justify-center":"justify-between"}`}>
        {!collapsed&&<span style={H} className="text-[#1E5C36] font-bold text-base">Wellbeing app</span>}
        <button onClick={()=>setCollapsed(!collapsed)} className="w-8 h-8 rounded-xl hover:bg-[#F5EFE6] flex items-center justify-center text-[#5A7368] transition-all">
          <Menu size={16}/>
        </button>
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(n=>(
          <button key={n.id} onClick={()=>onNav(n.id)} title={n.label} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-all duration-150 ${active===n.id?"bg-[#1E5C36] text-white shadow-md shadow-green-900/20":"text-[#5A7368] hover:bg-[#F5EFE6] hover:text-[#1E5C36]"}`}>
            <span className="flex-shrink-0">{n.icon}</span>
            {!collapsed&&<span className="truncate">{n.label}</span>}
          </button>
        ))}
      </nav>
      <div className="px-2 pb-3 border-t border-[#E8DDD0] pt-2 relative">
        <button onClick={()=>setMenu(p=>!p)} className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl hover:bg-[#F5EFE6] transition-all ${collapsed?"justify-center":""}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D9E6B] to-[#1E5C36] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()||"U"}
          </div>
          {!collapsed&&<>
            <span className="text-xs font-semibold text-[#1A2F22] truncate flex-1 text-left">{user?.name||"Użytkownik"}</span>
            <ChevronDown size={12} className="text-[#9FB5AD] flex-shrink-0"/>
          </>}
        </button>
        {menu&&(
          <div className="absolute bottom-full left-2 right-2 mb-1 bg-white rounded-2xl shadow-2xl border border-[#E8DDD0] py-1 z-50">
            <div className="border-t border-[#E8DDD0] mt-1 pt-1">
              <button onClick={onLogout} className="w-full px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 text-left flex items-center gap-2">
                <LogOut size={12}/>Wyloguj się
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

// ═══════════════════════════════════════════════════
//  FOCUS MODE & TASK CARD
// ═══════════════════════════════════════════════════
function FocusModeView({ task, onClose, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const H = {fontFamily:"'Lora',serif"};

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(25 * 60); };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1A2F22] text-white p-6 animate-fade-in-up">
      <button onClick={onClose} className="absolute top-8 left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all flex items-center gap-2">
        <X size={18} /> Zakończ skupienie
      </button>
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2D9E6B]/20 text-[#2D9E6B] font-bold text-xs uppercase tracking-widest mb-8 border border-[#2D9E6B]/30">
          <Target size={14} /> Tryb Głębokiej Pracy
        </div>
        <h1 style={H} className="text-3xl font-bold mb-4">{task.title}</h1>
        {task.desc && <p className="text-[#9FB5AD] text-sm mb-12 max-w-sm mx-auto">{task.desc}</p>}
        <div className="relative flex items-center justify-center mb-12">
          <div className={`absolute w-64 h-64 rounded-full border-[6px] transition-all duration-1000 ${isActive ? 'border-[#2D9E6B] scale-105 opacity-100 animate-pulse' : 'border-white/10 scale-100 opacity-50'}`} />
          <div className="text-7xl font-mono font-light tracking-tighter">{mins}:{secs}</div>
        </div>
        <div className="flex items-center justify-center gap-6">
          <button onClick={resetTimer} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-[#9FB5AD] hover:text-white transition-all"><RotateCcw size={24} /></button>
          <button onClick={toggleTimer} className={`p-6 rounded-full flex items-center justify-center transition-all transform hover:scale-105 shadow-xl ${isActive ? 'bg-amber-500 hover:bg-amber-400 text-white' : 'bg-[#2D9E6B] hover:bg-emerald-400 text-white'}`}>
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          <button onClick={() => { onComplete(task.id); onClose(); }} className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-[#9FB5AD] hover:text-[#2D9E6B] transition-all"><Check size={24} /></button>
        </div>
      </div>
    </div>
  );
}

function TaskCard({task,onToggle, onFocus}) {
  const pr=PRIOS.find(x=>x.id===task.p)||PRIOS[0];
  const cat=CATS.find(x=>x.id===task.cat)||CATS[0];
  return (
    <div className={`bg-white rounded-2xl border border-[#E8DDD0] p-4 transition-all duration-200 hover:shadow-md hover:border-[#D4C9BC] group ${task.done?"opacity-55":""}`}>
      <div className="flex items-start gap-3">
        <button onClick={()=>onToggle(task.id)} className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-150 ${task.done?"bg-[#1E5C36] border-[#1E5C36]":"border-[#C4BBAF] hover:border-[#1E5C36] group-hover:border-[#2D9E6B]"}`}>
          {task.done&&<Check size={11} className="text-white"/>}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-sm font-semibold text-[#1A2F22] leading-snug ${task.done?"line-through opacity-60":""}`}>{task.title}</p>
          </div>
          {task.t&&<p className="text-[10px] text-[#9FB5AD] mt-0.5 font-medium">{task.t}</p>}
          {task.desc&&<p className="text-xs text-[#5A7368] mt-1 leading-relaxed">{task.desc}</p>}
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${cat.tw} border`}>{cat.emoji} {cat.label}</span>
            <span className="text-[9px] text-[#9FB5AD]">Waga: <strong className="text-[#5A7368]">{task.w}/10</strong></span>
            <PBadge p={task.p}/>
          </div>
        </div>
        {!task.done && (
          <button onClick={() => onFocus(task)} title="Rozpocznij Głębokie Skupienie" className="w-8 h-8 rounded-full bg-[#E8F4ED] text-[#1E5C36] hover:bg-[#1E5C36] hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-sm">
            <Play size={14} className="ml-0.5"/>
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  MODALS & JOURNAL
// ═══════════════════════════════════════════════════
function TaskModal({onClose,onAdd}) {
  const [title,setTitle]=useState("");
  const [d1,setD1]=useState("05-02-2026");
  const [d2,setD2]=useState("07-02-2026");
  const [p,setP]=useState("niski");
  const [desc,setDesc]=useState("");
  const submit=()=>{if(!title)return; onAdd({title, p, cat:"praca", w:9, hour:9, t:`${d1} - ${d2}`, desc}); onClose();};
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1A2F22]/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-[#1A2F22]">Dodaj zadanie</h3>
          <button onClick={onClose}><X size={20} className="text-[#1A2F22]"/></button>
        </div>
        <div className="space-y-5">
          <div><label className="text-xs font-bold text-[#5A7368] mb-2 block">Opis zadania</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Wpisz nazwę zadania" className="w-full px-4 py-3 rounded-xl border border-[#E8DDD0] outline-none focus:border-[#2D9E6B] transition-all"/></div>
          <div className="grid grid-cols-2 gap-4">
             <div><label className="text-xs font-bold text-[#5A7368] mb-2 block">Start</label><input value={d1} onChange={e=>setD1(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#E8DDD0] text-sm text-center"/></div>
             <div><label className="text-xs font-bold text-[#5A7368] mb-2 block">Koniec</label><input value={d2} onChange={e=>setD2(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#E8DDD0] text-sm text-center"/></div>
          </div>
          <div><label className="text-xs font-bold text-[#5A7368] mb-2 block">Priorytet</label>
            <div className="flex flex-wrap gap-3">
              {PRIOS.map(pr => (
                <button key={pr.id} onClick={()=>setP(pr.id)} className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase transition-all border-2 ${p===pr.id ? "border-[#1E5C36] bg-[#E8F4ED]" : "border-transparent bg-slate-50"}`}>{pr.label}</button>
              ))}
            </div>
          </div>
          <div><label className="text-xs font-bold text-[#5A7368] mb-2 block">Komentarz</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-[#E8DDD0] outline-none focus:border-[#2D9E6B] resize-none h-20"/></div>
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-[#5A7368] hover:bg-slate-50 rounded-xl transition-all">Anuluj</button>
          <button onClick={submit} className="flex-1 py-3 bg-[#1E5C36] text-white rounded-xl font-bold shadow-lg hover:bg-[#164a2c] transition-all">Dodaj</button>
        </div>
      </div>
    </div>
  );
}

function MoodModal({onClose,onAdd}) {
  const [sel,setSel]=useState(2);
  const today=new Date().toISOString().split("T")[0];
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-t-3xl shadow-2xl p-6 w-full max-w-sm pb-10" onClick={e=>e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[#1A2F22] flex items-center gap-2 text-base"><Smile size={17} className="text-[#2D9E6B]"/>Zarejestruj nastrój</h3>
          <button onClick={onClose}><X size={17} className="text-[#9FB5AD]"/></button>
        </div>
        <div className="flex justify-between mb-4 px-2">
          {EMOJIS.map((e,i)=>(
            <button key={i} onClick={()=>setSel(i)} className={`w-11 h-11 text-2xl rounded-2xl transition-all duration-150 ${sel===i?"ring-2 ring-[#1E5C36] bg-[#E8F4ED] scale-110 shadow-md":"hover:bg-[#F5EFE6] hover:scale-105"}`}>{e}</button>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-[#1E5C36] mb-5">{MOOD_L[sel]}</p>
        <button onClick={()=>{onAdd({id:Date.now(),d:today,v:sel});onClose();}} className="w-full py-3.5 bg-[#1E5C36] text-white rounded-2xl font-bold hover:bg-[#164a2c] transition-all shadow-lg">Zapisz</button>
      </div>
    </div>
  );
}

function Journal({onAlert}) {
  const [text,setText]=useState("");
  const [det,setDet]=useState(false);
  const handle=v=>{
    setText(v);
    const hit=BURNOUT_KW.some(kw=>v.toLowerCase().includes(kw));
    if(hit&&!det){setDet(true);onAlert();}
    if(!hit)setDet(false);
  };
  return (
    <div className={`rounded-2xl border-2 transition-all duration-300 p-4 ${det?"border-red-300 bg-red-50 shadow-md shadow-red-100":"border-[#E8DDD0] bg-white"}`}>
      <div className="flex items-center gap-2 mb-3">
        <BookOpen size={15} className={det?"text-red-500":"text-[#2D9E6B]"}/>
        <span className="text-sm font-bold text-[#1A2F22]">Dziennik dnia</span>
      </div>
      <textarea value={text} onChange={e=>handle(e.target.value)} placeholder="Opisz swoje przemyślenia..." rows={3} className="w-full text-sm bg-transparent resize-none focus:outline-none placeholder:text-[#C4BBAF] text-[#1A2F22] leading-relaxed"/>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  STREAK PLANT (OBLICZENIA NA ŻYWO - NAPRAWIONE)
// ═══════════════════════════════════════════════════
function StreakPlant({ tasks }) {
  const total = tasks.length;
  const done = tasks.filter(t => t.done).length;
  const progress = total === 0 ? 0 : Math.round((done / total) * 100);
  
  const H = {fontFamily:"'Lora',serif"};
  const plantHeight = Math.max(15, progress);

  return (
    <div className="bg-white rounded-3xl border border-[#E8DDD0] p-6 sticky top-24 shadow-sm">
      <h3 style={H} className="text-xl font-bold text-[#1A2F22] mb-2">Twoja roślinka streaku</h3>
      <p className="text-xs text-[#5A7368] mb-6 leading-relaxed">
        Twoja roślinka rośnie razem z Twoją konsekwencją. Każde ukończone zadanie zasila roślinę.
      </p>

      <div className="relative h-64 bg-[#F5EFE6]/50 rounded-[2rem] flex items-end justify-center pb-6 mb-6 overflow-hidden border border-[#E8DDD0]">
        <div className="absolute bottom-0 w-28 h-14 bg-[#5A7368] rounded-b-2xl rounded-t-sm z-20 flex flex-col items-center">
           <div className="w-32 h-4 bg-[#3E5249] rounded-sm -mt-1 shadow-md" />
        </div>
        <div 
          className="w-14 bg-[#2D9E6B] rounded-t-[2rem] transition-all duration-1000 ease-out relative z-10 flex flex-col items-center shadow-inner"
          style={{ height: `${plantHeight}%`, maxHeight: '80%', bottom: '30px' }}
        >
            <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,#1A2F22_4px,#1A2F22_6px)] rounded-t-[2rem]" />
        </div>
        <div className={`absolute top-8 text-4xl transition-all duration-700 z-30 ${progress === 100 ? 'opacity-100 scale-100 animate-bounce' : 'opacity-0 scale-50'}`}>
          🌸
        </div>
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <span className="text-xs font-semibold text-[#5A7368]">Postęp dnia</span>
          <span translate="no" className="text-xs font-bold text-[#1E5C36]">{progress}% ({done}/{total})</span>
        </div>
        <div className="h-2.5 bg-[#F5EFE6] rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#2D9E6B] to-[#1E5C36] rounded-full transition-all duration-1000 ease-out" style={{width:`${progress}%`}}/>
        </div>
        {progress === 100 && (
          <div className="bg-[#E8F4ED] rounded-2xl px-3 py-2 mt-4 flex items-start gap-2 animate-fade-in-up">
            <CheckCircle size={14} className="text-[#2D9E6B] flex-shrink-0 mt-0.5"/>
            <p className="text-xs text-[#1E5C36] font-medium leading-relaxed">
              Świetna robota! Roślinka zakwitła. Odpocznij!
            </p>
          </div>
        )}
      </div>
      
      <button className="mt-4 w-full py-2 text-xs font-bold text-[#5A7368] border-2 border-[#E8DDD0] rounded-xl flex items-center justify-center gap-2 hover:bg-[#F5EFE6] transition-all">
        <RefreshCw size={12}/> Zmień roślinkę
      </button>
    </div>
  );
}


// ═══════════════════════════════════════════════════
//  DASHBOARD VIEW
// ═══════════════════════════════════════════════════
function DashboardView({tasks,moods,onToggle,onAdd,onAlert,onFocusTask,loading}) {
  const [modal,setModal]=useState(false);
  const [filter,setFilter]=useState("all");
  const [search,setSearch]=useState("");
  const H={fontFamily:"'Lora',serif"};
  
  if(loading) return <SkeletonScreen/>;
  
  const filtered=tasks
    .filter(t=>filter==="all"||t.cat===filter||t.p===filter)
    .filter(t=>!search||t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 pb-10 max-w-5xl mx-auto">
      <div className="pt-4 mb-8">
        <p className="text-xs text-[#9FB5AD] font-bold uppercase tracking-widest mb-1">
          {new Date().toLocaleDateString("pl-PL",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}
        </p>
        <h1 style={H} className="text-3xl font-bold text-[#1A2F22]">Cześć Natalia!</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-white rounded-2xl border border-[#E8DDD0] px-4 py-3 shadow-sm focus-within:border-[#2D9E6B] transition-colors">
              <Search size={16} className="text-[#9FB5AD]"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Szukaj zadań..." className="flex-1 text-sm focus:outline-none text-[#1A2F22] bg-transparent"/>
            </div>
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-white border border-[#E8DDD0] rounded-2xl px-4 py-3 text-sm text-[#5A7368] focus:outline-none shadow-sm cursor-pointer hover:border-[#2D9E6B] transition-colors">
              <option value="all">Wszystkie</option>
              {CATS.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>

          <div className="flex items-center justify-between border-b border-[#E8DDD0] pb-3">
            <h2 style={H} className="text-xl font-bold text-[#1A2F22]">Dzisiejsze zadania</h2>
            <button onClick={()=>setModal(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E5C36] text-white rounded-xl text-sm font-bold hover:bg-[#164a2c] transition-all shadow-md hover:-translate-y-0.5">
              <Plus size={16}/>Dodaj zadanie
            </button>
          </div>
          
          <div className="space-y-5 pl-2 border-l-[3px] border-dashed border-[#E8DDD0] ml-4 pt-2">
            {filtered.map(t=>(
              <div key={t.id} className="relative pl-6">
                <div className="absolute -left-[23px] top-6 w-4 h-4 rounded-full bg-white border-[3px] border-[#2D9E6B] shadow-sm z-10" />
                <TaskCard task={t} onToggle={onToggle} onFocus={onFocusTask}/>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="pl-6 py-4">
                 <p className="text-[#9FB5AD] text-sm font-medium">Brak zadań. Twój plan jest czysty!</p>
              </div>
            )}
          </div>
          <div className="pt-6"><Journal onAlert={onAlert} /></div>
        </div>

        {/* PRZEKAZANIE CAŁEJ LISTY DO KAKTUSA ABY NADAWAŁA TEMPO NAPISOM */}
        <div className="lg:col-span-1">
          <StreakPlant tasks={tasks} />
        </div>
      </div>
      {modal && <TaskModal onClose={()=>setModal(false)} onAdd={onAdd}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  CALENDAR VIEW & WARNING VIEW
// ═══════════════════════════════════════════════════
function CalendarView({moods, loading}) {
  const H={fontFamily:"'Lora',serif"};
  if(loading) return <SkeletonScreen/>;
  return (
    <div className="p-6 pb-10">
      <div className="pt-8 mb-8">
        <h1 style={H} className="text-2xl font-bold text-[#1A2F22] mb-1">Kalendarz i analityka</h1>
      </div>
      <div className="bg-white rounded-3xl border border-[#E8DDD0] p-6 mb-6">
        <h3 className="text-sm font-bold text-[#1A2F22] mb-4">Historia nastroju</h3>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {moods.slice().reverse().map(m=>(
            <div key={m.id} className="min-w-[70px] flex flex-col items-center p-3 bg-[#F5EFE6] rounded-2xl border border-[#E8DDD0]">
              <span className="text-xs text-[#9FB5AD] font-semibold mb-2">{m.d.slice(5,10)}</span>
              <span className="text-2xl">{EMOJIS[m.v]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WarningView({loading}) {
  const H={fontFamily:"'Lora',serif"};
  if(loading) return <SkeletonScreen/>;
  return (
    <div className="p-6 pb-10">
      <div className="pt-8 mb-8">
        <h1 style={H} className="text-2xl font-bold text-[#1A2F22] mb-1">System Ostrzegania</h1>
        <p className="text-sm text-[#5A7368]">Bezpieczna przystań, gdy potrzebujesz pomocy.</p>
      </div>
      <div className="bg-red-50 p-6 rounded-3xl border border-red-200 mb-8">
        <div className="flex items-center gap-2 text-red-600 mb-3 font-bold uppercase text-xs tracking-wider">
          <AlertTriangle size={16} /> Sygnał ryzyka aktywny
        </div>
        <p className="text-sm font-medium text-red-900 leading-relaxed mb-4">
          Wsparcie jest bliżej, niż myślisz. Jeśli czujesz, że potrzebujesz wsparcia, skontaktuj się z osobami, które są gotowe Ci pomóc.
        </p>
      </div>
      <div className="space-y-4">
        {CONTACTS.map((c,i)=>(
          <div key={i} className="bg-white border border-[#E8DDD0] p-5 rounded-3xl shadow-sm relative overflow-hidden group hover:border-red-200 transition-colors">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-400" />
            <div className="pl-2">
              <h4 className="font-bold text-[#1A2F22] text-sm mb-3">{c.name}</h4>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-red-500"/>
                <span className="text-xl font-black text-[#1A2F22] tracking-tight">{c.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
//  MAIN APP ROUTER & LOGIC
// ═══════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = usePersist("wba_user", null);
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [focusedTask, setFocusedTask] = useState(null);
  
  const [tasks, setTasks] = usePersist("wba_tasks", INIT_TASKS);
  const [moods, setMoods] = usePersist("wba_moods", INIT_MOODS);
  const {ts, add, rm} = useToasts();

  useEffect(() => {
    if(view === "landing" && user) setView("app");
  }, [user, view]);

  const handleNav = (tab) => {
    if(tab === "mood") {
      setShowMoodModal(true);
      return;
    }
    setIsLoading(true);
    setActiveTab(tab);
    setTimeout(() => setIsLoading(false), 800);
  };

  useEffect(() => {
    if (moods.length > 0) {
      const lastMood = moods[moods.length - 1].v;
      if (lastMood <= 1) { 
        setTasks(prev => {
          const sorted = [...prev].sort((a, b) => {
            if (a.done !== b.done) return a.done ? 1 : -1;
            if (a.w >= 9 && b.w < 9) return 1;
            if (a.w < 9 && b.w >= 9) return -1;
            return 0;
          });
          const changed = JSON.stringify(prev) !== JSON.stringify(sorted);
          if(changed) {
             setTimeout(() => add("Korekta historyczna aktywna. Najtrudniejsze zadania zrzucone na dół.", "info"), 500);
          }
          return changed ? sorted : prev;
        });
      }
    }
  }, [moods, setTasks, add]);

  const toggleTask = (id) => {
    setTasks(prevTasks => prevTasks.map(t => t.id === id ? {...t, done: !t.done} : t));
  };
  
  const addTask = (t) => {
    setTasks(p => [{...t, id: Date.now(), done: false}, ...p]);
    add("Zadanie dodane pomyślnie!");
  };

  const addMood = (m) => {
    setMoods(p => [...p, m]);
    add("Twój nastrój został zapisany.");
  };

  if (view === "landing") return <><Font /><Landing onCTA={(mode) => {setAuthMode(mode); setView("auth");}}/></>;
  if (view === "auth") return <><Font /><AuthView mode={authMode} onSwitch={setAuthMode} onBack={() => setView("landing")} onAuth={(u) => {setUser(u); setView("onboarding");}} /></>;
  if (view === "onboarding") return <><Font /><Onboarding onComplete={() => setView("app")} /></>;

  return (
    <div className="flex h-screen bg-[#F5EFE6] font-sans selection:bg-[#2D9E6B] selection:text-white overflow-hidden">
      <Font />
      <Toasts ts={ts} rm={rm} />
      
      {focusedTask ? (
        <FocusModeView 
          task={focusedTask} 
          onClose={() => setFocusedTask(null)} 
          onComplete={(id) => { toggleTask(id); setFocusedTask(null); add("Świetna robota! Zadanie ukończone."); }}
        />
      ) : (
        <>
          <Sidebar 
            active={activeTab} 
            onNav={handleNav}
            user={user}
            onLogout={() => {setUser(null); setView("landing");}}
            collapsed={isSidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />
          <main className="flex-1 overflow-y-auto relative bg-[#FAFAFA]">
            <div className="max-w-4xl mx-auto">
              {activeTab === "dashboard" && (
                <DashboardView 
                  tasks={tasks}
                  moods={moods}
                  onToggle={toggleTask}
                  onAdd={addTask}
                  onFocusTask={setFocusedTask}
                  onAlert={() => {
                    add("Wykryto sygnał ostrzegawczy. Przejdź do Systemu Ostrzegania.", "warn");
                    handleNav("warning");
                  }}
                  loading={isLoading}
                />
              )}
              {activeTab === "calendar" && <CalendarView moods={moods} loading={isLoading} />}
              {activeTab === "warning" && <WarningView loading={isLoading} />}
            </div>
          </main>
          {showMoodModal && <MoodModal onClose={() => setShowMoodModal(false)} onAdd={addMood} />}
        </>
      )}
    </div>
  );
}