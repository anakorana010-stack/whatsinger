import React, { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
export default function App() {
const [user, setUser] = useState(null)
const[currentPage,setCurrentPage] = useState('login')
const [activeTab, setActiveTab] = useState('chats')
const [email, setEmail] = useState('')
const [password, setPassword] = useState('')
const [messages, setMessages] = useState([])
const [input, setInput] = useState('')
const [badgeStatus, setBadgeStatus] = useState('none')
const [daysLeft, setDaysLeft] = useState(0)
const [isRecording, setIsRecording] = useState(false)
const [soundsEnabled, setSoundsEnabled] = useState(true)
const [sounds, setSounds] = useState({
mic: 'https://cdn.freesound.org/previews/131/131142_2337290-lq.mp3',
vinyl: 'https://cdn.freesound.org/previews/344/344288_5121236-lq.mp3',
goldDrop: 'https://cdn.freesound.org/previews/476/476178_9492730-lq.mp3',
recording: '', typing: '', send: '', open: '', fail: '', success: '',
call_icon: '', video_icon: '', ringtone: '', notif_in: '', notif_out: ''
});
const [isAdmin, setIsAdmin] = useState(false)
const [appCode, setAppCode] = useState('<h1>مرحبا</h1>')
const updateAppCode = (code) => setAppCode(code)
}
const c = { bg: '#000', card: '#1a1a1a', main: '#FFD700', text: '#FFD700' }
const [showMetal, setShowMetal] = useState(false)
const [metalMsg, setMetalMsg] = useState('')
const [metalReply, setMetalReply] = useState('')
const messagesEndRef = useRef(null)
let mediaRecorder = null
let audioChunks = []
const ADMIN_ID = 'ضع_هنا_user_id_بتاعك'
useEffect(() => {
supabase.auth.getUser().then(({ data }) => {
setUser(data.user)
if(data.user) {
setCurrentPage('main')
loadUserData(data.user.id)
if(data.user.id === ADMIN_ID) setIsAdmin(true)
}
})
}, [])
const loadUserData = async (id) => {
const { data } = await supabase.from('profiles').select('*').eq('id', id).single()
if(data){
setDaysLeft(data.days_left || 0)
setBadgeStatus(data.badge_status || 'none')
setSounds(data.sounds || sounds)
}
const playSound = (name) => {
if(!soundsEnabled ||!sounds[name]) return
new Audio(sounds[name]).play().catch(()=>{})
}
const askMetal = async () => {
if(!metalMsg.trim()) return
setMetalReply('ميتال بيكتب...')
playSound('typing')
// هنا بتكلم API بتاعي
try {
const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/metal`, {
method: 'POST',
headers: {'Content-Type': 'application/json'},
body: JSON.stringify({msg: metalMsg})
});
setMetalReply(data.reply)
playSound('send')
} catch(err) {
setMetalReply('حصل خطأ، جرب تاني')
playSound('fail')
}
// صفحة تسجيل الدخول
if(page==='login' ||!user) return (
<div style={{...s.page,background:c.bg}}>
<div style={s.logo}>👑 <span style={{color:c.main}}>Whatsinger</span></div>
<h3 style={{color:c.main, textAlign:'center'}}>انا المالك الرسمي لتطبيق Whatsinger</h3>
<p style={{color:c.main, textAlign:'center'}}>
What Singer= ماذا يغنى + ماذا ارسل<br/>
سجل حلمك او بعتلى ايه بالمصرى
</p>
<input style={s.input} placeholder="الايميل" value={email} onChange={e=>setEmail(e.target.value)} />
<input style={s.input} placeholder="الباسوورد" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
<button style={s.btn} onClick={()=>supabase.auth.signInWithPassword({email,password})}>دخول</button>
<button style={s.btnOutline} onClick={()=>supabase.auth.signUp({email,password})}>حساب جديد - 7 ايام مجانا</button>
<button style={s.metalBtn} onClick={()=>setShowMetal(true)}>
🤖 ميتال المبرمج الذكي
</button>
<p style={{color:c.main, textAlign:'center', fontSize:12}}>
صنع بواسطة راجاف الحسينى
</p>
</div>
)
// مودال ميتال المبرمج الذكي
if(showMetal) return (
<div style={s.modal}>
<div style={{...s.modalContent, background:c.bg, borderColor:c.dark}}>
<h3 style={{color:c.main}}>🤖 ميتال المبرمج الذكى</h3>
<p style={{color:'#fff', fontSize:12}}>صنع بواسطة راجاف الحسينى</p>
<textarea
style={{...s.input, height:80}}
placeholder="اسألنى أى حاجة... كتابة، فويس، صورة"
value={metalMsg}
onChange={e=>setMetalMsg(e.target.value)}
/>
<button style={s.btn} onClick={askMetal}>اسأل ميتال</button>
<div style={{...s.card, marginTop:10, maxHeight:200, overflowY:'auto'}}>
<p style={{color:c.main}}>رد ميتال:</p>
<p style={{color:'#fff'}}>{metalReply}</p>
</div>
<div style={{display:'flex', gap:10, marginTop:10}}>
<button style={s.iconBtn} onClick={()=>alert('تسجيل فويس')}>🎤</button>
<button style={s.iconBtn} onClick={()=>alert('رفع صورة')}>🖼️</button>
<button style={s.btnOutline} onClick={()=>setShowMetal(false)}>اغلاق</button>
</div>
</div>
</div>
)
// الصفحة الرئيسية بعد الدخول
if(page==='main') return (
<div style={{...s.page, background:c.bg}}>
<div style={s.header}>
<h2>{activeTab==='chats'?'الدردشات':activeTab==='feed'?'الرئيسية':activeTab==='groups'?'المجموعات':'الحالات'}</h2>
<div onClick={()=>setCurrentPage('settings')}>⚙️</div>
</div>
<div style={s.content}>
{activeTab==='chats' && <p style={{color:'#fff', textAlign:'center'}}>مفيش محادثات لسه</p>}
{activeTab==='feed' && <p style={{color:'#fff', textAlign:'center'}}>مفيش منشورات لسه</p>}
{activeTab==='groups' && <p style={{color:'#fff', textAlign:'center'}}>مفيش مجموعات لسه</p>}
{activeTab==='story' && <p style={{color:'#fff', textAlign:'center'}}>مفيش حالات لسه</p>}
</div>
<div style={s.bottomNav}>
// صفحة الاعدادات
if(currentPage==='settings') return (
<div style={{...s.page, background:c.bg}}>
<div style={s.header}>
<button style={s.iconBtn} onClick={()=>setCurrentPage('main')}>←</button>
<h2 style={{color:c.main}}>الاعدادات</h2>
</div>
<div style={s.content}>
<button style={s.btn} onClick={()=>setCurrentPage('profile')}>الملف الشخصي</button>
<button style={s.btn} onClick={()=>setCurrentPage('privacy')}>الخصوصية والامان</button>
<button style={s.btn} onClick={()=>setCurrentPage('sounds')}>الاصوات</button>
<button style={s.btnOutline} onClick={()=>supabase.auth.signOut()}>تسجيل خروج</button>
</div>
</div>
)
// صفحة الخصوصية والامان - فيها كود البنات وضد الهكر
if(currentPage==='privacy') return (
<div style={{...s.page, background:c.bg}}>
<div style={s.header}>
<button style={s.iconBtn} onClick={()=>setCurrentPage('settings')}>←</button>
<h2 style={{color:c.main}}>الخصوصية والامان</h2>
</div>
<div style={s.content}>
<h3 style={{color:c.main}}>🔐 كود دخول البنات الخاص</h3>
<input style={s.input} placeholder="اكتب كود البنت" value={girlCode} onChange={e=>setGirlCode(e.target.value)} />
<button style={s.btn} onClick={()=>{if(girlCode==='159753') alert('دخول مسموح للبنات'); else alert('كود غلط')}}>دخول</button>
<h3 style={{color:c.main, marginTop:30}}>🛡️ الامان ضد الهكر</h3>
<input style={s.input} placeholder="كود الهكر السري" value={hackerCode} onChange={e=>setHackerCode(e.target.value)} />
<button style={s.btn} onClick={()=>{if(hackerCode==='HACKER999') alert('تم تفعيل الحماية'); else alert('كود غلط')}}>تفعيل الحماية</button>
<p style={{color:c.main, fontSize:12, marginTop:20}}>كود البنات: 159753 | كود الهكر: HACKER999</p>
</div>
</div>
<button style={activeTab==='feed'?s.navActive:s.navBtn} onClick={()=>setActiveTab('feed')}>
🏠<br/>الرئيسية
</button>
<button style={activeTab==='chats'?s.navActive:s.navBtn} onClick={()=>setActiveTab('chats')}>
💬<br/>الشات
</button>
<button style={activeTab==='groups'?s.navActive:s.navBtn} onClick={()=>setActiveTab('groups')}>
👥<br/>المجموعات
</button>
<button style={activeTab==='story'?s.navActive:s.navBtn} onClick={()=>setActiveTab('story')}>
📸<br/>الاستورى
</button>
</div>
</div>
)
// صفحة الشات داخل الصفحة الرئيسية
const renderChats = () => (
<>
<div style={s.messages}>
<div style={s.dateSep}>الجمعة 1 مايو 2026</div>
{messages.map(m=>(
<div key={m.id} style={s.msgWrap}>
<div style={s.msg}>
<div style={{display:'flex', justifyContent:'space-between', fontSize:12}}>
<span>👑 راجاف الحسينى </span>
<span>باقى {daysLeft} يوم</span>
</div>
{m.type==='text' && <div style={{marginTop:5}}>{m.text}</div>}
{m.type==='audio' && <audio controls src={m.text} style={{width:'100%', marginTop:5}} />}
<div style={{display:'flex', justifyContent:'space-between', marginTop:5, fontSize:12}}>
<div>✓ <span className="eyes">👁️👁️</span></div>
<div>{m.time}</div>
<button style={s.transBtn}>ترجمة</button>
</div>
</div>
</div>
))}
<div ref={messagesEndRef} />
</div>
<div style={s.inputBar}>
<div style={{display:'flex', gap:10}}>
<span onClick={()=>alert('رفع ملف')}>📎</span>
<span onClick={()=>alert('كاميرا')}>📷</span>
</div>
<input
style={s.inputChat}
placeholder="اكتب على السبيكة الموثقة..."
value={input}
onChange={e=>setInput(e.target.value)}
onKeyDown={e=>e.key==='Enter'&&sendMsg()}
/>
<button onClick={()=>alert('سجل الحلم')} style={s.iconBtn}>🎬</button>
<button onClick={sendMsg} style={s.sendBtn}>➤</button>
<span 
onMouseDown={startAudioRecord} 
onMouseUp={stopAudioRecord}
onTouchStart={startAudioRecord}
onTouchEnd={stopAudioRecord}
>
🎤
</span>
</div>
</>
)
const sendMsg = () => {
if(!input.trim()) return
playSound('typing')
const msg = {
id:Date.now(),
text:input,
type:'text',
time:new Date().toLocaleTimeString('ar-EG'),
status:'sent'
}
setMessages([...messages, msg])
setInput('')
playSound('send')
setTimeout(()=>messagesEndRef.current?.scrollIntoView({behavior:'smooth'}), 100)
}
const startAudioRecord = async () => {
setIsRecording(true)
playSound('mic')
playSound('recording')
try {
const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
mediaRecorder = new MediaRecorder(stream)
audioChunks = []
mediaRecorder.ondataavailable = e => audioChunks.push(e.data)
mediaRecorder.onstop = async () => {
const blob = new Blob(audioChunks, { type: 'audio/webm' })
const fileName = `${user.id}-${Date.now()}.webm`
playSound('goldDrop'); // بدل success
const { data } = supabase.storage.from('voice-messages').getPublicUrl(fileName)
setMessages(prev => [...prev, {
id:Date.now(), 
text:data.publicUrl, 
type:'audio', 
time:new Date().toLocaleTimeString('ar-EG')
}])
playSound('goldDrop'); // بدل success
}
mediaRecorder.start()
} catch(e) {
alert('مش قادر افتح المايك')
setIsRecording(false)
}
}
const stopAudioRecord = () => {
if(mediaRecorder && isRecording){
mediaRecorder.stop()
setIsRecording(false)
mediaRecorder.stream.getTracks().forEach(track => track.stop())
}
}
// تعديل return الرئيسي عشان يعرض الشات لما activeTab='chats'
if(page==='main' && activeTab==='chats') return (
<div style={{...s.page, background:c.bg}}>
<div style={s.header}>
<div style={{display:'flex', gap:10, alignItems:'center'}}>
<span className="icon-anim" onClick={()=>playSound('call_icon')}>📞</span>
<span className="icon-anim" onClick={()=>playSound('video_icon')}>🎬</span>
<div style={s.m}>M</div>
</div>
<div style={{textAlign:'center', flex:1}}>
<div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:5}}>
<span>✓</span><span style={{fontWeight:900}}>راجاف الحسينى </span>
{badgeStatus==='gold' && <span>👑</span>}
</div>
<div style={{fontSize:12}}>سبيكة موثقة متصلة - محفوظة</div>
<div style={{fontSize:11}}>اخر ظهور يوم الجمعة 1 مايو 2026</div>
</div>
<div onClick={()=>setPage('settings')}>⚙️</div>
</div>
{renderChats()}
{renderBottomNav()}
</div>
)
// صفحة الإعدادات
if(page==='settings') return (
<div style={{...s.page, background:c.bg}}>
<div style={s.header}>
<button onClick={()=>setPage('main')} style={s.backBtn}>رجوع</button>
<h2>الإعدادات</h2>
<button onClick={()=>setSoundsEnabled(!soundsEnabled)} style={s.soundToggle}>
{soundsEnabled? '🔊' : '🔇'}
</button>
</div>
<div style={{padding:15, paddingBottom:80}}>
<h3 style={{color:c.main}}>رفع الأصوات</h3>
{Object.keys(sounds).map(key=>(
<div key={key} style={s.soundRow}>
<span style={{color:c.main}}>{key}</span>
<input type="file" accept="audio/*" onChange={(e)=>uploadSound(e, key)} />
{sounds[key] && <span style={{color:'green'}}>✓</span>}
</div>
))}
<h3 style={{color:c.main, marginTop:30}}>الاشتراك في الشارة الذهبية</h3>
<p style={{color:'#fff'}}>شهري 10$ | اسبوعي 5$ | اول 7 ايام مجانا</p>
<button style={s.btn} onClick={()=>alert('اربط بوابة الدفع هنا')}>اشترك الآن</button>
{isAdmin && (
<button style={s.btn} onClick={()=>{setPage('adminVerify'); loadVerifications()}}>
طلبات التحقق من الجنس
<button style={s.btn} onClick={()=>setPage('appBuilder')}>
🛠️ منشئ التطبيقات والألعاب
</button>
</button>
)}
<button style={{...s.btnOutline, marginTop:20}} onClick={()=>supabase.auth.signOut()}>
تسجيل خروج
</button>
</div>
</div>
)
const uploadSound = async (e, soundName) => {
const file = e.target.files[0]
if(!file) return
const fileName = `${soundName}-${Date.now()}.mp3`
const { error } = await supabase.storage.from('sounds').upload(fileName, file)
if(error) { alert('فشل الرفع: '+error.message); return }
const { data: urlData } = supabase.storage.from('sounds').getPublicUrl(fileName)
const newSounds = {...sounds, [soundName]: urlData.publicUrl}
setSounds(newSounds)
await supabase.from('profiles').update({sounds: newSounds}).eq('id', user.id)
playSound(soundName)
}
// صفحة التحقق للأدمن
if(page==='adminVerify' && isAdmin) return (
<div style={{...s.page, background:c.bg}}>
<div style={s.header}>
<button onClick={()=>setPage('settings')} style={s.backBtn}>رجوع</button>
<h2>طلبات التحقق</h2>
</div>
<div style={{padding:15, paddingBottom:80}}>
{pendingVerifications.length===0 && <p style={{color:'#fff'}}>مفيش طلبات معلقة</p>}
{pendingVerifications.map(v=>(
<div key={v.id} style={s.card}>
<div style={{display:'flex', gap:10, alignItems:'center'}}>
<img src={v.profiles.avatar_url} style={{width:50,height:50,borderRadius:'50%'}} />
<div>
<p style={{color:c.main}}>{v.profiles.username}</p>
<p style={{color:'#fff', fontSize:12}}>
{new Date(v.created_at).toLocaleDateString('ar-EG')}
</p>
</div>
</div>
<div style={{display:'flex', gap:10, marginTop:10}}>
<button style={{...s.btn, background:'green', flex:1}}
onClick={()=>submitVerification(v.id,'male','تم المراجعة')}>ذكر</button>
<button style={{...s.btn, background:'pink', flex:1}}
onClick={()=>submitVerification(v.id,'female','تم المراجعة')}>أنثى</button>
</div>
<button style={{...s.btnOutline, marginTop:5, width:'100%'}}
onClick={()=>submitVerification(v.id,'unclear','غير واضح')}>غير واضح</button>
</div>
))}
</div>
</div>
)
const loadVerifications = async () => {
if(!isAdmin) return
const { data } = await supabase.from('verifications')
.select('*, profiles!target_user_id(username, avatar_url)')
.is('result', null)
.order('created_at', {ascending:false})
setPendingVerifications(data || [])
}
const submitVerification = async (id, result, note) => {
await supabase.from('verifications')
.update({result, note})
.eq('id', id)
await supabase.from('notifications').insert({
user_id: id,
message: `تم التحقق بواسطة إدارة Whatsinger: النتيجة ${result==='male'?'ذكر':'أنثى'}`
})
loadVerifications()
}
const renderBottomNav = () => (
<div style={s.bottomNav}>
<button style={activeTab==='feed'?s.navActive:s.navBtn} onClick={()=>setActiveTab('feed')}>
🏠<br/>الرئيسية
</button>
<button style={activeTab==='chats'?s.navActive:s.navBtn} onClick={()=>setActiveTab('chats')}>
💬<br/>الشات
</button>
<button style={activeTab==='groups'?s.navActive:s.navBtn} onClick={()=>setActiveTab('groups')}>
👥<br/>المجموعات
</button>
<button style={activeTab==='story'?s.navActive:s.navBtn} onClick={()=>setActiveTab('story')}>
📸<br/>الاستورى
</button>
</div>
)
const s = {
page:{minHeight:'100vh',display:'flex',flexDirection:'column',fontFamily:'Cairo',color:'#FFD700'},
logo:{fontSize:32,fontWeight:900,textAlign:'center',padding:20},
input:{width:'100%',padding:12,margin:'8px 0',background:'#000',border:'2px solid #FFD700',borderRadius:8,color:'#FFD700',outline:'none'},
btn:{width:'100%',padding:12,background:'#FFD700',border:'none',borderRadius:8,fontWeight:900,cursor:'pointer',margin:'5px 0'},
btnOutline:{width:'100%',padding:12,background:'transparent',border:'2px solid #FFD700',borderRadius:8,color:'#FFD700',cursor:'pointer'},
header:{display:'flex',alignItems:'center',padding:10,color:'#000',borderBottom:'3px solid'},
m:{width:35,height:35,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,color:'#fff'},
msg:{padding:12,borderRadius:14,maxWidth:'85%',border:'3px solid',fontWeight:700,color:'#000',boxShadow:'0 0 20px rgba(255,215,0,0.5)'},
inputBar:{position:'fixed',bottom:50,left:0,right:0,display:'flex',alignItems:'center',gap:10,padding:10,borderTop:'3px solid'},
inputChat:{flex:1,padding:10,background:'#2A2A2A',border:'2px solid',borderRadius:20,color:'#FFD700',outline:'none'},
iconBtn:{width:40,height:40,borderRadius:'50%',border:'none',cursor:'pointer'},
send:{width:40,height:40,borderRadius:'50%',border:'none',cursor:'pointer'},
control:{position:'fixed',bottom:95,left:0,right:0,display:'flex',gap:5,padding:10,borderTop:'2px solid'},
ctrlBtn:{flex:1,padding:8,border:'none',borderRadius:8,fontWeight:900,color:'#000'},
warn:{flex:1,padding:8,background:'#FFA500',border:'none',borderRadius:8,fontWeight:900},
footer:{position:'fixed',bottom:0,left:0,right:0,padding:10,textAlign:'center',fontWeight:900,color:'#000'},
modal:{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000},
modalContent:{padding:20,borderRadius:12,border:'3px solid',width:'90%',maxWidth:400},
transBtn:{background:'transparent',border:'none',color:'#000',textDecoration:'underline',cursor:'pointer'}
}
}
