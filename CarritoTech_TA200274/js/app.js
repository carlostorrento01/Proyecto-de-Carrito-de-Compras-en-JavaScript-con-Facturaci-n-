(function(){
'use strict';

/* -------------------- Catálogo -------------------- */
const PRODUCTS=[
  { id:"k1",  name:"Teclado Mecánico RGB 60%",  price:49.99, stock:18, catKey:"perifericos",   desc:"Switches Blue, RGB" },
  { id:"k2",  name:"Teclado Mecánico Full-size",price:69.99, stock:12, catKey:"perifericos",   desc:"Layout completo" },
  { id:"m1",  name:"Mouse Inalámbrico",         price:19.50, stock:25, catKey:"perifericos",   desc:"1600 DPI" },
  { id:"m2",  name:"Mouse Gamer 6 botones",     price:29.00, stock:20, catKey:"perifericos",   desc:"7200 DPI, RGB" },
  { id:"mp1", name:"Mouse Pad XL",               price:14.00, stock:30, catKey:"perifericos",   desc:"900×400 mm" },
  { id:"a1",  name:"Audífonos Over‑Ear",        price:29.90, stock:18, catKey:"audio",         desc:"Graves profundos" },
  { id:"a2",  name:"Headset Gaming",            price:39.50, stock:14, catKey:"audio",         desc:"Micrófono flexible" },
  { id:"a3",  name:"Parlantes 2.0 USB",         price:22.00, stock:22, catKey:"audio",         desc:"Compactos" },
  { id:"s1",  name:"Webcam 1080p",              price:24.99, stock:10, catKey:"streaming",     desc:"Full HD" },
  { id:"s2",  name:"Micrófono USB",             price:34.75, stock: 8, catKey:"streaming",     desc:"Cardioide" },
  { id:"s3",  name:"Luz Ring LED 12\"",         price:27.00, stock:16, catKey:"streaming",     desc:"Con trípode" },
  { id:"st1", name:"SSD NVMe 1TB",              price:89.00, stock:15, catKey:"almacenamiento",desc:"3500/3000 MB/s" },
  { id:"st2", name:"SSD SATA 480GB",            price:39.00, stock:20, catKey:"almacenamiento",desc:"Upgrade fácil" },
  { id:"st3", name:"HDD 2TB 3.5\"",             price:59.00, stock: 9, catKey:"almacenamiento",desc:"Para backups" },
  { id:"r1",  name:"Router WiFi 6 AX1800",      price:74.00, stock:11, catKey:"redes",         desc:"Cobertura amplia" },
  { id:"r2",  name:"Adaptador USB WiFi AC600",  price:18.00, stock:28, catKey:"redes",         desc:"Dual band" },
  { id:"mo1", name:"Monitor 24\" 144Hz",        price:159.0, stock: 7, catKey:"monitores",     desc:"IPS, gaming" },
  { id:"mo2", name:"Monitor 27\" IPS",          price:189.0, stock: 6, catKey:"monitores",     desc:"2K, biseles finos" },
  { id:"x1",  name:"USB‑C Hub 6‑en‑1",          price:27.40, stock:20, catKey:"accesorios",    desc:"HDMI + USB + SD" },
  { id:"x2",  name:"Cable HDMI 2.1 2m",         price:12.50, stock:40, catKey:"accesorios",    desc:"4K/120Hz" }
];

const CATS=[
  { key:'todos',          label:'Todos',           icon:'🛍️' },
  { key:'perifericos',    label:'Periféricos',     icon:'⌨️' },
  { key:'audio',          label:'Audio',           icon:'🎧' },
  { key:'streaming',      label:'Streaming',       icon:'📷' },
  { key:'almacenamiento', label:'Almacenamiento',  icon:'💾' },
  { key:'redes',          label:'Redes',           icon:'📡' },
  { key:'monitores',      label:'Monitores',       icon:'🖥️' },
  { key:'accesorios',     label:'Accesorios',      icon:'🔌' }
];

/* -------------------- Storage y utilidades -------------------- */
const KEY_INVENTORY="zt_v11_inventory";
const KEY_CART="zt_v11_cart";
const KEY_INVOICES="zt_v11_invoices";
const MAX_INVOICES = 50;

const Storage={
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  get:(k,f)=>{ try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch(e){return f} },
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v))}catch(e){} },
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  remove:(k)=>{ try{localStorage.removeItem(k)}catch(e){} }
};

const money=n=>`$${n.toFixed(2)}`; const two=n=>n.toFixed(2);
/**
 * ensureInventory()
 * Funcionalidad auxiliar del flujo del carrito.
 * Retorna: valor calculado.
 * Manipula DOM: No
 */

function ensureInventory(){
  let inv=Storage.get(KEY_INVENTORY,null);
  const ok=Array.isArray(inv)&&inv.length>0&&inv.every(p=>p&&p.id&&p.name);
  if(!ok){ inv=structuredClone(PRODUCTS); Storage.set(KEY_INVENTORY,inv); }
  return inv;
}
/**
 * byId(inv)
 * Devuelve un nodo del DOM por su `id` (atajo de `document.getElementById`).
 * Parámetros:
 * - `inv`: parámetro de la función.
 * Retorna: valor calculado.
 * Manipula DOM: No
 */

function byId(inv){ return Object.fromEntries(inv.map(p=>[p.id,p])); }
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
/**
 * toast(msg,ms=2000)
 * Muestra un mensaje flotante/temporal en la interfaz.
 * Parámetros:
 * - `msg`: parámetro de la función.
 * - `ms=2000`: parámetro de la función.
 * Retorna: void.
 * Manipula DOM: Sí
 * Nodos: ids: toast
 */

function toast(msg,ms=2000){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),ms); }
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
/**
 * el(t,a={},c=[])
 * Devuelve el primer nodo que coincide con un selector (atajo de `document.querySelector`).
 * Parámetros:
 * - `t`: cadena HTML.
 * - `a={}`: parámetro de la función.
 * - `c=[]`: parámetro de la función.
 * Retorna: valor calculado.
 * Manipula DOM: Sí
 */


function el(t,a={},c=[]){ const n=document.createElement(t); for(const [k,v] of Object.entries(a)){ if(k==='class')n.className=v; else if(k==='text')n.textContent=v; else if(k.startsWith('on')&&typeof v==='function')n.addEventListener(k.slice(2),v); else n.setAttribute(k,v); } [].concat(c).forEach(ch=>n.append(ch instanceof Node?ch:document.createTextNode(ch))); return n; }

/* -------------------- Carrito -------------------- */
/**
 * Cart()
 * Modelo de carrito: administra ítems, totales, agregar/actualizar/remover y serialización.
 * Retorna: valor calculado.
 * Manipula DOM: No
 */
class Cart{
  constructor(taxRate=0.13){
    this.taxRate=taxRate; this.items=new Map();
    const s=Storage.get(KEY_CART,null);
    if(s?.items){ for(const it of s.items)this.items.set(it.id,it); this.taxRate=s.taxRate??taxRate; }
  }
  setTaxRate(r){ this.taxRate=Number(r)||0; this.save(); }
  add(p,q){ q=Math.max(1,Math.floor(q)); const e=this.items.get(p.id); const n=(e?.qty??0)+q; this.items.set(p.id,{id:p.id,name:p.name,price:Number(p.price),qty:n,catKey:p.catKey}); this.save(); }
  update(id,q){ q=Math.max(0,Math.floor(q)); if(q===0)this.items.delete(id); else{ const it=this.items.get(id)??{id,price:0,name:''}; it.qty=q; this.items.set(id,it);} this.save(); }
  remove(id){ this.items.delete(id); this.save(); }
  clear(){ this.items.clear(); this.save(); }
  toArray(){ return Array.from(this.items.values()); }
  subtotal(){ return this.toArray().reduce((a,it)=>a+it.price*it.qty,0); }
  total(){ return this.subtotal()*(1+this.taxRate); }
  save(){ Storage.set(KEY_CART,{items:this.toArray(),taxRate:this.taxRate}); }
}

/* -------------------- Facturación -------------------- */
/**
 * genId()
 * Genera un identificador único para ventas/facturas.
 * Retorna: string (HTML).
 * Manipula DOM: No
 */

function genId(){ const d=new Date(); const r=Math.floor(Math.random()*9999).toString().padStart(4,'0'); return `FAC-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${r}`; }
/**
 * createInvoice(items,subtotal,taxRate)
 * Genera una factura/venta a partir del carrito (totales, id de venta, fecha/hora).
 * Parámetros:
 * - `items`: lista de elementos.
 * - `subtotal`: parámetro de la función.
 * - `taxRate`: parámetro de la función.
 * Retorna: valor calculado.
 * Manipula DOM: No
 */

function createInvoice(items,subtotal,taxRate){
  const inv={ id:genId(), date:new Date().toISOString(),
    items:items.map(it=>({id:it.id,name:it.name,qty:it.qty,price:it.price,total:it.price*it.qty})),
    subtotal, taxRate, taxAmount: subtotal*taxRate, grandTotal: subtotal*(1+taxRate) };
  const all=Storage.get(KEY_INVOICES,[]);
  all.unshift(inv);
  if(all.length>MAX_INVOICES) all.length=MAX_INVOICES;
  Storage.set(KEY_INVOICES,all);
  return inv;
}
/**
 * invoiceHTML(inv,{preview=false}={})
 * Construye y devuelve un fragmento HTML (como cadena) para la interfaz.
 * Parámetros:
 * - `inv`: parámetro de la función.
 * - `{preview=false}={}`: parámetro de la función.
 * Retorna: string (HTML).
 * Manipula DOM: No
 */

function invoiceHTML(inv,{preview=false}={}){
  const date=new Date(inv.date).toLocaleString();
  const rows=inv.items.map(x=>`<tr><td>${x.name}</td><td>${x.qty}</td><td>$${two(x.price)}</td><td>$${two(x.total)}</td></tr>`).join('');
  return `<section class="invoice__meta"><p><strong>No.:</strong> ${preview?'BORRADOR':inv.id}</p><p><strong>Fecha:</strong> ${date}</p></section>
  <section class="invoice__body">
    <table>
      <thead><tr><th>Producto</th><th>Cant.</th><th>Precio Unit.</th><th>Total</th></tr></thead>
      <tbody>${rows}</tbody>
      <tfoot>
        <tr><td colspan="3" style="text-align:right">Subtotal:</td><td>$${two(inv.subtotal)}</td></tr>
        <tr><td colspan="3" style="text-align:right">Impuesto (${two(inv.taxRate*100)}%):</td><td>$${two(inv.taxAmount)}</td></tr>
        <tr><td colspan="3" style="text-align:right"><strong>Total a pagar:</strong></td><td><strong>$${two(inv.grandTotal)}</strong></td></tr>
      </tfoot>
    </table>
  </section>`;
}

/* -------------------- Historial UI -------------------- */
/**
 * historyTable(invoices)
 * Construye y devuelve un fragmento HTML (como cadena) para la interfaz.
 * Parámetros:
 * - `invoices`: parámetro de la función.
 * Retorna: valor calculado.
 * Manipula DOM: Sí
 * Nodos: selectores: tbody
 */

function historyTable(invoices){
  const table=el('table',{},[
    el('thead',{},[ el('tr',{},[ el('th',{text:'No.'}), el('th',{text:'Fecha'}), el('th',{text:'Items'}), el('th',{text:'Subtotal'}), el('th',{text:'Impuesto'}), el('th',{text:'Total'}), el('th',{}) ]) ]),
    el('tbody')
  ]);
  const tb=table.querySelector('tbody');
  invoices.forEach((inv,idx)=>{
    const date=new Date(inv.date).toLocaleString();
    const tr=el('tr',{},[
      el('td',{text:inv.id}),
      el('td',{text:date}),
      el('td',{text:String(inv.items.reduce((a,x)=>a+x.qty,0))}),
      el('td',{text:money(inv.subtotal)}),
      el('td',{text:money(inv.taxAmount)}),
      el('td',{text:money(inv.grandTotal)}),
      el('td',{},[
        (()=>{const b=el('button',{class:'btn primary btn-view',text:'Ver'}); b.dataset.idx=String(idx); return b;})(),
        document.createTextNode(' '),
        (()=>{const b=el('button',{class:'btn btn-print',text:'Imprimir'}); b.dataset.idx=String(idx); return b;})()
      ])
    ]);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    tb.append(tr);
  });
  return table;
}

/* -------------------- App -------------------- */
let selectedCat='todos';
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
document.addEventListener('DOMContentLoaded',()=>{
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const productGridEl=document.getElementById('product-grid');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const cartListEl=document.getElementById('cart-list');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const totalsEl=document.getElementById('totals');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const taxSelectEl=document.getElementById('tax-select');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const btnCheckout=document.getElementById('btn-checkout');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const btnClear=document.getElementById('btn-clear');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const cartHint=document.getElementById('cart-hint');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const lastSaleEl=document.getElementById('last-sale');

//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const modal=document.getElementById('invoice-modal');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const invoiceContent=document.getElementById('invoice-content');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const closeInvoiceBtn=document.getElementById('close-invoice');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const btnContinue=document.getElementById('btn-continue');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const btnPrint=document.getElementById('btn-print');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const btnFinalize=document.getElementById('btn-finalize');

//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const historyModal=document.getElementById('history-modal');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const historyContent=document.getElementById('history-content');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const closeHistoryBtn=document.getElementById('close-history');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const btnHistory=document.getElementById('btn-history');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const btnClearHistory=document.getElementById('btn-clear-history');

//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const btnReset=document.getElementById('btn-reset');

  let inventory=ensureInventory();
  let invById=byId(inventory);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  const cart=new Cart(Number(taxSelectEl.value));
/**
 * warnNoStock(av)
 * Muestra una advertencia cuando la cantidad solicitada supera el stock.
 * Parámetros:
 * - `av`: parámetro de la función.
 * Retorna: void.
 * Manipula DOM: No
 */

  

  function warnNoStock(av){ toast(`No hay suficiente inventario. Disponible: ${av}.`); }
/**
 * onAddOne(p)
 * Manejador de evento: añade una unidad del producto al carrito.
 * Parámetros:
 * - `p`: objeto de producto.
 * Retorna: void.
 * Manipula DOM: No
 */

  

  function onAddOne(p){
    const current=cart.toArray().find(it=>it.id===p.id)?.qty??0;
    const available=invById[p.id]?.stock??0;
    if(current>=available){ warnNoStock(available); return; }
    cart.add(p,1); toast(`+1 ${p.name}`); fullRender();
  }
/**
 * onSetQty(p,qty)
 * Manejador de evento: establece la cantidad de un producto (agrega o actualiza en el carrito).
 * Parámetros:
 * - `p`: objeto de producto.
 * - `qty`: cantidad solicitada.
 * Retorna: void.
 * Manipula DOM: No
 */
  
  function onSetQty(p,qty){
    const available=invById[p.id]?.stock??0;
    let q=Math.max(0,Math.floor(qty)||0);
    if(q>available){ q=available; warnNoStock(available); }
    if(q===0) cart.remove(p.id);
    else{
      const current=cart.toArray().find(it=>it.id===p.id)?.qty??0;
      if(q>current) cart.add(p,q-current); else cart.update(p.id,q);
    }
    fullRender();
  }
/**
 * onUpdateQty(id,qty)
 * Manejador de evento: normaliza y actualiza la cantidad de un ítem según stock disponible.
 * Parámetros:
 * - `id`: id del producto.
 * - `qty`: cantidad solicitada.
 * Retorna: void.
 * Manipula DOM: No
 */
  
  function onUpdateQty(id,qty){
    const available=invById[id]?.stock??0;
    let q=Math.max(1,Math.floor(qty)||1);
    if(q>available){ q=available; warnNoStock(available); }
    cart.update(id,q); fullRender();
  }
/**
 * onRemoveFromCart(id)
 * Manejador de evento: elimina un ítem del carrito y refresca la vista.
 * Parámetros:
 * - `id`: id del producto.
 * Retorna: void.
 * Manipula DOM: No
 */
  
  function onRemoveFromCart(id){ cart.remove(id); fullRender(); }
/**
 * clearCart()
 * Vacía el carrito y sincroniza la interfaz.
 * Retorna: void.
 * Manipula DOM: No
 */
  
  function clearCart(){ cart.clear(); fullRender(); }
/**
 * checkBeforeCheckout()
 * Funcionalidad auxiliar del flujo del carrito.
 * Retorna: valor calculado.
 * Manipula DOM: No
 */

  

  function checkBeforeCheckout(){
    const issues=[];
    for(const it of cart.toArray()){
      const av=invById[it.id]?.stock??0;
      if(it.qty>av) issues.push(`${it.name}: ${it.qty} > ${av}`);
    }
    if(issues.length){ toast('Revisa cantidades: '+issues.join(' | ')); return false; }
    return true;
  }
/**
 * openInvoice(inv,preview=false,printAfter=false)
 * Abre o previsualiza la factura en un panel/modal.
 * Parámetros:
 * - `inv`: parámetro de la función.
 * - `preview=false`: parámetro de la función.
 * - `printAfter=false`: parámetro de la función.
 * Retorna: void.
 * Manipula DOM: Sí
 */

  

  function openInvoice(inv,preview=false,printAfter=false){
// 🧩 DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    invoiceContent.innerHTML = invoiceHTML(inv,{preview});
    modal.showModal();
    if(printAfter){
      setTimeout(()=>window.print(), 200);
    }
  }
/**

 * previewInvoice()
 * Abre o previsualiza la factura en un panel/modal.
 * Retorna: void.
 * Manipula DOM: No
 */

  

  function previewInvoice(){
    const items=cart.toArray();
    if(items.length===0){ toast('Tu carrito está vacío.'); return; }
    const inv={ id:'BORRADOR', date:new Date().toISOString(),
      items: items.map(it=>({id:it.id,name:it.name,qty:it.qty,price:it.price,total:it.price*it.qty})),
      subtotal: cart.subtotal(), taxRate: cart.taxRate, taxAmount: cart.subtotal()*cart.taxRate, grandTotal: cart.total() };
    openInvoice(inv,true,false);
  }
/**
 * finalizePurchase()
 * Finaliza la compra: persiste la venta en historial, limpia carrito y refresca la UI.
 * Retorna: void.
 * Manipula DOM: No

 */

  

  function finalizePurchase(){
    if(!checkBeforeCheckout()) return;
    const items=cart.toArray(); if(items.length===0){ toast('Tu carrito está vacío.'); return; }
    const subtotal=cart.subtotal(), taxRate=cart.taxRate;
    const inv=createInvoice(items,subtotal,taxRate);
    for(const it of items){ const p=invById[it.id]; if(p) p.stock=Math.max(0,p.stock-it.qty); }
    Storage.set(KEY_INVENTORY,inventory); invById=byId(inventory);
    cart.clear(); fullRender();
    toast(`Compra realizada: ${money(inv.grandTotal)}`);
    // Mostrar la factura final inmediatamente (y permitir imprimir)
    openInvoice(inv,false,false);
  }
/**
 * renderChips()
 * Renderiza una parte de la interfaz del carrito.
 * Retorna: void.
 * Manipula DOM: Sí
 * Nodos: ids: category-chips; selectores: .chip
 * Eventos: click
 */

  

  function renderChips(){
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    const wrap=document.getElementById('category-chips'); wrap.innerHTML='';
    CATS.forEach(c=>{
      const b=el('button',{class:'chip',type:'button'});
      b.dataset.key=c.key; b.setAttribute('aria-pressed', String(c.key===selectedCat));
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      b.innerHTML=`${c.icon} ${c.label}`;
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      b.addEventListener('click',()=>{
        selectedCat=c.key;
        wrap.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed', String(x.dataset.key===selectedCat)));
        renderGrid();
      });
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      wrap.append(b);
    });
  }
/**
 * renderGrid()
 * Pinta la grilla de productos en la interfaz con botones/controles de compra.
 * Retorna: void.
 * Manipula DOM: Sí
 * Nodos: ids: product-grid
 */

  

  function renderGrid(){
    let list=(selectedCat==='todos')?inventory:inventory.filter(p=>p.catKey===selectedCat);
    if(!Array.isArray(list)||list.length===0){ list=inventory; }
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    const productGridEl=document.getElementById('product-grid');
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    productGridEl.innerHTML='';
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    productGridEl.append(renderProductGrid(list));
  }
/**

 * renderProductGrid(list)
 * Pinta la grilla de productos en la interfaz con botones/controles de compra.
 * Parámetros:
 * - `list`: lista de elementos.
 * Retorna: valor calculado.
 * Manipula DOM: Sí
 * Nodos: createElement: div
 * Eventos: click, input
 */

  

  function renderProductGrid(list){
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    const grid=document.createElement('div'); grid.className='products';
    list.forEach(p=>{
      const stock=invById[p.id]?.stock??0;
      const inCartQty = cart.toArray().find(it=>it.id===p.id)?.qty ?? 0;
      const qty=el('input',{type:'number',min:'0',max:String(stock),value:String(inCartQty),'aria-label':`Cantidad de ${p.name}`});
      const bMinus=el('button',{text:'−'}), bPlus=el('button',{text:'+'});
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      bMinus.addEventListener('click',()=>{const q=Math.max(0,Math.floor(qty.value)-1);qty.value=String(q);onSetQty(p,q)});
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      bPlus.addEventListener('click',()=>{let q=Math.floor(qty.value)+1;if(q>stock){q=stock;warnNoStock(stock)}qty.value=String(q);onSetQty(p,q)});
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      qty.addEventListener('input',()=>{let q=Math.floor(Number(qty.value)||0);if(q>stock){q=stock;warnNoStock(stock)}if(q<0)q=0;qty.value=String(q);onSetQty(p,q)});
// DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      const btnAdd=el('button',{class:'btn primary',text:'Agregar'}); btnAdd.disabled=stock<=0; btnAdd.addEventListener('click',()=>onAddOne(p));
      const card=el('article',{class:'pcard'},[
        el('div',{class:'pcard__top'},[ el('div',{class:'pimg'},['🛍️']),
          el('div',{},[ el('div',{class:'pname',text:p.name}), el('div',{class:'pdesc',text:p.desc||''}),
                        el('div',{class:'price'},[ money(p.price),' ', stock>0? el('span',{class:'badge',text:`${stock} disp.`}) : el('span',{class:'badge out',text:'Agotado'}) ]) ]) ]),
        el('div',{class:'pcard__qty'},[ el('div',{class:'stepper'},[bMinus,qty,bPlus]), btnAdd ])
      ]);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      grid.append(card);
    });
    return grid;
  }
/**

 * renderCartTable(items)
 * Pinta la tabla del carrito (ítems, cantidades, subtotal) en la interfaz.
 * Parámetros:
 * - `items`: lista de elementos.
 * Retorna: valor calculado.
 * Manipula DOM: Sí
 * Nodos: selectores: tbody
 * Eventos: change, click, input
 */

  

  function renderCartTable(items){
    const table=el('table',{},[ el('thead',{},[ el('tr',{},[ el('th',{text:'Producto'}), el('th',{text:'Cant.'}), el('th',{text:'Precio Unit.'}), el('th',{text:'Total'}), el('th',{}) ]) ]), el('tbody') ]);
    const tb=table.querySelector('tbody');
    items.forEach(it=>{
      const max=invById[it.id]?.stock??it.qty;
      const input=el('input',{type:'number',min:'1',max:String(max),value:String(it.qty)});
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
/**

 * onAny()
 * Delegación de eventos: captura eventos de la interfaz y los redirige al manejador adecuado.
 * Retorna: void.
 * Manipula DOM: Sí
 */
      
      const onAny=()=>{let q=Math.max(1,Math.floor(Number(input.value)||1)); if(q>max){q=max; toast('Ajustado al inventario');} input.value=String(q); onUpdateQty(it.id,q);};
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      input.addEventListener('input',onAny); input.addEventListener('change',onAny);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      const btnDel=el('button',{class:'btn danger',text:'Eliminar'}); btnDel.addEventListener('click',()=>onRemoveFromCart(it.id));
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      tb.append(el('tr',{},[ el('td',{},[it.name]), el('td',{},[input]), el('td',{},[money(it.price)]), el('td',{},[money(it.price*it.qty)]), el('td',{},[btnDel]) ]));
    });
    return table;
  }
/**

 * totalsBlock(subtotal,taxRate)
 * Calcula y pinta el bloque de totales (subtotal/IVA/total) en la interfaz.
 * Parámetros:
 * - `subtotal`: parámetro de la función.
 * - `taxRate`: parámetro de la función.
 * Retorna: valor calculado.
 * Manipula DOM: No
 */

  

  function totalsBlock(subtotal,taxRate){
    const taxes=subtotal*taxRate, total=subtotal+taxes;
    return el('div',{},[ el('p',{text:`Subtotal: ${money(subtotal)}`}), el('p',{text:`Impuesto (${(taxRate*100).toFixed(0)}%): ${money(taxes)}`}), el('p',{},[document.createTextNode('Total: '), el('strong',{text:money(total)})]) ]);
  }
/**

 * renderLastSale()
 * Renderiza una parte de la interfaz del carrito.
 * Retorna: void.
 * Manipula DOM: Sí
 */

  

  function renderLastSale(){
    const last=(Storage.get(KEY_INVOICES,[]))[0]||null;
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    lastSaleEl.textContent = last ? `Última compra: ${last.id} — Total: ${money(last.grandTotal)}` : '';
  }
/**

 * updateMiniCart()
 * Actualiza la vista del mini-carrito (contador/resumen).
 * Retorna: void.
 * Manipula DOM: Sí
 * Nodos: ids: mini-cart
 */

  

  function updateMiniCart(){
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    const mini=document.getElementById('mini-cart');
    const items=cart.toArray();
    const count=items.reduce((a,it)=>a+it.qty,0);
    const total=items.reduce((a,it)=>a+it.qty*it.price,0);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    mini.textContent=`Carrito (${count}) — ${money(total)}`;
  }
/**

 * openHistory()
 * Abre la vista de historial y la renderiza.
 * Retorna: void.
 * Manipula DOM: Sí
 * Nodos: selectores: .btn-print, .btn-view
 * Eventos: click
 */

  

  function openHistory(){
    const invoices = Storage.get(KEY_INVOICES,[]);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    historyContent.innerHTML = '';
    if(!invoices.length){
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      historyContent.innerHTML = '<p class="muted">Aún no hay facturas guardadas.</p>';
    }else{
      const table = historyTable(invoices);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      historyContent.append(table);
      // Bind view / print buttons with correct scope
      historyContent.querySelectorAll('.btn-view').forEach(btn => {
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.idx)||0;
          const inv = invoices[idx];
          if(inv){ openInvoice(inv,false,false); }
        });
      });
      historyContent.querySelectorAll('.btn-print').forEach(btn => {
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.idx)||0;
          const inv = invoices[idx];
          if(inv){ openInvoice(inv,false,true); }
        });
      });
    }
    historyModal.showModal();
  }
/**

 * fullRender()
 * Renderizado completo: vuelve a pintar grilla, carrito, totales y mini-carrito.
 * Retorna: void.
 * Manipula DOM: Sí
 */

  

  function fullRender(){
    renderChips();
    renderGrid();
    const items=cart.toArray();
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    cartListEl.innerHTML='';
    if(items.length===0){
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      cartListEl.innerHTML='<p class="muted">Tu carrito está vacío.</p>';
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      totalsEl.innerHTML=''; btnCheckout.disabled=true; cartHint.style.display='block';
    }else{
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      cartListEl.append(renderCartTable(items));
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      totalsEl.innerHTML=''; totalsEl.append(totalsBlock(cart.subtotal(),cart.taxRate));
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
      btnCheckout.disabled=false; cartHint.style.display='none';
    }
    renderLastSale(); updateMiniCart();
  }

  /* Eventos */
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  taxSelectEl.addEventListener('change',e=>{ cart.setTaxRate(Number(e.target.value)||0); fullRender(); });
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  btnCheckout.addEventListener('click',previewInvoice);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  btnClear.addEventListener('click',clearCart);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  closeInvoiceBtn.addEventListener('click',()=>modal.close());
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  btnContinue.addEventListener('click',()=>modal.close());
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  btnPrint.addEventListener('click',()=>window.print());
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  btnFinalize.addEventListener('click',finalizePurchase);

//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  btnHistory.addEventListener('click',openHistory);
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  closeHistoryBtn.addEventListener('click',()=>historyModal.close());
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  btnClearHistory.addEventListener('click',()=>{
    if(confirm('¿Borrar todas las facturas guardadas?')){
      Storage.remove(KEY_INVOICES);
      toast('Historial borrado.');
    }
  });

//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  btnReset.addEventListener('click',()=>{
    if(confirm('¿Restablecer inventario y carrito?')){
      Storage.remove(KEY_INVENTORY); Storage.remove(KEY_CART);
      inventory=ensureInventory(); invById=byId(inventory); cart.clear(); selectedCat='todos'; fullRender();
    }
  });

  // ?reset para limpiar inventario/carrito
  const url=new URL(window.location.href);
  if(url.searchParams.has('reset') || window.location.hash.includes('reset')){
    Storage.remove(KEY_INVENTORY); Storage.remove(KEY_CART);
    inventory=ensureInventory(); invById=byId(inventory);
  }

  fullRender();
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
  document.getElementById('mini-cart').addEventListener('click',()=>{
//  DOM: Esta línea interactúa con el DOM (lectura/actualización/escucha).
    document.getElementById('cart-panel').scrollIntoView({behavior:'smooth',block:'start'});
  });
});
})();