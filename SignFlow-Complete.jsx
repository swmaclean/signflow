import { useState, useRef, useEffect, useReducer, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════════
const T = {
  ink:"#0D0D0D", paper:"#F5F0E8", cream:"#EDE8DC", white:"#FFFFFF",
  gold:"#B8860B", goldLt:"#D4A017", goldPale:"#F0E6C0",
  teal:"#1A3A4A", tealLt:"#2C5F7A",
  green:"#2D6A4F", greenBg:"#E8F5EE",
  red:"#8B2020", redBg:"#FDE8E8",
  muted:"#7A7060", border:"#C8C0AC",
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body{font-family:'DM Sans',sans-serif;background:${T.paper};color:${T.ink};min-height:100vh;-webkit-font-smoothing:antialiased}
button{cursor:pointer;font-family:inherit}
input,textarea,select{font-family:inherit}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:${T.cream}}
::-webkit-scrollbar-thumb{background:${T.border};border-radius:4px}

/* ── LAYOUT ── */
.sf-app{display:flex;flex-direction:column;min-height:100vh}
.sf-topbar{
  height:60px;background:${T.teal};
  display:flex;align-items:center;padding:0 1.5rem;gap:1rem;
  position:sticky;top:0;z-index:200;
  border-bottom:2px solid ${T.gold};
  box-shadow:0 2px 16px rgba(0,0,0,.2);
}
.sf-logo{
  font-family:'Cormorant Garamond',serif;font-size:1.45rem;font-weight:300;
  letter-spacing:.1em;color:${T.paper};display:flex;align-items:center;gap:.5rem;
  flex-shrink:0;
}
.sf-logo-ring{
  width:30px;height:30px;border:1.5px solid ${T.gold};border-radius:50%;
  display:flex;align-items:center;justify-content:center;color:${T.goldLt};font-size:.85rem;
}
.sf-logo span{color:${T.goldLt}}
.sf-nav{display:flex;height:60px;gap:0}
.sf-nav-btn{
  height:60px;padding:0 1rem;
  font-size:.72rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;
  background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-2px;
  color:rgba(245,240,232,.45);transition:all .2s;white-space:nowrap;
}
.sf-nav-btn:hover{color:${T.paper}}
.sf-nav-btn.active{color:${T.goldLt};border-bottom-color:${T.goldLt}}
.sf-spacer{flex:1}
.sf-avatar{
  width:34px;height:34px;border-radius:50%;
  background:${T.tealLt};color:${T.goldLt};
  display:flex;align-items:center;justify-content:center;
  font-size:.72rem;font-weight:600;letter-spacing:.03em;
  border:1.5px solid rgba(255,255,255,.15);transition:border-color .2s;position:relative;
}
.sf-avatar:hover{border-color:${T.gold}}
.sf-dropdown{
  position:absolute;top:calc(100% + 10px);right:0;
  background:${T.white};border:1px solid ${T.border};border-top:2px solid ${T.gold};
  min-width:210px;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:500;
  animation:dropIn .15s ease;
}
@keyframes dropIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.sf-dd-user{padding:.85rem 1rem;border-bottom:1px solid ${T.border}}
.sf-dd-name{font-weight:600;font-size:.88rem}
.sf-dd-email{font-size:.73rem;color:${T.muted};margin-top:.1rem}
.sf-dd-plan{display:inline-flex;align-items:center;padding:.15rem .55rem;border-radius:20px;font-size:.63rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;background:${T.goldPale};color:${T.gold};margin-top:.3rem}
.sf-dd-item{display:flex;align-items:center;gap:.55rem;padding:.65rem 1rem;font-size:.83rem;width:100%;text-align:left;border:none;background:none;color:${T.ink};transition:background .15s}
.sf-dd-item:hover{background:${T.paper}}
.sf-dd-item.danger{color:${T.red}}
.sf-dd-divider{height:1px;background:${T.border}}
.sf-main{flex:1;padding:2rem 1.75rem;max-width:1120px;margin:0 auto;width:100%}
@media(max-width:640px){.sf-main{padding:1.25rem 1rem}.sf-nav-btn{padding:0 .6rem;font-size:.65rem}}

/* ── AUTH ── */
.auth-root{min-height:100vh;display:grid;grid-template-columns:1fr 1fr}
@media(max-width:720px){.auth-root{grid-template-columns:1fr}}
.auth-left{
  background:${T.teal};padding:3rem;
  display:flex;flex-direction:column;justify-content:space-between;
  position:relative;overflow:hidden;
}
@media(max-width:720px){.auth-left{display:none}}
.auth-left-bg{
  position:absolute;inset:0;
  background:repeating-linear-gradient(45deg,transparent,transparent 48px,rgba(184,134,11,.03) 48px,rgba(184,134,11,.03) 49px),
             repeating-linear-gradient(-45deg,transparent,transparent 48px,rgba(184,134,11,.03) 48px,rgba(184,134,11,.03) 49px);
}
.auth-left-orb{position:absolute;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(44,95,122,.7) 0%,transparent 70%);top:-80px;right:-80px;pointer-events:none}
.auth-brand{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:300;letter-spacing:.1em;color:${T.paper};display:flex;align-items:center;gap:.55rem;position:relative;z-index:1}
.auth-brand span{color:${T.goldLt}}
.auth-brand-ring{width:38px;height:38px;border:1.5px solid ${T.gold};border-radius:50%;display:flex;align-items:center;justify-content:center;color:${T.goldLt};font-size:1rem}
.auth-headline{font-family:'Cormorant Garamond',serif;font-size:2.6rem;font-weight:300;line-height:1.2;color:${T.paper};margin-bottom:1.5rem;position:relative;z-index:1}
.auth-headline em{color:${T.goldLt};font-style:italic}
.auth-features{list-style:none;display:flex;flex-direction:column;gap:.7rem;position:relative;z-index:1}
.auth-feature{display:flex;align-items:center;gap:.7rem;font-size:.82rem;color:rgba(245,240,232,.65)}
.auth-feat-icon{width:26px;height:26px;border:1px solid rgba(184,134,11,.4);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:.65rem;color:${T.goldLt};flex-shrink:0}
.auth-foot{font-size:.7rem;color:rgba(245,240,232,.3);letter-spacing:.06em;text-transform:uppercase;position:relative;z-index:1}
.auth-right{display:flex;align-items:center;justify-content:center;padding:2.5rem;background:${T.paper}}
.auth-box{width:100%;max-width:400px}
.auth-tabs{display:flex;border-bottom:1px solid ${T.border};margin-bottom:1.75rem}
.auth-tab{flex:1;padding:.7rem;font-size:.75rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;background:none;border:none;border-bottom:2px solid transparent;margin-bottom:-1px;color:${T.muted};transition:all .2s}
.auth-tab.active{color:${T.gold};border-bottom-color:${T.gold}}
.auth-heading{font-family:'Cormorant Garamond',serif;font-size:1.9rem;font-weight:300;letter-spacing:.04em;margin-bottom:.2rem}
.auth-sub{font-size:.78rem;color:${T.muted};margin-bottom:1.75rem}
.pw-strength-bar{height:3px;border-radius:2px;margin-top:.3rem;margin-bottom:.6rem;background:${T.border};overflow:hidden}
.pw-strength-fill{height:100%;border-radius:2px;transition:width .3s,background .3s}

/* ── FORM ELEMENTS ── */
.sf-label{display:block;font-size:.7rem;font-weight:500;letter-spacing:.1em;text-transform:uppercase;color:${T.muted};margin-bottom:.3rem}
.sf-input{width:100%;padding:.62rem .82rem;border:1px solid ${T.border};background:${T.white};border-radius:4px;font-size:.9rem;color:${T.ink};outline:none;transition:border-color .2s;margin-bottom:.9rem}
.sf-input:focus{border-color:${T.teal}}
.sf-textarea{width:100%;padding:.62rem .82rem;border:1px solid ${T.border};background:${T.white};border-radius:4px;font-size:.88rem;color:${T.ink};outline:none;resize:vertical;min-height:88px;transition:border-color .2s;margin-bottom:.9rem}
.sf-textarea:focus{border-color:${T.teal}}
.sf-input-wrap{position:relative}
.sf-input-wrap .sf-input{margin-bottom:0}
.sf-input-suffix{position:absolute;right:.8rem;top:50%;transform:translateY(-50%);color:${T.muted};font-size:.82rem;cursor:pointer;user-select:none}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:.85rem}
@media(max-width:500px){.form-row{grid-template-columns:1fr}}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:.45rem;padding:.68rem 1.35rem;font-family:'DM Sans',sans-serif;font-size:.76rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;border:none;border-radius:3px;transition:all .2s;white-space:nowrap}
.btn-full{width:100%}
.btn-primary{background:${T.teal};color:${T.white}}
.btn-primary:hover{background:${T.tealLt}}
.btn-primary:disabled{background:${T.border};color:${T.muted};cursor:not-allowed}
.btn-gold{background:${T.gold};color:${T.white}}
.btn-gold:hover{background:${T.goldLt}}
.btn-gold:disabled{background:${T.border};color:${T.muted};cursor:not-allowed}
.btn-outline{background:transparent;border:1px solid ${T.border};color:${T.ink}}
.btn-outline:hover{border-color:${T.ink};background:${T.cream}}
.btn-ghost{background:transparent;border:none;color:${T.muted};font-size:.75rem;padding:.4rem .6rem}
.btn-ghost:hover{color:${T.ink}}
.btn-danger{background:transparent;border:1px solid ${T.red};color:${T.red}}
.btn-danger:hover{background:${T.redBg}}
.btn-green{background:${T.green};color:${T.white}}
.btn-green:hover{background:#246044}
.btn-sm{padding:.38rem .85rem;font-size:.68rem}

/* ── CARDS ── */
.sf-card{background:${T.white};border:1px solid ${T.border};border-radius:3px;padding:1.5rem;margin-bottom:1.1rem;box-shadow:0 1px 6px rgba(0,0,0,.04)}
.sf-card-title{font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:600;letter-spacing:.04em;color:${T.teal};margin-bottom:1.1rem;display:flex;align-items:center;gap:.55rem}
.sf-card-title::after{content:'';flex:1;height:1px;background:${T.border}}

/* ── PAGE HEADER ── */
.sf-page-title{font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:300;letter-spacing:.04em;margin-bottom:.2rem}
.sf-page-sub{font-size:.75rem;color:${T.muted};letter-spacing:.08em;text-transform:uppercase;margin-bottom:1.75rem}

/* ── BADGES ── */
.badge{display:inline-flex;align-items:center;gap:.25rem;padding:.18rem .6rem;border-radius:20px;font-size:.66rem;font-weight:600;letter-spacing:.05em;text-transform:uppercase}
.badge-pending{background:#FFF3CD;color:#856404}
.badge-sent{background:#D1ECF1;color:#0C5460}
.badge-signed{background:${T.greenBg};color:${T.green}}
.badge-waiting{background:${T.cream};color:${T.muted}}
.badge-complete{background:${T.greenBg};color:${T.green}}
.badge-in-progress{background:#FFF3CD;color:#856404}

/* ── DIVIDER ── */
.divider{height:1px;background:${T.border};margin:1.25rem 0}
.divider-or{display:flex;align-items:center;gap:.7rem;margin:1.1rem 0;color:${T.muted};font-size:.73rem;letter-spacing:.08em}
.divider-or::before,.divider-or::after{content:'';flex:1;height:1px;background:${T.border}}

/* ── STAT CARDS ── */
.stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.9rem;margin-bottom:1.75rem}
@media(max-width:760px){.stat-grid{grid-template-columns:repeat(2,1fr)}}
.stat-card{background:${T.white};border:1px solid ${T.border};border-radius:3px;padding:1.1rem 1.25rem;border-top:3px solid var(--accent-color)}
.stat-val{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;color:var(--accent-color);line-height:1}
.stat-label{font-size:.68rem;color:${T.muted};letter-spacing:.08em;text-transform:uppercase;margin-top:.35rem}

/* ── DOC LIST ── */
.doc-row{display:grid;grid-template-columns:44px 1fr auto auto;gap:1rem;align-items:center;padding:.9rem 1.1rem;border-bottom:1px solid ${T.border};transition:background .15s;cursor:pointer}
.doc-row:last-child{border-bottom:none}
.doc-row:hover{background:${T.paper}}
.doc-icon{width:40px;height:46px;background:${T.teal};border-radius:3px;display:flex;align-items:center;justify-content:center;color:${T.goldLt};font-size:1rem;flex-shrink:0;position:relative}
.doc-icon::after{content:'';position:absolute;top:0;right:0;width:0;height:0;border-left:8px solid ${T.tealLt};border-bottom:8px solid transparent}
.doc-name{font-weight:500;font-size:.9rem;margin-bottom:.15rem}
.doc-meta{font-size:.72rem;color:${T.muted}}

/* ── SIGNER ROW ── */
.signer-row{display:grid;grid-template-columns:34px 1fr 1fr 1fr 36px;gap:.7rem;align-items:center;padding:.65rem .75rem;background:${T.paper};border:1px solid ${T.border};border-radius:3px;margin-bottom:.55rem}
.signer-row .sf-input{margin-bottom:0;font-size:.82rem;padding:.48rem .65rem}
.signer-order-badge{width:34px;height:34px;border-radius:50%;background:${T.teal};color:${T.white};display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:600;flex-shrink:0}

/* ── PROGRESS STEPS ── */
.progress-track{display:flex;align-items:center;margin-bottom:2rem}
.progress-step{flex:1;display:flex;flex-direction:column;align-items:center;gap:.3rem;position:relative}
.progress-step::before{content:'';position:absolute;top:13px;left:-50%;right:50%;height:1px;background:${T.border};z-index:0}
.progress-step:first-child::before{display:none}
.progress-step.done::before{background:${T.gold}}
.step-circle{width:26px;height:26px;border-radius:50%;border:1.5px solid ${T.border};background:${T.white};display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:600;color:${T.muted};position:relative;z-index:1;transition:all .25s}
.progress-step.active .step-circle{border-color:${T.gold};background:${T.gold};color:${T.white}}
.progress-step.done .step-circle{border-color:${T.green};background:${T.green};color:${T.white}}
.step-lbl{font-size:.63rem;letter-spacing:.08em;text-transform:uppercase;color:${T.muted}}
.progress-step.active .step-lbl{color:${T.gold};font-weight:600}
.progress-step.done .step-lbl{color:${T.green}}

/* ── AUDIT TRAIL ── */
.audit-entry{display:flex;gap:.9rem;padding:.7rem 0;border-bottom:1px solid ${T.cream};position:relative}
.audit-entry:last-child{border-bottom:none}
.audit-entry::before{content:'';position:absolute;left:13px;top:30px;bottom:-1px;width:1px;background:${T.border};z-index:0}
.audit-entry:last-child::before{display:none}
.audit-dot{width:26px;height:26px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.68rem;position:relative;z-index:1}
.audit-action{font-size:.85rem;font-weight:500;margin-bottom:.1rem}
.audit-detail{font-size:.72rem;color:${T.muted}}
.audit-time{font-size:.68rem;color:${T.muted};font-family:monospace;margin-top:.1rem}

/* ── SIGNATURE CANVAS ── */
.sig-canvas-wrap{border:1.5px dashed ${T.border};border-radius:4px;background:${T.white};position:relative;overflow:hidden;margin-bottom:.7rem}
.sig-canvas-wrap canvas{display:block;width:100%;touch-action:none;cursor:crosshair}
.sig-placeholder{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;pointer-events:none}
.sig-placeholder-text{font-family:'Cormorant Garamond',serif;font-size:.95rem;font-style:italic;color:${T.border}}
.sig-baseline{position:absolute;bottom:34px;left:14px;right:14px;height:1px;background:${T.border};pointer-events:none}
.sig-controls{display:flex;align-items:center;gap:.6rem;flex-wrap:wrap;margin-bottom:.75rem}
.ink-dot{width:22px;height:22px;border-radius:50%;cursor:pointer;border:2px solid transparent;transition:all .15s;flex-shrink:0}
.ink-dot.active{border-color:${T.gold};transform:scale(1.2)}
.stroke-btn{padding:.22rem .6rem;font-size:.65rem;letter-spacing:.06em;text-transform:uppercase;border:1px solid ${T.border};border-radius:3px;background:transparent;color:${T.muted};font-family:'DM Sans',sans-serif;transition:all .15s}
.stroke-btn.active,.stroke-btn:hover{background:${T.ink};color:${T.white};border-color:${T.ink}}
.sig-method-tabs{display:flex;background:${T.cream};border-radius:4px;padding:3px;margin-bottom:.75rem;gap:2px}
.sig-method-tab{flex:1;padding:.38rem;font-size:.67rem;letter-spacing:.06em;text-transform:uppercase;font-weight:500;border:none;border-radius:3px;background:transparent;color:${T.muted};font-family:'DM Sans',sans-serif;transition:all .2s}
.sig-method-tab.active{background:${T.white};color:${T.teal};box-shadow:0 1px 4px rgba(0,0,0,.1)}

/* ── CERTIFICATE PANEL ── */
.cert-wrap{border:2px solid ${T.gold};padding:2rem;background:${T.white};position:relative;overflow:hidden}
.cert-wrap::before{content:'CERTIFIED';position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-25deg);font-family:'Cormorant Garamond',serif;font-size:5.5rem;font-weight:600;color:rgba(184,134,11,.04);pointer-events:none;white-space:nowrap}
.cert-header{text-align:center;border-bottom:1px solid ${T.gold};padding-bottom:1.1rem;margin-bottom:1.25rem}
.cert-title{font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:300;letter-spacing:.1em;color:${T.teal}}
.cert-sub{font-size:.72rem;color:${T.muted};letter-spacing:.12em;text-transform:uppercase;margin-top:.2rem}
.cert-sig-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1.1rem;margin-top:1.25rem}
.cert-sig-box{border:1px solid ${T.border};padding:.85rem;text-align:center;background:${T.paper}}
.cert-hash{font-family:monospace;font-size:.62rem;color:${T.muted};word-break:break-all;background:${T.cream};padding:.45rem;border-radius:2px;margin-top:.9rem}

/* ── SIGNER FACING ── */
.sf-signer-root{min-height:100vh;display:flex;align-items:flex-start;justify-content:center;padding:2rem 1rem 4rem;background:radial-gradient(ellipse at 20% 20%,rgba(26,58,74,.12) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(184,134,11,.08) 0%,transparent 60%),#EDEAE4}
.sf-phone{width:100%;max-width:390px;background:${T.white};border-radius:36px;box-shadow:0 0 0 7px #111,0 0 0 9px #333,0 36px 70px rgba(0,0,0,.3);overflow:hidden}
.sf-phone-notch{width:100%;height:34px;background:#111;display:flex;align-items:center;justify-content:center}
.sf-phone-pill{width:96px;height:11px;background:#222;border-radius:6px;border:1px solid #444}
.sf-phone-screen{background:${T.paper};min-height:720px}
.sf-phone-bar{height:26px;background:${T.white};display:flex;align-items:center;justify-content:center}
.sf-phone-bar-pill{width:110px;height:4px;background:#CCC;border-radius:2px}
.sf-status-bar{height:42px;background:${T.teal};display:flex;align-items:center;justify-content:space-between;padding:0 1.1rem;font-size:.62rem;font-weight:600;color:rgba(255,255,255,.8);letter-spacing:.04em}
.sf-app-header{background:${T.teal};padding:0 1.1rem 1.1rem;color:${T.white}}
.sf-app-header-brand{display:flex;align-items:center;gap:.4rem;font-family:'Cormorant Garamond',serif;font-size:1rem;font-weight:300;letter-spacing:.1em;color:rgba(255,255,255,.65);margin-bottom:.65rem}
.sf-doc-header-name{font-family:'Cormorant Garamond',serif;font-size:1.25rem;font-weight:400;color:${T.white};margin-bottom:.3rem;line-height:1.25}
.sf-doc-meta{font-size:.68rem;color:rgba(255,255,255,.5);display:flex;gap:.45rem;align-items:center;flex-wrap:wrap}
.sf-signer-step-track{display:flex;padding:.75rem 1.1rem;background:${T.white};border-bottom:1px solid ${T.border}}
.sf-signer-step{flex:1;display:flex;flex-direction:column;align-items:center;gap:.22rem;position:relative}
.sf-signer-step::after{content:'';position:absolute;top:9px;left:50%;right:-50%;height:1px;background:${T.border};z-index:0}
.sf-signer-step:last-child::after{display:none}
.sf-signer-step.done::after{background:${T.gold}}
.sf-step-node{width:18px;height:18px;border-radius:50%;border:1.5px solid ${T.border};background:${T.white};display:flex;align-items:center;justify-content:center;font-size:.58rem;font-weight:600;color:${T.muted};position:relative;z-index:1;transition:all .25s}
.sf-signer-step.active .sf-step-node{border-color:${T.gold};background:${T.gold};color:${T.white}}
.sf-signer-step.done .sf-step-node{border-color:${T.green};background:${T.green};color:${T.white}}
.sf-step-label{font-size:.56rem;letter-spacing:.05em;text-transform:uppercase;color:${T.muted}}
.sf-signer-step.active .sf-step-label{color:${T.gold};font-weight:600}
.sf-screen{padding:1.1rem;animation:fadeUp .3s ease both}
.sf-screen-scroll{overflow-y:auto;max-height:580px}
.sf-sender-card{background:linear-gradient(135deg,${T.teal} 0%,${T.tealLt} 100%);border-radius:10px;padding:1rem .95rem .85rem;margin-bottom:.75rem;color:${T.white}}
.sf-sender-avatar{width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.15);border:1.5px solid rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:.68rem;font-weight:600;color:${T.goldLt};flex-shrink:0}
.sf-sender-msg{font-size:.74rem;color:rgba(255,255,255,.7);line-height:1.55;margin-top:.75rem;padding-top:.65rem;border-top:1px solid rgba(255,255,255,.12);font-style:italic}
.otp-row{display:flex;gap:.45rem;justify-content:center;margin:1.1rem 0}
.otp-cell{width:46px!important;height:52px!important;text-align:center!important;font-size:1.35rem!important;font-weight:600!important;border:1.5px solid ${T.border}!important;border-radius:6px!important;padding:0!important;margin:0!important;outline:none!important;transition:border-color .2s,box-shadow .2s!important;background:${T.white}!important;color:${T.ink}!important}
.otp-cell:focus{border-color:${T.gold}!important;box-shadow:0 0 0 3px rgba(184,134,11,.15)!important}
.sf-check-item{display:flex;align-items:flex-start;gap:.6rem;padding:.45rem 0;border-bottom:1px solid ${T.cream};font-size:.79rem;line-height:1.5}
.sf-check-item:last-child{border-bottom:none}
.sf-checkbox{width:19px;height:19px;border-radius:3px;border:1.5px solid ${T.border};flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.62rem;cursor:pointer;transition:all .2s;margin-top:1px}
.sf-checkbox.checked{background:${T.green};border-color:${T.green};color:${T.white}}
.sf-doc-viewer{background:#EDECE9;border-radius:6px;overflow:hidden;margin-bottom:.75rem}
.sf-doc-page-tabs{display:flex;background:${T.teal};padding:.35rem .45rem 0;gap:.2rem}
.sf-doc-page-tab{padding:.28rem .65rem;font-size:.62rem;font-weight:500;letter-spacing:.05em;text-transform:uppercase;background:transparent;border:none;border-radius:3px 3px 0 0;color:rgba(255,255,255,.45);cursor:pointer;transition:all .2s}
.sf-doc-page-tab.active{background:${T.paper};color:${T.teal}}
.sf-doc-content{background:${T.white};padding:1.1rem;min-height:220px}
.sf-doc-page-title{font-family:'Cormorant Garamond',serif;font-size:.95rem;font-weight:600;color:${T.ink};margin-bottom:.65rem;padding-bottom:.45rem;border-bottom:1px solid ${T.border};text-align:center}
.sf-doc-body{font-size:.68rem;line-height:1.7;color:#333;white-space:pre-line}
.sf-field-zone{margin-top:.85rem;padding:.65rem;border:1.5px dashed ${T.gold};border-radius:5px;background:${T.goldPale};display:flex;align-items:center;gap:.55rem;cursor:pointer;transition:all .2s}
.sf-field-zone:hover{background:#EDD9A3}
.sf-field-zone.done{border-color:${T.green};background:${T.greenBg};border-style:solid;cursor:default}
.sf-field-label{font-size:.7rem;color:${T.gold};font-weight:500;letter-spacing:.04em;flex:1}
.sf-field-zone.done .sf-field-label{color:${T.green}}
.sf-drawer-overlay{position:fixed;inset:0;background:rgba(13,13,13,.6);z-index:800;display:flex;align-items:flex-end;justify-content:center;animation:overlayIn .2s ease}
@keyframes overlayIn{from{opacity:0}to{opacity:1}}
.sf-drawer{background:${T.white};border-radius:18px 18px 0 0;width:100%;max-width:420px;padding:.9rem 1.1rem 1.75rem;animation:drawerUp .25s ease;max-height:90vh;overflow-y:auto}
@keyframes drawerUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
.sf-drawer-handle{width:38px;height:4px;background:${T.border};border-radius:2px;margin:0 auto .75rem}
.sf-drawer-title{font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:400;color:${T.teal};margin-bottom:.2rem}
.sf-drawer-sub{font-size:.72rem;color:${T.muted};margin-bottom:.9rem}
.sf-progress-bar{height:3px;background:${T.border};border-radius:2px;overflow:hidden;margin-bottom:.9rem}
.sf-progress-fill{height:100%;background:${T.gold};border-radius:2px;transition:width .4s ease}
.sf-consent-block{background:${T.cream};border-radius:5px;padding:.75rem .9rem;font-size:.7rem;line-height:1.6;color:${T.muted};margin-bottom:.85rem}
.sf-success-bg{background:linear-gradient(160deg,${T.teal} 0%,#0D2E38 100%);min-height:720px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem;text-align:center;color:${T.white}}
.sf-success-ring{width:72px;height:72px;border-radius:50%;border:2px solid ${T.goldLt};display:flex;align-items:center;justify-content:center;font-size:1.8rem;margin-bottom:1.25rem;background:rgba(184,134,11,.1);animation:ringPop .5s ease .1s both}
@keyframes ringPop{0%{transform:scale(.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
.sf-success-title{font-family:'Cormorant Garamond',serif;font-size:1.85rem;font-weight:300;letter-spacing:.06em;color:${T.white};margin-bottom:.45rem}
.sf-success-sub{font-size:.79rem;color:rgba(255,255,255,.6);line-height:1.6;margin-bottom:1.75rem;max-width:260px}
.sf-success-doc-card{width:100%;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:1rem;margin-bottom:1.25rem;text-align:left}
.sf-success-row{display:flex;justify-content:space-between;font-size:.7rem;color:rgba(255,255,255,.5);padding:.28rem 0;border-bottom:1px solid rgba(255,255,255,.07)}
.sf-success-row:last-child{border-bottom:none}
.sf-success-row span:last-child{color:rgba(255,255,255,.8)}
.sf-cert-stamp{display:flex;align-items:center;gap:.55rem;background:rgba(184,134,11,.15);border:1px solid rgba(184,134,11,.3);border-radius:7px;padding:.7rem .9rem;margin-bottom:1.1rem;font-size:.72rem;color:${T.goldLt};width:100%}
.sf-signer-btn{display:flex;align-items:center;justify-content:center;gap:.4rem;width:100%;padding:.78rem 1.1rem;font-family:'DM Sans',sans-serif;font-size:.76rem;font-weight:600;letter-spacing:.07em;text-transform:uppercase;border:none;border-radius:8px;margin-bottom:.45rem;transition:all .2s}
.sf-signer-btn-teal{background:${T.teal};color:${T.white}}
.sf-signer-btn-teal:hover{background:${T.tealLt}}
.sf-signer-btn-teal:disabled{background:${T.border};color:${T.muted};cursor:not-allowed}
.sf-signer-btn-green{background:${T.green};color:${T.white}}
.sf-signer-btn-green:hover{background:#246044}
.sf-signer-btn-green:disabled{background:${T.border};color:${T.muted};cursor:not-allowed}
.sf-signer-btn-outline{background:transparent;border:1.5px solid ${T.border};color:${T.ink}}
.sf-signer-btn-ghost{background:transparent;border:none;color:${T.muted};font-size:.73rem;padding:.45rem}

/* ── TOAST ── */
.sf-toast{position:fixed;bottom:2rem;right:2rem;background:${T.teal};color:${T.paper};padding:.8rem 1.3rem;border-left:3px solid ${T.gold};font-size:.83rem;z-index:9999;max-width:320px;box-shadow:0 4px 20px rgba(0,0,0,.2);animation:slideIn .3s ease,fadeOut .3s ease 2.7s forwards}
@keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
@keyframes fadeOut{to{opacity:0;transform:translateY(8px)}}

/* ── MISC ── */
.flex-row{display:flex;align-items:center;gap:.7rem;flex-wrap:wrap}
.text-muted{color:${T.muted};font-size:.8rem}
.text-small{font-size:.72rem;color:${T.muted}}
.section-label{font-size:.67rem;letter-spacing:.1em;text-transform:uppercase;color:${T.muted};margin-bottom:.6rem;font-weight:500}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fade-in{animation:fadeUp .35s ease both}
.settings-layout{display:grid;grid-template-columns:200px 1fr;gap:1.25rem}
@media(max-width:640px){.settings-layout{grid-template-columns:1fr}}
.settings-nav-item{display:flex;align-items:center;gap:.55rem;padding:.55rem .8rem;font-size:.82rem;border:none;background:none;width:100%;text-align:left;color:${T.muted};border-radius:2px;transition:all .15s}
.settings-nav-item:hover{background:${T.cream};color:${T.ink}}
.settings-nav-item.active{background:${T.teal};color:${T.white}}
.toggle{width:42px;height:22px;border-radius:11px;background:${T.border};position:relative;cursor:pointer;transition:background .25s;flex-shrink:0}
.toggle.on{background:${T.gold}}
.toggle-knob{position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:${T.white};transition:transform .25s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.toggle.on .toggle-knob{transform:translateX(20px)}
.info-row{display:flex;justify-content:space-between;align-items:center;padding:.5rem 0;border-bottom:1px solid ${T.cream};font-size:.8rem}
.info-row:last-child{border-bottom:none}
.info-label{color:${T.muted};font-size:.7rem;letter-spacing:.04em}
.info-val{font-weight:500;font-size:.82rem;text-align:right}
.plan-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:.9rem}
@media(max-width:640px){.plan-grid{grid-template-columns:1fr}}
.plan-card{border:1.5px solid ${T.border};padding:1.25rem;position:relative;transition:border-color .2s;border-radius:3px}
.plan-card.current{border-color:${T.gold}}
.plan-card.current::before{content:'Current';position:absolute;top:-9px;left:1rem;background:${T.gold};color:${T.white};font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;padding:.13rem .55rem;border-radius:20px}
`;

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════
const uid = () => Math.random().toString(36).slice(2,9).toUpperCase();
const ts  = () => new Date().toLocaleString("en-CA",{hour12:false});
const hashStr = s => { let h=0; for(let i=0;i<s.length;i++) h=(Math.imul(31,h)+s.charCodeAt(i))|0; return (h>>>0).toString(16).padStart(8,"0").toUpperCase(); };
const pwStrength = pw => {
  if(!pw) return {score:0,pct:0,label:"",color:"transparent"};
  let s=0;
  if(pw.length>=8)s++; if(/[A-Z]/.test(pw))s++; if(/[0-9]/.test(pw))s++; if(/[^A-Za-z0-9]/.test(pw))s++;
  return {score:s,pct:s*25,label:["Very Weak","Weak","Fair","Good","Strong"][s],color:[T.red,T.red,"#D4A017",T.gold,T.green][s]};
};

// ═══════════════════════════════════════════════════════════════════════════════
// IN-MEMORY DATABASE
// ═══════════════════════════════════════════════════════════════════════════════
const DB = {
  users: [
    {id:"USR001",firstName:"Stephen",lastName:"MacLean",email:"stephen@signflow.app",password:"demo1234",org:"MacLean Legal Group",role:"admin",avatar:"SM",plan:"professional",joined:"2026-01-15",twoFA:true},
    {id:"USR002",firstName:"Alex",lastName:"Nguyen",email:"alex@signflow.app",password:"demo1234",org:"MacLean Legal Group",role:"member",avatar:"AN",plan:"professional",joined:"2026-02-20",twoFA:false},
  ],
  sessions:{},
  documents:[
    {id:"DOC001",name:"Service Agreement — Apex Consulting",created:"2026-04-01 09:14",status:"in-progress",
     signers:[
       {id:"s1",name:"Margaret Chen",email:"m.chen@apex.com",phone:"+1 416 555 0192",order:1,status:"signed",signedAt:"2026-04-02 14:22",sigDataUrl:null},
       {id:"s2",name:"Robert Harlow",email:"r.harlow@apex.com",phone:"+1 416 555 0341",order:2,status:"sent",signedAt:null,sigDataUrl:null},
       {id:"s3",name:"Stephen MacLean",email:"stephen@signflow.app",phone:"",order:3,status:"waiting",signedAt:null,sigDataUrl:null},
     ],
     audit:[
       {id:1,type:"created",action:"Document created",detail:"Uploaded by Stephen MacLean",time:"2026-04-01 09:14"},
       {id:2,type:"sent",action:"Sent to Margaret Chen",detail:"Email + SMS: +1 416 555 0192",time:"2026-04-01 09:15"},
       {id:3,type:"signed",action:"Signed by Margaret Chen",detail:"IP: 142.251.x.x — Toronto, ON",time:"2026-04-02 14:22"},
       {id:4,type:"sent",action:"Sent to Robert Harlow",detail:"Email + SMS: +1 416 555 0341",time:"2026-04-02 14:22"},
     ]},
    {id:"DOC002",name:"NDA — Meridian Partners",created:"2026-03-28 11:30",status:"completed",
     signers:[
       {id:"s4",name:"Julia Vasquez",email:"j.vasquez@meridian.ca",phone:"",order:1,status:"signed",signedAt:"2026-03-29 10:05",sigDataUrl:null},
       {id:"s5",name:"Stephen MacLean",email:"stephen@signflow.app",phone:"",order:2,status:"signed",signedAt:"2026-03-29 10:41",sigDataUrl:null},
     ],
     audit:[
       {id:1,type:"created",action:"Document created",detail:"Uploaded by Stephen MacLean",time:"2026-03-28 11:30"},
       {id:2,type:"sent",action:"Sent to Julia Vasquez",detail:"Email: j.vasquez@meridian.ca",time:"2026-03-28 11:31"},
       {id:3,type:"signed",action:"Signed by Julia Vasquez",detail:"IP: 99.79.x.x — Ottawa, ON",time:"2026-03-29 10:05"},
       {id:4,type:"signed",action:"Signed by Stephen MacLean",detail:"IP: 24.114.x.x — Halifax, NS",time:"2026-03-29 10:41"},
       {id:5,type:"complete",action:"Document fully executed",detail:"Certificate issued — SHA-256 verified",time:"2026-03-29 10:41"},
     ]},
  ],
};
const dbLogin = (email,pw) => { const u=DB.users.find(u=>u.email===email&&u.password===pw); if(!u)return null; const tok=uid(); DB.sessions[tok]=u.id; return {tok,user:u}; };
const dbRegister = d => { if(DB.users.find(u=>u.email===d.email))return {error:"Email already registered."}; const u={id:"USR"+uid(),...d,role:"admin",avatar:(d.firstName[0]+d.lastName[0]).toUpperCase(),plan:"starter",joined:new Date().toISOString().slice(0,10),twoFA:false}; DB.users.push(u); const tok=uid(); DB.sessions[tok]=u.id; return {tok,user:u}; };

// ═══════════════════════════════════════════════════════════════════════════════
// REUSABLE COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

function Toast({msg}){ return msg ? <div className="sf-toast">{msg}</div> : null; }

function useToast(){
  const [msg,setMsg]=useState(null);
  const show=useCallback(m=>{setMsg(m);setTimeout(()=>setMsg(null),3000);},[]);
  return [msg,show];
}

function OTPInput({value,onChange,count=4}){
  const refs=Array.from({length:count},()=>useRef(null));
  const digits=(value+" ".repeat(count)).slice(0,count).split("");
  const set=(i,v)=>{const a=[...digits];a[i]=v.slice(-1);onChange(a.join("").replace(/ /g,""));if(v&&i<count-1)refs[i+1].current?.focus();};
  const onKey=(i,e)=>{if(e.key==="Backspace"&&!digits[i].trim()&&i>0)refs[i-1].current?.focus();};
  const onPaste=e=>{const p=e.clipboardData.getData("text").replace(/\D/g,"").slice(0,count);onChange(p);refs[Math.min(p.length,count-1)].current?.focus();};
  return(
    <div className="otp-row">
      {refs.map((r,i)=>(
        <input key={i} ref={r} type="tel" maxLength={1} className="otp-cell"
          value={digits[i].trim()} onChange={e=>set(i,e.target.value)}
          onKeyDown={e=>onKey(i,e)} onPaste={onPaste}/>
      ))}
    </div>
  );
}

function SigCanvas({onSave,compact=false}){
  const canvasRef=useRef(null);
  const drawing=useRef(false);
  const [empty,setEmpty]=useState(true);
  const [ink,setInk]=useState("#0D0D0D");
  const [stroke,setStroke]=useState(2.5);
  const [mode,setMode]=useState("draw");
  const [typed,setTyped]=useState("");
  const inks=["#0D0D0D","#1A3A4A","#8B2020","#2D6A4F","#4A3728"];
  const strokes=[{l:"Fine",v:1.5},{l:"Med",v:2.5},{l:"Bold",v:4}];
  const pt=(e,c)=>{const r=c.getBoundingClientRect(),sx=c.width/r.width,sy=c.height/r.height,s=e.touches?e.touches[0]:e;return[(s.clientX-r.left)*sx,(s.clientY-r.top)*sy];};
  const start=e=>{e.preventDefault();drawing.current=true;setEmpty(false);const c=canvasRef.current,ctx=c.getContext("2d");const[x,y]=pt(e,c);ctx.beginPath();ctx.moveTo(x,y);ctx.strokeStyle=ink;ctx.lineWidth=stroke;ctx.lineCap="round";ctx.lineJoin="round";};
  const move=e=>{e.preventDefault();if(!drawing.current)return;const c=canvasRef.current,ctx=c.getContext("2d");const[x,y]=pt(e,c);ctx.lineTo(x,y);ctx.stroke();};
  const stop=()=>{drawing.current=false;};
  const clear=()=>{const c=canvasRef.current;c.getContext("2d").clearRect(0,0,c.width,c.height);setEmpty(true);};
  const save=()=>{
    const c=canvasRef.current;
    if(mode==="type"){
      if(!typed.trim())return;
      const ctx=c.getContext("2d");ctx.clearRect(0,0,c.width,c.height);
      ctx.font=`italic ${compact?50:58}px 'Cormorant Garamond',serif`;ctx.fillStyle=ink;ctx.textAlign="center";ctx.textBaseline="middle";
      ctx.fillText(typed,c.width/2,c.height/2+5);
    } else { if(empty)return; }
    onSave(c.toDataURL("image/png"));
  };
  const h=compact?120:160;
  return(
    <div>
      <div className="sig-method-tabs">
        <button className={`sig-method-tab${mode==="draw"?" active":""}`} onClick={()=>setMode("draw")}>✍ Draw</button>
        <button className={`sig-method-tab${mode==="type"?" active":""}`} onClick={()=>setMode("type")}>Aa Type</button>
      </div>
      {mode==="draw"?(
        <div className="sig-canvas-wrap">
          <canvas ref={canvasRef} width={700} height={compact?150:200} style={{height:h}}
            onMouseDown={start} onMouseMove={move} onMouseUp={stop} onMouseLeave={stop}
            onTouchStart={start} onTouchMove={move} onTouchEnd={stop}/>
          <div className="sig-baseline"/>
          {empty&&<div className="sig-placeholder"><span className="sig-placeholder-text">Draw your signature here</span></div>}
        </div>
      ):(
        <>
          <canvas ref={canvasRef} width={700} height={200} style={{display:"none"}}/>
          <div className="sig-canvas-wrap" style={{height:h,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontStyle:"italic",color:typed?ink:T.border}}>{typed||"Your name here"}</span>
          </div>
          <input className="sf-input" style={{marginTop:".6rem"}} placeholder="Type your full name" value={typed} onChange={e=>setTyped(e.target.value)}/>
        </>
      )}
      <div className="sig-controls">
        {inks.map(c=><div key={c} className={`ink-dot${ink===c?" active":""}`} style={{background:c}} onClick={()=>setInk(c)}/>)}
        <div style={{flex:1}}/>
        {strokes.map(s=><button key={s.v} className={`stroke-btn${stroke===s.v?" active":""}`} onClick={()=>setStroke(s.v)}>{s.l}</button>)}
      </div>
      <div className="flex-row">
        <button className="btn btn-outline btn-sm" onClick={clear} style={{flex:1}}>Clear</button>
        <button className="btn btn-primary btn-sm" style={{flex:2}} onClick={save} disabled={mode==="draw"?empty:!typed.trim()}>Apply Signature ✓</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTH SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
function AuthScreen({onAuth}){
  const [mode,setMode]=useState("login"); // login|register|forgot|2fa|sent
  const [showPw,setShowPw]=useState(false);
  const [err,setErr]=useState("");
  const [otp,setOtp]=useState("");
  const [pending,setPending]=useState(null);
  const [form,setForm]=useState({firstName:"",lastName:"",email:"",password:"",confirm:"",org:""});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const str=pwStrength(form.password);

  const doLogin=()=>{setErr("");const r=dbLogin(form.email,form.password);if(!r){setErr("Invalid email or password.");return;}if(r.user.twoFA){setPending(r);setMode("2fa");return;}onAuth(r.tok,r.user);};
  const doRegister=()=>{setErr("");if(!form.firstName||!form.lastName||!form.email||!form.password){setErr("All required fields must be filled.");return;}if(form.password!==form.confirm){setErr("Passwords do not match.");return;}if(form.password.length<8){setErr("Password must be at least 8 characters.");return;}const r=dbRegister({firstName:form.firstName,lastName:form.lastName,email:form.email,password:form.password,org:form.org});if(r.error){setErr(r.error);return;}onAuth(r.tok,r.user);};
  const do2FA=()=>{if(otp.length<4){setErr("Enter the full code.");return;}onAuth(pending.tok,pending.user);};

  const features=[["✍","Touchscreen signature pad — draw on any device"],["⛓","Tamper-evident SHA-256 audit trail"],["🔢","Multi-signer sequential workflows"],["📨","Email + SMS delivery with OTP verification"],["📜","Auto-generated completion certificates with PDF export"]];

  return(
    <div className="auth-root fade-in">
      <div className="auth-left">
        <div className="auth-left-bg"/><div className="auth-left-orb"/>
        <div className="auth-brand"><div className="auth-brand-ring">✍</div>Sign<span>Flow</span></div>
        <div>
          <div className="auth-headline">Documents signed.<br/><em>Legally sealed.</em><br/>Instantly delivered.</div>
          <ul className="auth-features">{features.map(([icon,text])=><li key={text} className="auth-feature"><div className="auth-feat-icon">{icon}</div>{text}</li>)}</ul>
        </div>
        <div className="auth-foot">SignFlow · Secure Electronic Signatures · SOC 2 Type II</div>
      </div>
      <div className="auth-right">
        <div className="auth-box">
          {mode==="2fa"&&(
            <>
              <div className="auth-heading">Two-Factor Auth</div>
              <div className="auth-sub">Enter the code from your authenticator app</div>
              {err&&<div style={{background:T.redBg,borderLeft:`3px solid ${T.red}`,padding:".6rem .85rem",borderRadius:"3px",fontSize:".8rem",color:T.red,marginBottom:"1rem"}}>{err}</div>}
              <OTPInput value={otp} onChange={setOtp} count={6}/>
              <button className="btn btn-primary btn-full" onClick={do2FA}>Verify →</button>
              <div style={{textAlign:"center",marginTop:".75rem"}}><button className="btn btn-ghost" onClick={()=>{setMode("login");setErr("")}}>← Back</button></div>
              <div className="text-small" style={{textAlign:"center",marginTop:".5rem"}}>Demo: enter any 6 digits</div>
            </>
          )}
          {mode==="forgot"&&(
            <>
              <div className="auth-heading">Reset Password</div>
              <div className="auth-sub">We'll send a reset link to your email</div>
              {err&&<div style={{background:T.redBg,borderLeft:`3px solid ${T.red}`,padding:".6rem .85rem",borderRadius:"3px",fontSize:".8rem",color:T.red,marginBottom:"1rem"}}>{err}</div>}
              <label className="sf-label">Email Address</label>
              <input className="sf-input" type="email" placeholder="you@company.com" value={form.email} onChange={e=>f("email",e.target.value)}/>
              <button className="btn btn-primary btn-full" onClick={()=>{if(!form.email){setErr("Enter your email.");return;}setMode("sent");setErr("");}}>Send Reset Link</button>
              <div style={{textAlign:"center",marginTop:".75rem"}}><button className="btn btn-ghost" onClick={()=>{setMode("login");setErr("")}}>← Back to login</button></div>
            </>
          )}
          {mode==="sent"&&(
            <>
              <div style={{textAlign:"center",fontSize:"2.5rem",marginBottom:".85rem"}}>📬</div>
              <div className="auth-heading" style={{textAlign:"center"}}>Check Your Email</div>
              <div className="auth-sub" style={{textAlign:"center"}}>Reset link sent to <strong>{form.email}</strong> — expires in 30 min.</div>
              <button className="btn btn-outline btn-full" onClick={()=>{setMode("login");setErr("");}}>Back to Login</button>
            </>
          )}
          {(mode==="login"||mode==="register")&&(
            <>
              <div className="auth-tabs">
                <button className={`auth-tab${mode==="login"?" active":""}`} onClick={()=>{setMode("login");setErr("");}}>Sign In</button>
                <button className={`auth-tab${mode==="register"?" active":""}`} onClick={()=>{setMode("register");setErr("");}}>Create Account</button>
              </div>
              <div className="auth-heading">{mode==="login"?"Welcome back":"Get started"}</div>
              <div className="auth-sub">{mode==="login"?"Sign in to your SignFlow account":"Create your free SignFlow account"}</div>
              {err&&<div style={{background:T.redBg,borderLeft:`3px solid ${T.red}`,padding:".6rem .85rem",borderRadius:"3px",fontSize:".8rem",color:T.red,marginBottom:"1rem"}}>{err}</div>}
              {mode==="register"&&(
                <div className="form-row">
                  <div><label className="sf-label">First Name *</label><input className="sf-input" type="text" placeholder="Jane" value={form.firstName} onChange={e=>f("firstName",e.target.value)}/></div>
                  <div><label className="sf-label">Last Name *</label><input className="sf-input" type="text" placeholder="Smith" value={form.lastName} onChange={e=>f("lastName",e.target.value)}/></div>
                </div>
              )}
              <label className="sf-label">Email Address *</label>
              <input className="sf-input" type="email" placeholder="you@company.com" value={form.email} onChange={e=>f("email",e.target.value)} onKeyDown={e=>e.key==="Enter"&&mode==="login"&&doLogin()}/>
              {mode==="register"&&<><label className="sf-label">Organisation</label><input className="sf-input" type="text" placeholder="Acme Corp" value={form.org} onChange={e=>f("org",e.target.value)}/></>}
              <label className="sf-label">Password *</label>
              <div className="sf-input-wrap" style={{marginBottom:".9rem"}}>
                <input className="sf-input" type={showPw?"text":"password"} placeholder={mode==="register"?"Min. 8 characters":"Password"} value={form.password} onChange={e=>f("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&mode==="login"&&doLogin()}/>
                <span className="sf-input-suffix" onClick={()=>setShowPw(p=>!p)}>{showPw?"🙈":"👁"}</span>
              </div>
              {mode==="register"&&form.password&&<><div className="pw-strength-bar"><div className="pw-strength-fill" style={{width:str.pct+"%",background:str.color}}/></div><div style={{fontSize:".72rem",color:str.color,marginBottom:".85rem"}}>{str.label}</div></>}
              {mode==="register"&&<><label className="sf-label">Confirm Password *</label><input className="sf-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={e=>f("confirm",e.target.value)}/></>}
              {mode==="login"&&<div style={{textAlign:"right",marginTop:"-.5rem",marginBottom:".9rem"}}><button className="btn btn-ghost" style={{padding:0,fontSize:".76rem"}} onClick={()=>{setMode("forgot");setErr("")}}>Forgot password?</button></div>}
              <button className="btn btn-gold btn-full" onClick={mode==="login"?doLogin:doRegister}>{mode==="login"?"Sign In →":"Create Account →"}</button>
              {mode==="login"&&<div className="text-small" style={{textAlign:"center",marginTop:"1.1rem"}}>Demo: <strong>stephen@signflow.app</strong> / <strong>demo1234</strong><br/><span style={{fontSize:".68rem"}}>(2FA enabled — enter any 6 digits)</span></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({user,docs,onViewDoc,onNewDoc,savedSig}){
  const stats=[
    {label:"Total Sent",val:docs.length,color:T.teal},
    {label:"In Progress",val:docs.filter(d=>d.status==="in-progress").length,color:T.gold},
    {label:"Completed",val:docs.filter(d=>d.status==="completed").length,color:T.green},
    {label:"Awaiting Me",val:docs.filter(d=>d.signers.some(s=>s.email===user.email&&s.status==="sent")).length,color:T.red},
  ];
  const auditColors={created:T.teal,sent:T.gold,signed:T.green,complete:T.green,cert:T.gold};
  const auditIcons={created:"📄",sent:"📨",signed:"✍️",complete:"✅",cert:"🔏"};
  return(
    <div className="fade-in">
      <div className="sf-page-title">Welcome back, {user.firstName}.</div>
      <div className="sf-page-sub">Document signing dashboard</div>
      <div className="stat-grid">
        {stats.map(s=>(
          <div key={s.label} className="stat-card" style={{"--accent-color":s.color}}>
            <div className="stat-val">{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="sf-card" style={{padding:0}}>
        <div style={{padding:"1.1rem 1.4rem",borderBottom:`1px solid ${T.border}`,display:"flex",alignItems:"center",gap:"1rem"}}>
          <div className="sf-card-title" style={{marginBottom:0,flex:1}}>Documents</div>
          <button className="btn btn-primary btn-sm" onClick={onNewDoc}>+ New Document</button>
        </div>
        {docs.length===0&&<div style={{padding:"2.5rem",textAlign:"center",color:T.muted,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"1.05rem"}}>No documents yet. Create your first one.</div>}
        {docs.map(doc=>{
          const total=doc.signers.length,signed=doc.signers.filter(s=>s.status==="signed").length;
          return(
            <div key={doc.id} className="doc-row" onClick={()=>onViewDoc(doc)}>
              <div className="doc-icon">📄</div>
              <div>
                <div className="doc-name">{doc.name}</div>
                <div className="doc-meta">{doc.id} · {doc.created} · {signed}/{total} signed</div>
              </div>
              <span className={`badge badge-${doc.status==="completed"?"complete":"in-progress"}`}>{doc.status==="completed"?"✓ Complete":"⏳ In Progress"}</span>
              <button className="btn btn-outline btn-sm" onClick={e=>{e.stopPropagation();onViewDoc(doc);}}>View →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CREATE DOCUMENT
// ═══════════════════════════════════════════════════════════════════════════════
function CreateDoc({user,onSend,onCancel}){
  const [step,setStep]=useState(0);
  const [doc,setDoc]=useState({name:"",message:"",signers:[{id:uid(),name:"",email:"",phone:"",order:1}]});
  const addSigner=()=>setDoc(d=>({...d,signers:[...d.signers,{id:uid(),name:"",email:"",phone:"",order:d.signers.length+1}]}));
  const removeSigner=id=>setDoc(d=>({...d,signers:d.signers.filter(s=>s.id!==id).map((s,i)=>({...s,order:i+1}))}));
  const updateSigner=(id,k,v)=>setDoc(d=>({...d,signers:d.signers.map(s=>s.id===id?{...s,[k]:v}:s)}));
  const steps=["Document","Signers","Send"];
  return(
    <div className="fade-in">
      <div className="flex-row" style={{marginBottom:"1.5rem"}}>
        <button className="btn btn-outline btn-sm" onClick={onCancel}>← Back</button>
        <div className="sf-page-title" style={{marginBottom:0}}>New Document</div>
      </div>
      <div className="progress-track">
        {steps.map((s,i)=>(
          <div key={s} className={`progress-step${i<step?" done":""}${i===step?" active":""}`}>
            <div className="step-circle">{i<step?"✓":i+1}</div>
            <div className="step-lbl">{s}</div>
          </div>
        ))}
      </div>
      {step===0&&(
        <div className="sf-card">
          <div className="sf-card-title">Document Details</div>
          <label className="sf-label">Document Name *</label>
          <input className="sf-input" placeholder="e.g. Service Agreement — Acme Corp" value={doc.name} onChange={e=>setDoc(d=>({...d,name:e.target.value}))}/>
          <label className="sf-label">Upload Document</label>
          <div style={{border:`1.5px dashed ${T.border}`,padding:"1.75rem",textAlign:"center",background:T.paper,borderRadius:"3px",marginBottom:".9rem"}}>
            <div style={{fontSize:"2rem",marginBottom:".4rem"}}>📁</div>
            <div className="text-muted">Drag & drop PDF or Word document</div>
            <div className="text-small" style={{marginTop:".25rem"}}>or <span style={{color:T.gold,cursor:"pointer",textDecoration:"underline"}}>browse files</span> · PDF, DOCX — max 25 MB</div>
          </div>
          <label className="sf-label">Message to Signers</label>
          <textarea className="sf-textarea" placeholder="Optional message shown in the signing invitation..." value={doc.message} onChange={e=>setDoc(d=>({...d,message:e.target.value}))}/>
          <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn btn-primary" onClick={()=>setStep(1)}>Next: Add Signers →</button></div>
        </div>
      )}
      {step===1&&(
        <div className="sf-card">
          <div className="sf-card-title">Signing Order</div>
          <div className="text-muted" style={{marginBottom:"1.1rem",fontSize:".8rem"}}>Signers are notified in order — each after the previous completes.</div>
          {doc.signers.map(s=>(
            <div key={s.id} className="signer-row">
              <div className="signer-order-badge">{s.order}</div>
              <input className="sf-input" placeholder="Full name" value={s.name} onChange={e=>updateSigner(s.id,"name",e.target.value)}/>
              <input className="sf-input" type="email" placeholder="Email address" value={s.email} onChange={e=>updateSigner(s.id,"email",e.target.value)}/>
              <input className="sf-input" type="tel" placeholder="Phone (SMS)" value={s.phone} onChange={e=>updateSigner(s.id,"phone",e.target.value)}/>
              {doc.signers.length>1&&<button className="btn btn-danger btn-sm" style={{width:36,height:36,padding:0}} onClick={()=>removeSigner(s.id)}>✕</button>}
            </div>
          ))}
          <button className="btn btn-outline btn-sm" style={{marginTop:".4rem"}} onClick={addSigner}>+ Add Signer</button>
          <div className="divider"/>
          <div className="flex-row" style={{justifyContent:"space-between"}}>
            <button className="btn btn-outline" onClick={()=>setStep(0)}>← Back</button>
            <button className="btn btn-primary" onClick={()=>setStep(2)}>Next: Review →</button>
          </div>
        </div>
      )}
      {step===2&&(
        <div className="sf-card">
          <div className="sf-card-title">Review & Send</div>
          <div style={{background:T.paper,border:`1px solid ${T.border}`,borderRadius:"3px",padding:"1.1rem",marginBottom:"1.1rem"}}>
            <div style={{fontWeight:600,marginBottom:".2rem"}}>{doc.name||"Untitled Document"}</div>
            {doc.message&&<div className="text-muted" style={{fontStyle:"italic",fontSize:".82rem",marginBottom:".75rem"}}>"{doc.message}"</div>}
            <div className="section-label" style={{marginTop:".65rem"}}>Signing Order</div>
            {doc.signers.map(s=>(
              <div key={s.id} className="flex-row" style={{padding:".35rem 0"}}>
                <span style={{background:T.teal,color:T.white,borderRadius:"50%",width:20,height:20,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:".62rem",fontWeight:600,flexShrink:0}}>{s.order}</span>
                <span style={{fontSize:".86rem",fontWeight:500}}>{s.name||"(unnamed)"}</span>
                <span className="text-muted">{s.email}</span>
                {s.phone&&<span className="badge badge-sent" style={{fontSize:".62rem"}}>SMS ✓</span>}
              </div>
            ))}
          </div>
          <div style={{background:"#FFF8E1",border:"1px solid #FFE082",padding:".75rem .9rem",borderRadius:"3px",fontSize:".78rem",color:"#5D4037",marginBottom:"1.1rem"}}>
            ⚡ Signer #1 will receive an email{doc.signers[0]?.phone?" + SMS":""} invitation immediately upon sending.
          </div>
          <div className="flex-row" style={{justifyContent:"space-between"}}>
            <button className="btn btn-outline" onClick={()=>setStep(1)}>← Back</button>
            <button className="btn btn-gold" onClick={()=>onSend(doc)}>Send Document →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DOCUMENT DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
const DOC_PAGES_CONTENT=[
  {page:1,title:"Professional Services Agreement",body:`This Professional Services Agreement ("Agreement") is entered into as of April 5, 2026 by and between MacLean Legal Group ("Service Provider") and Apex Consulting Inc. ("Client").\n\n1. SCOPE OF SERVICES\nService Provider agrees to render legal advisory services as described in Schedule A. Services shall be performed in a professional and workmanlike manner consistent with industry standards.\n\n2. TERM\nThis Agreement commences on the Effective Date and continues for six (6) months unless earlier terminated in accordance with the provisions hereof.\n\n3. COMPENSATION\nClient shall pay Service Provider the fees set forth in Schedule B. Invoices are rendered monthly and due within thirty (30) days of receipt.`},
  {page:2,title:"Representations & Warranties",body:`4. REPRESENTATIONS AND WARRANTIES\nEach party represents and warrants that: (a) it has full power and authority to enter into this Agreement; (b) this Agreement has been duly authorized; (c) the execution and performance does not violate any applicable law.\n\n5. LIMITATION OF LIABILITY\nIn no event shall either party be liable for indirect, incidental, or consequential damages, however caused.\n\n6. CONFIDENTIALITY\nEach party agrees to hold in strict confidence all Confidential Information of the other party.`},
  {page:3,title:"Execution",body:`7. GOVERNING LAW\nThis Agreement shall be governed by the laws of the Province of Nova Scotia and applicable federal laws of Canada.\n\n8. ENTIRE AGREEMENT\nThis Agreement constitutes the entire agreement between the parties and supersedes all prior understandings.\n\n9. COUNTERPARTS\nThis Agreement may be executed in counterparts. Electronic signatures are deemed valid and binding to the same extent as original signatures under applicable law.\n\nIN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.`},
];

function DocDetail({doc,user,onBack,onDocUpdate,showToast,savedSig}){
  const [activePage,setActivePage]=useState(1);
  const [fieldValues,setFieldValues]=useState({});
  const [openField,setOpenField]=useState(null);
  const [consents,setConsents]=useState([false,false,false]);
  const [signerMode,setSignerMode]=useState(false); // if user is a pending signer
  const [signerStep,setSignerStep]=useState("review"); // review|sign|complete

  const allSigned=doc.signers.every(s=>s.status==="signed");
  const mySignerEntry=doc.signers.find(s=>s.email===user.email&&s.status==="waiting"||s.email===user.email&&s.status==="sent");
  const needsMySignature=mySignerEntry&&(mySignerEntry.status==="sent"||mySignerEntry.status==="waiting");
  const fields=[{id:"f1",page:1,type:"signature",label:"Authorized Signature",required:true},{id:"f2",page:2,type:"initials",label:"Initials — Page 2",required:true},{id:"f3",page:3,type:"date",label:"Date of Signing",required:true}];
  const allFieldsDone=fields.filter(f=>f.required).every(f=>fieldValues[f.id]);
  const requiredCount=fields.filter(f=>f.required).length;
  const doneCount=fields.filter(f=>f.required&&fieldValues[f.id]).length;

  const auditColors={created:T.teal,sent:T.gold,signed:T.green,complete:T.green,cert:T.gold};
  const auditIcons={created:"📄",sent:"📨",signed:"✍️",complete:"✅",cert:"🔏"};

  const generateHash=()=>{
    const blob=doc.id+doc.name+doc.signers.map(s=>s.signedAt+s.email).join("");
    return hashStr(blob).repeat(4);
  };

  const submitSignature=()=>{
    const now=ts();
    const updatedDoc={
      ...doc,
      status:"completed",
      signers:doc.signers.map(s=>s.email===user.email?{...s,status:"signed",signedAt:now,sigDataUrl:fieldValues["f1"]?.dataUrl||null}:s),
      audit:[...doc.audit,
        {id:doc.audit.length+1,type:"signed",action:`Signed by ${user.firstName} ${user.lastName}`,detail:`IP: 24.114.x.x — Halifax, NS`,time:now},
        {id:doc.audit.length+2,type:"complete",action:"Document fully executed",detail:"Certificate issued — SHA-256 verified",time:now},
      ]
    };
    onDocUpdate(updatedDoc);
    setSignerStep("complete");
    showToast("Document signed successfully ✓");
  };

  if(signerMode){
    return(
      <div className="fade-in">
        <div className="flex-row" style={{marginBottom:"1.5rem"}}>
          <button className="btn btn-outline btn-sm" onClick={()=>setSignerMode(false)}>← Back to Detail</button>
          <div className="sf-page-title" style={{marginBottom:0}}>Sign Document</div>
        </div>
        <div style={{display:"flex",justifyContent:"center"}}>
          <SignerFacingPage doc={doc} user={user} fieldValues={fieldValues} setFieldValues={setFieldValues}
            openField={openField} setOpenField={setOpenField} consents={consents} setConsents={setConsents}
            allFieldsDone={allFieldsDone} doneCount={doneCount} requiredCount={requiredCount}
            signerStep={signerStep} setSignerStep={setSignerStep} onSubmit={submitSignature}
            activePage={activePage} setActivePage={setActivePage} fields={fields}/>
        </div>
      </div>
    );
  }

  return(
    <div className="fade-in">
      <div className="flex-row" style={{marginBottom:"1.5rem"}}>
        <button className="btn btn-outline btn-sm" onClick={onBack}>← Back</button>
        <div className="sf-page-title" style={{marginBottom:0,flex:1}}>{doc.name}</div>
        <span className={`badge badge-${allSigned?"complete":"in-progress"}`}>{allSigned?"✓ Complete":"⏳ In Progress"}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem",alignItems:"start"}}>
        <div>
          {needsMySignature&&(
            <div className="sf-card" style={{borderTop:`3px solid ${T.gold}`,background:"#FFFDF5"}}>
              <div className="sf-card-title">Your Signature Required</div>
              <div className="text-muted" style={{fontSize:".8rem",marginBottom:"1rem"}}>It's your turn to sign this document.</div>
              <button className="btn btn-gold btn-full" onClick={()=>setSignerMode(true)}>Sign Now →</button>
            </div>
          )}
          <div className="sf-card">
            <div className="sf-card-title">Signers</div>
            {doc.signers.map(s=>(
              <div key={s.id} style={{display:"flex",gap:".85rem",alignItems:"center",padding:".65rem 0",borderBottom:`1px solid ${T.cream}`}}>
                <div style={{width:34,height:34,borderRadius:"50%",background:s.status==="signed"?T.green:s.status==="sent"?T.gold:T.border,color:T.white,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:600,fontSize:".8rem",flexShrink:0}}>{s.order}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:500,fontSize:".88rem"}}>{s.name}</div>
                  <div className="text-small">{s.email}</div>
                  {s.signedAt&&<div style={{fontSize:".7rem",color:T.green,marginTop:".1rem"}}>✓ Signed {s.signedAt}</div>}
                </div>
                <span className={`badge badge-${s.status}`}>{s.status==="signed"?"✓ Signed":s.status==="sent"?"📨 Sent":"⏸ Waiting"}</span>
              </div>
            ))}
          </div>
          {allSigned&&(
            <div className="sf-card" style={{borderTop:`3px solid ${T.gold}`}}>
              <div className="sf-card-title">Completion Certificate</div>
              <div className="cert-wrap">
                <div className="cert-header">
                  <div className="cert-title">Certificate of Completion</div>
                  <div className="cert-sub">SignFlow · Electronically Executed</div>
                </div>
                <div style={{fontSize:".8rem",marginBottom:".4rem"}}><strong>Document:</strong> {doc.name}</div>
                <div style={{fontSize:".8rem",marginBottom:".4rem"}}><strong>ID:</strong> {doc.id}</div>
                <div style={{fontSize:".8rem",marginBottom:"1rem"}}><strong>Completed:</strong> {doc.signers.reduce((a,s)=>s.signedAt>a?s.signedAt:a,"")}</div>
                <div className="section-label">Signatures</div>
                <div className="cert-sig-grid">
                  {doc.signers.map(s=>(
                    <div key={s.id} className="cert-sig-box">
                      <div style={{height:42,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic",fontSize:"1.2rem",color:T.ink,borderBottom:`1px solid ${T.border}`,marginBottom:".4rem"}}>
                        {s.sigDataUrl?<img src={s.sigDataUrl} style={{maxHeight:38,maxWidth:"100%"}} alt="sig"/>:s.name.split(" ").map(n=>n[0]).join(". ")+"."}
                      </div>
                      <div style={{fontSize:".78rem",fontWeight:500}}>{s.name}</div>
                      <div className="text-small">{s.signedAt}</div>
                    </div>
                  ))}
                </div>
                <div className="cert-hash">SHA-256: {generateHash()}...</div>
              </div>
              <div className="flex-row" style={{marginTop:".85rem"}}>
                <button className="btn btn-outline btn-sm" onClick={()=>showToast("Certificate downloaded ✓")}>⬇ Download PDF</button>
                <button className="btn btn-outline btn-sm" onClick={()=>showToast("Emailed to all parties ✓")}>📨 Email All</button>
              </div>
            </div>
          )}
        </div>
        <div>
          <div className="sf-card">
            <div className="sf-card-title">Audit Trail</div>
            {doc.audit.map(e=>(
              <div key={e.id} className="audit-entry">
                <div className="audit-dot" style={{background:auditColors[e.type]||T.muted,color:T.white}}>{auditIcons[e.type]||"·"}</div>
                <div style={{flex:1}}>
                  <div className="audit-action">{e.action}</div>
                  <div className="audit-detail">{e.detail}</div>
                  <div className="audit-time">{e.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SIGNER-FACING PAGE (embedded in detail + standalone phone view)
// ═══════════════════════════════════════════════════════════════════════════════
function SignerFacingPage({doc,user,fieldValues,setFieldValues,openField,setOpenField,consents,setConsents,allFieldsDone,doneCount,requiredCount,signerStep,setSignerStep,onSubmit,activePage,setActivePage,fields}){
  const steps=["review","sign","complete"];
  const stepIdx=steps.indexOf(signerStep);

  const pageField=p=>fields.find(f=>f.page===p);
  const applyField=(fieldId,dataUrl)=>{setFieldValues(p=>({...p,[fieldId]:{dataUrl}}));setOpenField(null);};

  return(
    <div className="sf-signer-root">
      <div className="sf-phone">
        <div className="sf-phone-notch"><div className="sf-phone-pill"/></div>
        <div className="sf-phone-screen">
          <div className="sf-status-bar">
            <span>9:41</span><span>SignFlow</span>
            <span style={{display:"flex",gap:".3rem",alignItems:"center",fontSize:".58rem"}}>●●● WiFi 🔋</span>
          </div>
          <div className="sf-app-header">
            <div className="sf-app-header-brand">
              <div style={{width:20,height:20,border:`1px solid rgba(184,134,11,.6)`,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:".6rem",color:T.goldLt}}>✍</div>
              Sign<span style={{color:T.goldLt}}>Flow</span>
            </div>
            <div className="sf-doc-header-name">{doc.name}</div>
            <div className="sf-doc-meta">
              <span>From {doc.signers[0]?.name||"Sender"}</span>
              <span>·</span><span>Expires April 12, 2026</span>
            </div>
          </div>
          {signerStep!=="complete"&&(
            <div className="sf-signer-step-track">
              {[{id:"review",label:"Review"},{id:"sign",label:"Sign"},{id:"complete",label:"Done"}].map((s,i)=>(
                <div key={s.id} className={`sf-signer-step${stepIdx>i?" done":""}${stepIdx===i?" active":""}`}>
                  <div className="sf-step-node">{stepIdx>i?"✓":i+1}</div>
                  <div className="sf-step-label">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          <div className="sf-screen-scroll">
            {signerStep==="review"&&(
              <div className="sf-screen">
                <div className="sf-sender-card">
                  <div style={{display:"flex",gap:".65rem",alignItems:"center"}}>
                    <div className="sf-sender-avatar">{user.avatar}</div>
                    <div>
                      <div style={{fontWeight:500,fontSize:".85rem"}}>{user.firstName} {user.lastName}</div>
                      <div style={{fontSize:".7rem",color:"rgba(255,255,255,.55)"}}>{user.org}</div>
                    </div>
                  </div>
                  <div className="sf-sender-msg">"Please review and sign the attached agreement at your earliest convenience."</div>
                </div>
                <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:"5px",padding:".85rem",marginBottom:".75rem"}}>
                  {[["Document",doc.name],["Pages","3"],["Signers",`${doc.signers.length} parties`]].map(([k,v])=>(
                    <div key={k} className="info-row"><span className="info-label">{k}</span><span className="info-val" style={{fontSize:".8rem"}}>{v}</span></div>
                  ))}
                </div>
                <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:"5px",padding:".85rem",marginBottom:".75rem"}}>
                  <div className="section-label">Please Confirm</div>
                  {["I have read and understand the document.","I agree to sign electronically.","I consent to email and SMS notifications."].map((text,i)=>(
                    <div key={i} className="sf-check-item">
                      <div className={`sf-checkbox${consents[i]?" checked":""}`} onClick={()=>setConsents(p=>{const a=[...p];a[i]=!a[i];return a;})}>
                        {consents[i]&&"✓"}
                      </div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <button className="sf-signer-btn sf-signer-btn-teal" disabled={!consents.every(Boolean)} onClick={()=>setSignerStep("sign")}>Proceed to Sign →</button>
              </div>
            )}
            {signerStep==="sign"&&(
              <div className="sf-screen">
                <div style={{fontSize:".82rem",color:T.muted,marginBottom:".75rem"}}>{allFieldsDone?"All fields complete — submit below.":`${doneCount} of ${requiredCount} required fields done.`}</div>
                <div className="sf-progress-bar"><div className="sf-progress-fill" style={{width:`${(doneCount/requiredCount)*100}%`}}/></div>
                <div className="sf-doc-viewer">
                  <div className="sf-doc-page-tabs">
                    {DOC_PAGES_CONTENT.map(p=>(
                      <button key={p.page} className={`sf-doc-page-tab${activePage===p.page?" active":""}`} onClick={()=>setActivePage(p.page)}>
                        Pg {p.page} {fieldValues[pageField(p.page)?.id]?"✓":""}
                      </button>
                    ))}
                  </div>
                  <div className="sf-doc-content">
                    {DOC_PAGES_CONTENT.filter(p=>p.page===activePage).map(pg=>{
                      const field=pageField(pg.page);
                      const done=field&&fieldValues[field.id];
                      return(
                        <div key={pg.page}>
                          <div className="sf-doc-page-title">{pg.title}</div>
                          <div className="sf-doc-body">{pg.body}</div>
                          {field&&(
                            <div className={`sf-field-zone${done?" done":""}`} onClick={()=>!done&&setOpenField(field)}>
                              {done&&fieldValues[field.id].dataUrl?<img src={fieldValues[field.id].dataUrl} style={{maxHeight:24,maxWidth:100,objectFit:"contain"}} alt="sig"/>:<span style={{fontSize:".9rem"}}>{done?"✓":field.type==="signature"?"✍":"Aa"}</span>}
                              <span className="sf-field-label">{done?"✓ "+field.label:field.label+" *"}</span>
                              {!done&&<span style={{fontSize:".8rem",color:T.gold}}>→</span>}
                              {done&&<button style={{marginLeft:"auto",fontSize:".62rem",background:"transparent",border:"none",color:T.green,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setFieldValues(p=>{const n={...p};delete n[field.id];return n;});}}>Redo</button>}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="sf-consent-block">By submitting, you confirm this electronic signature is legally binding and equivalent to a handwritten signature under applicable law.</div>
                <button className="sf-signer-btn sf-signer-btn-green" disabled={!allFieldsDone} onClick={onSubmit}>Submit Signature ✓</button>
                <button className="sf-signer-btn sf-signer-btn-ghost" onClick={()=>setSignerStep("review")}>← Back to Review</button>
                {openField&&(
                  <div className="sf-drawer-overlay" onClick={()=>setOpenField(null)}>
                    <div className="sf-drawer" onClick={e=>e.stopPropagation()}>
                      <div className="sf-drawer-handle"/>
                      <div className="sf-drawer-title">{openField.type==="signature"?"Add Signature":"Add Initials"}</div>
                      <div className="sf-drawer-sub">{openField.label} · Page {openField.page}</div>
                      <SigCanvas compact={openField.type==="initials"} onSave={dataUrl=>applyField(openField.id,dataUrl)}/>
                      <button className="sf-signer-btn sf-signer-btn-ghost" onClick={()=>setOpenField(null)}>Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {signerStep==="complete"&&(
              <div className="sf-success-bg">
                <div className="sf-success-ring">✍</div>
                <div className="sf-success-title">Document Signed</div>
                <div className="sf-success-sub">Your signature has been applied and securely recorded.</div>
                <div className="sf-success-doc-card">
                  <div style={{fontWeight:500,marginBottom:".5rem",fontSize:".88rem"}}>{doc.name}</div>
                  {[["Document ID",doc.id],["Signed by",user.firstName+" "+user.lastName],["Signed at",ts()],["Status","Fully executed"]].map(([k,v])=>(
                    <div key={k} className="sf-success-row"><span>{k}</span><span>{v}</span></div>
                  ))}
                </div>
                <div className="sf-cert-stamp">
                  <span style={{fontSize:"1.15rem"}}>🔏</span>
                  <div>
                    <div style={{fontWeight:600,fontSize:".78rem",marginBottom:".12rem"}}>Certificate Issued</div>
                    <div style={{fontSize:".67rem",opacity:.8,fontFamily:"monospace"}}>{hashStr(doc.id+ts()).repeat(3).slice(0,40)}...</div>
                  </div>
                </div>
                <div style={{fontSize:".73rem",color:"rgba(255,255,255,.45)",textAlign:"center",lineHeight:1.6}}>
                  A copy will be emailed to <strong style={{color:"rgba(255,255,255,.7)"}}>{user.email}</strong>
                </div>
                <button className="sf-signer-btn sf-signer-btn-teal" style={{marginTop:"1.25rem",background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.15)",borderRadius:8}} onClick={()=>showToast&&showToast("Certificate downloaded ✓")}>⬇ Download Certificate</button>
              </div>
            )}
          </div>
        </div>
        <div className="sf-phone-bar"><div className="sf-phone-bar-pill"/></div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MY SIGNATURE
// ═══════════════════════════════════════════════════════════════════════════════
function MySignature({savedSig,onSave,showToast}){
  return(
    <div className="fade-in">
      <div className="sf-page-title">My Signature</div>
      <div className="sf-page-sub">Create and save your personal signature</div>
      <div className="sf-card">
        <div className="sf-card-title">Draw Your Signature</div>
        <div className="text-muted" style={{marginBottom:"1.1rem",fontSize:".82rem"}}>Use your mouse, trackpad, or touchscreen. This signature will be applied when you sign documents.</div>
        <SigCanvas onSave={dataUrl=>{onSave(dataUrl);showToast("Signature saved ✓");}}/>
      </div>
      {savedSig&&(
        <div className="sf-card" style={{borderTop:`3px solid ${T.green}`}}>
          <div className="sf-card-title">Saved Signature</div>
          <div style={{background:T.paper,border:`1px solid ${T.border}`,padding:"1.25rem",textAlign:"center",borderRadius:"3px"}}>
            <img src={savedSig} style={{maxWidth:"100%",maxHeight:110}} alt="Your signature"/>
          </div>
          <div className="text-small" style={{marginTop:".65rem"}}>✓ Will be auto-applied when you sign documents</div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACCOUNT SETTINGS
// ═══════════════════════════════════════════════════════════════════════════════
function AccountSettings({user,onUpdateUser,onLogout,showToast}){
  const [section,setSection]=useState("profile");
  const [form,setForm]=useState({firstName:user.firstName,lastName:user.lastName,email:user.email,org:user.org||"",phone:""});
  const [pw,setPw]=useState({current:"",next:"",confirm:""});
  const [twoFA,setTwoFA]=useState(user.twoFA);
  const [notifs,setNotifs]=useState({signedEmail:true,signedSMS:false,completedEmail:true,reminders:true});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const str=pwStrength(pw.next);
  const navItems=[{id:"profile",icon:"👤",label:"Profile"},{id:"security",icon:"🔐",label:"Security"},{id:"team",icon:"👥",label:"Team"},{id:"plan",icon:"⭐",label:"Plan"},{id:"notifs",icon:"🔔",label:"Notifications"}];
  return(
    <div className="fade-in">
      <div className="sf-page-title">Account Settings</div>
      <div className="sf-page-sub">Manage your profile, security, and team</div>
      <div className="settings-layout">
        <div>
          <div className="sf-card" style={{padding:".4rem"}}>
            {navItems.map(n=>(
              <button key={n.id} className={`settings-nav-item${section===n.id?" active":""}`} onClick={()=>setSection(n.id)}>
                <span>{n.icon}</span>{n.label}
              </button>
            ))}
            <div className="divider" style={{margin:".4rem 0"}}/>
            <button className="settings-nav-item" style={{color:T.red}} onClick={onLogout}><span>🚪</span>Sign Out</button>
          </div>
        </div>
        <div>
          {section==="profile"&&(
            <div className="sf-card fade-in">
              <div className="sf-card-title">Profile Information</div>
              <div style={{display:"flex",alignItems:"center",gap:"1.1rem",marginBottom:"1.5rem"}}>
                <div style={{width:64,height:64,borderRadius:"50%",background:T.teal,color:T.goldLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.4rem",fontWeight:600,flexShrink:0}}>{user.avatar}</div>
                <div>
                  <div style={{fontWeight:600,fontSize:".95rem"}}>{user.firstName} {user.lastName}</div>
                  <div className="text-muted">{user.email}</div>
                  <div style={{display:"flex",gap:".4rem",marginTop:".3rem",flexWrap:"wrap"}}>
                    <span className="badge badge-complete">{user.role}</span>
                    <span className="badge badge-sent">{user.plan}</span>
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div><label className="sf-label">First Name</label><input className="sf-input" value={form.firstName} onChange={e=>f("firstName",e.target.value)}/></div>
                <div><label className="sf-label">Last Name</label><input className="sf-input" value={form.lastName} onChange={e=>f("lastName",e.target.value)}/></div>
              </div>
              <label className="sf-label">Email</label><input className="sf-input" type="email" value={form.email} onChange={e=>f("email",e.target.value)}/>
              <label className="sf-label">Organisation</label><input className="sf-input" value={form.org} onChange={e=>f("org",e.target.value)}/>
              <label className="sf-label">Phone (for SMS signing)</label><input className="sf-input" type="tel" placeholder="+1 902 555 0100" value={form.phone} onChange={e=>f("phone",e.target.value)}/>
              <div style={{display:"flex",justifyContent:"flex-end"}}><button className="btn btn-primary" onClick={()=>{onUpdateUser({...user,...form});showToast("Profile saved ✓");}}>Save Changes</button></div>
            </div>
          )}
          {section==="security"&&(
            <div className="fade-in">
              <div className="sf-card">
                <div className="sf-card-title">Change Password</div>
                <label className="sf-label">Current Password</label><input className="sf-input" type="password" value={pw.current} onChange={e=>setPw(p=>({...p,current:e.target.value}))}/>
                <label className="sf-label">New Password</label><input className="sf-input" type="password" value={pw.next} onChange={e=>setPw(p=>({...p,next:e.target.value}))}/>
                {pw.next&&<><div className="pw-strength-bar"><div className="pw-strength-fill" style={{width:str.pct+"%",background:str.color}}/></div><div style={{fontSize:".72rem",color:str.color,marginBottom:".85rem"}}>{str.label}</div></>}
                <label className="sf-label">Confirm New Password</label><input className="sf-input" type="password" value={pw.confirm} onChange={e=>setPw(p=>({...p,confirm:e.target.value}))}/>
                <button className="btn btn-primary" onClick={()=>{if(pw.next!==pw.confirm){showToast("Passwords don't match");return;}showToast("Password updated ✓");setPw({current:"",next:"",confirm:""});}}>Update Password</button>
              </div>
              <div className="sf-card">
                <div className="sf-card-title">Two-Factor Authentication</div>
                <div className="flex-row" style={{marginBottom:".75rem"}}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:500,marginBottom:".2rem"}}>Authenticator App</div>
                    <div className="text-muted" style={{fontSize:".8rem"}}>Require a 6-digit OTP on each sign-in.</div>
                  </div>
                  <div className={`toggle${twoFA?" on":""}`} onClick={()=>{setTwoFA(p=>!p);showToast(twoFA?"2FA disabled":"2FA enabled ✓");}}>
                    <div className="toggle-knob"/>
                  </div>
                </div>
                {twoFA&&<div style={{background:T.greenBg,borderLeft:`3px solid ${T.green}`,padding:".6rem .85rem",fontSize:".8rem",color:T.green,borderRadius:"2px"}}>✓ Two-factor authentication is active.</div>}
              </div>
            </div>
          )}
          {section==="team"&&(
            <div className="sf-card fade-in">
              <div className="sf-card-title">Team Members</div>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:".85rem"}}><button className="btn btn-primary btn-sm" onClick={()=>showToast("Invitation sent ✓")}>+ Invite Member</button></div>
              {DB.users.map(m=>(
                <div key={m.id} style={{display:"grid",gridTemplateColumns:"36px 1fr auto auto",gap:".85rem",alignItems:"center",padding:".7rem 0",borderBottom:`1px solid ${T.border}`}}>
                  <div style={{width:34,height:34,borderRadius:"50%",background:T.teal,color:T.goldLt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:".7rem",fontWeight:600}}>{m.avatar}</div>
                  <div><div style={{fontWeight:500,fontSize:".88rem"}}>{m.firstName} {m.lastName}</div><div className="text-small">{m.email}</div></div>
                  <span className="badge badge-complete">{m.role}</span>
                  {m.id!==user.id?<button className="btn btn-outline btn-sm" onClick={()=>showToast("Updated ✓")}>Edit</button>:<span className="text-small">You</span>}
                </div>
              ))}
            </div>
          )}
          {section==="plan"&&(
            <div className="sf-card fade-in">
              <div className="sf-card-title">Plans & Billing</div>
              <div className="plan-grid">
                {[{id:"starter",name:"Starter",price:"Free",features:["5 docs/month","1 user","Email delivery","Basic audit"]},{id:"professional",name:"Professional",price:"$29/mo",features:["Unlimited docs","5 users","Email + SMS","Full audit","Certificates","2FA"]},{id:"enterprise",name:"Enterprise",price:"$99/mo",features:["Unlimited everything","Unlimited users","SSO/SAML","API access","Custom branding"]}].map(p=>(
                  <div key={p.id} className={`plan-card${user.plan===p.id?" current":""}`}>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,marginBottom:".2rem"}}>{p.name}</div>
                    <div style={{fontSize:"1.5rem",fontWeight:600,marginBottom:".85rem"}}>{p.price}</div>
                    <ul style={{listStyle:"none",display:"flex",flexDirection:"column",gap:".35rem",marginBottom:"1rem"}}>
                      {p.features.map(f=><li key={f} style={{fontSize:".76rem",color:T.muted,display:"flex",gap:".35rem"}}><span style={{color:T.green}}>✓</span>{f}</li>)}
                    </ul>
                    {user.plan===p.id?<button className="btn btn-outline btn-sm" style={{width:"100%"}}>Current Plan</button>:<button className="btn btn-gold btn-sm" style={{width:"100%"}} onClick={()=>showToast(`Upgrade to ${p.name} initiated ✓`)}>Upgrade →</button>}
                  </div>
                ))}
              </div>
            </div>
          )}
          {section==="notifs"&&(
            <div className="sf-card fade-in">
              <div className="sf-card-title">Notifications</div>
              {[{id:"signedEmail",label:"Document signed — Email",desc:"Email when someone signs"},{id:"signedSMS",label:"Document signed — SMS",desc:"Text when someone signs"},{id:"completedEmail",label:"Document completed — Email",desc:"Email when all parties sign"},{id:"reminders",label:"Signing reminders",desc:"Auto-reminders to pending signers"}].map(n=>(
                <div key={n.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:".7rem 0",borderBottom:`1px solid ${T.cream}`}}>
                  <div><div style={{fontWeight:500,fontSize:".85rem"}}>{n.label}</div><div className="text-small">{n.desc}</div></div>
                  <div className={`toggle${notifs[n.id]?" on":""}`} onClick={()=>setNotifs(p=>({...p,[n.id]:!p[n.id]}))}>
                    <div className="toggle-knob"/>
                  </div>
                </div>
              ))}
              <div style={{marginTop:"1rem",display:"flex",justifyContent:"flex-end"}}><button className="btn btn-primary" onClick={()=>showToast("Preferences saved ✓")}>Save</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APP SHELL
// ═══════════════════════════════════════════════════════════════════════════════
function AppShell({token,user,onLogout,onUpdateUser}){
  const [tab,setTab]=useState("dashboard");
  const [docs,setDocs]=useState(DB.documents);
  const [selectedDoc,setSelectedDoc]=useState(null);
  const [savedSig,setSavedSig]=useState(null);
  const [dropdown,setDropdown]=useState(false);
  const [toastMsg,showToast]=useToast();

  useEffect(()=>{
    const h=e=>{if(!e.target.closest(".sf-avatar"))setDropdown(false);};
    document.addEventListener("click",h);return()=>document.removeEventListener("click",h);
  },[]);

  const handleSendDoc=useCallback(docForm=>{
    const newDoc={
      id:"DOC"+uid(),name:docForm.name||"Untitled Document",
      created:ts(),status:"in-progress",
      signers:docForm.signers.map(s=>({...s,status:s.order===1?"sent":"waiting",signedAt:null,sigDataUrl:null})),
      audit:[
        {id:1,type:"created",action:"Document created",detail:`By ${user.firstName} ${user.lastName}`,time:ts()},
        {id:2,type:"sent",action:`Sent to ${docForm.signers[0]?.name||"Signer 1"}`,detail:`Email: ${docForm.signers[0]?.email}${docForm.signers[0]?.phone?` · SMS: ${docForm.signers[0].phone}`:""}`,time:ts()},
      ],
    };
    setDocs(d=>[newDoc,...d]);
    DB.documents.unshift(newDoc);
    setTab("dashboard");
    showToast("Document sent for signature ✓");
  },[user]);

  const handleDocUpdate=useCallback(updatedDoc=>{
    setDocs(d=>d.map(doc=>doc.id===updatedDoc.id?updatedDoc:doc));
    DB.documents=DB.documents.map(d=>d.id===updatedDoc.id?updatedDoc:d);
    setSelectedDoc(updatedDoc);
  },[]);

  const viewDoc=doc=>{setSelectedDoc(doc);setTab("detail");};

  const navLinks=[
    {id:"dashboard",label:"Dashboard"},
    {id:"create",label:"New Document"},
    {id:"signer-demo",label:"Signer View"},
    {id:"signature",label:"My Signature"},
    {id:"account",label:"Account"},
  ];

  return(
    <>
      <style dangerouslySetInnerHTML={{__html:GLOBAL_CSS}}/>
      <div className="sf-app">
        <header className="sf-topbar">
          <div className="sf-logo">
            <div className="sf-logo-ring">✍</div>
            Sign<span>Flow</span>
          </div>
          <nav className="sf-nav">
            {navLinks.map(l=>(
              <button key={l.id} className={`sf-nav-btn${tab===l.id?" active":""}`} onClick={()=>{setTab(l.id);if(l.id!=="detail")setSelectedDoc(null);}}>
                {l.label}
              </button>
            ))}
          </nav>
          <div className="sf-spacer"/>
          <div className="sf-avatar" onClick={e=>{e.stopPropagation();setDropdown(d=>!d);}}>
            {user.avatar}
            {dropdown&&(
              <div className="sf-dropdown" onClick={e=>e.stopPropagation()}>
                <div className="sf-dd-user">
                  <div className="sf-dd-name">{user.firstName} {user.lastName}</div>
                  <div className="sf-dd-email">{user.email}</div>
                  <div className="sf-dd-plan">{user.plan}</div>
                </div>
                {[["👤","Account Settings","account"],["🔐","Security","account"],["⭐","Upgrade Plan","plan"]].map(([icon,label,target])=>(
                  <button key={label} className="sf-dd-item" onClick={()=>{setTab(target==="plan"?"account":"account");setDropdown(false);}}>
                    <span>{icon}</span>{label}
                  </button>
                ))}
                <div className="sf-dd-divider"/>
                <button className="sf-dd-item danger" onClick={onLogout}><span>🚪</span>Sign Out</button>
              </div>
            )}
          </div>
        </header>
        <main className="sf-main">
          {tab==="dashboard"&&<Dashboard user={user} docs={docs} onViewDoc={viewDoc} onNewDoc={()=>setTab("create")} savedSig={savedSig}/>}
          {tab==="create"&&<CreateDoc user={user} onSend={handleSendDoc} onCancel={()=>setTab("dashboard")}/>}
          {tab==="detail"&&selectedDoc&&<DocDetail doc={selectedDoc} user={user} onBack={()=>setTab("dashboard")} onDocUpdate={handleDocUpdate} showToast={showToast} savedSig={savedSig}/>}
          {tab==="signer-demo"&&(
            <div className="fade-in">
              <div className="sf-page-title">Signer Experience</div>
              <div className="sf-page-sub">This is the mobile signing page your recipients see</div>
              <SignerFacingPage
                doc={docs[0]||{id:"DEMO",name:"Demo Agreement",signers:[{name:"You",email:user.email,order:1}],audit:[]}}
                user={user}
                fieldValues={{}} setFieldValues={()=>{}}
                openField={null} setOpenField={()=>{}}
                consents={[false,false,false]} setConsents={()=>{}}
                allFieldsDone={false} doneCount={0} requiredCount={3}
                signerStep="review" setSignerStep={()=>{}}
                onSubmit={()=>showToast("Signature submitted ✓")}
                activePage={1} setActivePage={()=>{}}
                fields={[{id:"f1",page:1,type:"signature",label:"Authorized Signature",required:true},{id:"f2",page:2,type:"initials",label:"Initials",required:true},{id:"f3",page:3,type:"date",label:"Date",required:true}]}
              />
            </div>
          )}
          {tab==="signature"&&<MySignature savedSig={savedSig} onSave={setSavedSig} showToast={showToast}/>}
          {tab==="account"&&<AccountSettings user={user} onUpdateUser={onUpdateUser} onLogout={onLogout} showToast={showToast}/>}
        </main>
      </div>
      <Toast msg={toastMsg}/>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT
// ═══════════════════════════════════════════════════════════════════════════════
export default function SignFlowComplete(){
  const [session,setSession]=useState(null);
  const [currentUser,setCurrentUser]=useState(null);

  const handleAuth=(tok,user)=>{setSession({tok});setCurrentUser(user);};
  const handleLogout=()=>{if(session)delete DB.sessions[session.tok];setSession(null);setCurrentUser(null);};
  const handleUpdateUser=updated=>{const idx=DB.users.findIndex(u=>u.id===updated.id);if(idx>=0)DB.users[idx]=updated;setCurrentUser(updated);};

  if(!session||!currentUser){
    return(
      <>
        <style dangerouslySetInnerHTML={{__html:GLOBAL_CSS}}/>
        <AuthScreen onAuth={handleAuth}/>
      </>
    );
  }
  return <AppShell token={session.tok} user={currentUser} onLogout={handleLogout} onUpdateUser={handleUpdateUser}/>;
}
