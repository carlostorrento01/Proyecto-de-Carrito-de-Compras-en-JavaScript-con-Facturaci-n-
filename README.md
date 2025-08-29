# Carrito – Carrito de Compras con Facturación

Proyecto web en **JavaScript** que implementa un carrito de compras con funcionalidades de facturación e historial. Este README está orientado para publicar en GitHub y describe todas las funcionalidades, con énfasis en **dónde se manipula el DOM**.

##  Ejecución rápida

1. Clona el repositorio.
2. Abre `Carrito/index.html` en tu navegador (doble clic) o sirve la carpeta con un servidor estático.

## ✅ Funcionalidades principales

- Carrito de compras dinámico
- Cálculo de impuestos/IVA
- Exportación a PDF
- Facturación/Generación de factura
- Gestión de productos (listado/stock/precio)
- Historial de compras/ventas
- Impresión de factura/ticket
- Persistencia con localStorage

## 🗂️ Estructura del proyecto

```
./
  Carrito/
    index.html
    Carrito/css/
      fullwidth-patch.css
      styles.css
    Carrito/js/
      app.js
```
## 🧩 ¿Dónde se manipula el DOM?

**Carrito/js/app.js**:
- L46: `get:(k,f)=>{ try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch(e){return f} },`
- L47: `set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v))}catch(e){} },`
- L48: `remove:(k)=>{ try{localStorage.removeItem(k)}catch(e){} }`
- L59: `function toast(msg,ms=2000){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('sho…`
- L60: `function el(t,a={},c=[]){ const n=document.createElement(t); for(const [k,v] of Object.entries(a)){ if(k==='cl…`
- L131: `tb.append(tr);`
- L138: `document.addEventListener('DOMContentLoaded',()=>{`
- L139: `const productGridEl=document.getElementById('product-grid');`
- L140: `const cartListEl=document.getElementById('cart-list');`
- L141: `const totalsEl=document.getElementById('totals');`
- ... (+63 referencias adicionales a manipulación del DOM)

## 🔧 Catálogo de funciones/métodos (comentado)
**Carrito/js/app.js**
- `ensureInventory()` – **Descripción**: Valida precondiciones o inventario.. **DOM**: No.
- `byId()` – **Descripción**: Helper para seleccionar nodos del DOM.. **DOM**: No.
- `toast()` – **Descripción**: Muestra notificación en la UI.. **DOM**: Sí.
- `el()` – **Descripción**: Helper para seleccionar nodos del DOM.. **DOM**: No.
- `Cart()` – **Descripción**: Clase del carrito (items, totales y operaciones).. **DOM**: No.
- `genId()` – **Descripción**: Genera ID único.. **DOM**: No.
- `createInvoice()` – **Descripción**: Crea entidad o recurso (p. ej., factura).. **DOM**: No.
- `invoiceHTML()` – **Descripción**: Genera contenido/HTML de factura.. **DOM**: No.
- `historyTable()` – **Descripción**: Construye tabla o vista de historial.. **DOM**: Sí.
- `warnNoStock()` – **Descripción**: Función del flujo de carrito.. **DOM**: No.
- `onAddOne()` – **Descripción**: Manejador de evento de la interfaz.. **DOM**: No.
- `onSetQty()` – **Descripción**: Manejador de evento de la interfaz.. **DOM**: No.
- `onUpdateQty()` – **Descripción**: Manejador de evento de la interfaz.. **DOM**: No.
- `onRemoveFromCart()` – **Descripción**: Manejador de evento de la interfaz.. **DOM**: No.
- `clearCart()` – **Descripción**: Vacía o limpia el carrito.. **DOM**: No.
- `checkBeforeCheckout()` – **Descripción**: Valida precondiciones o inventario.. **DOM**: No.
- `openInvoice()` – **Descripción**: Abre modal/vista de la app.. **DOM**: Sí.
- `previewInvoice()` – **Descripción**: Previsualiza factura/resultado.. **DOM**: No.
- `finalizePurchase()` – **Descripción**: Finaliza compra y limpia estado.. **DOM**: No.
- `renderChips()` – **Descripción**: Renderiza `Chips` en el DOM.. **DOM**: Sí.
- `renderGrid()` – **Descripción**: Renderiza `Grid` en el DOM.. **DOM**: Sí.
- `renderProductGrid()` – **Descripción**: Renderiza `ProductGrid` en el DOM.. **DOM**: Sí.
- `renderCartTable()` – **Descripción**: Renderiza `CartTable` en el DOM.. **DOM**: Sí.
- `onAny()` – **Descripción**: Manejador de evento de la interfaz.. **DOM**: Sí.
- `totalsBlock()` – **Descripción**: Construye/actualiza bloque de totales.. **DOM**: No.
- `renderLastSale()` – **Descripción**: Renderiza `LastSale` en el DOM.. **DOM**: Sí.
- `updateMiniCart()` – **Descripción**: Actualiza estado/sincroniza UI.. **DOM**: Sí.
- `openHistory()` – **Descripción**: Abre modal/vista de la app.. **DOM**: Sí.
- `fullRender()` – **Descripción**: Renderizado completo a partir del estado.. **DOM**: Sí.

## 🛠️ Tecnologías
- HTML5
- CSS3
- JavaScript (vanilla)

## 🧪 Desarrollo
- Código comentado para cada funcionalidad.
- Eventos y flujos del carrito documentados.
- Buenas prácticas: nombres claros, funciones puras cuando sea posible, DOM aislado en controladores de vista.

## 💾 Datos y persistencia
Si se usa `localStorage`, el estado del carrito/historial se conserva entre recargas del navegador.

## ♿ Accesibilidad y 🔄 Rendimiento
- Etiquetas semánticas en HTML.
- Actualizaciones del DOM agrupadas para evitar reflows innecesarios.

### Tabla de funciones (con énfasis en DOM)

| Función/Clase | Manipula DOM | Descripción |
|---|:---:|---|
| `ensureInventory` | No | Valida precondiciones o existencias. |
| `byId` | No | Helper para seleccionar nodos del DOM por selector o id. |
| `toast` | Sí | Muestra notificación breve en la UI. |
| `el` | No | Helper para seleccionar nodos del DOM por selector o id. |
| `Cart` | No | Clase que modela el carrito (items, totales, operaciones). |
| `genId` | No | Genera un identificador único. |
| `createInvoice` | No | Crea contenido o registros (p. ej., factura). |
| `invoiceHTML` | No | Construye/gestiona la representación de factura. |
| `historyTable` | Sí | Construye/gestiona la tabla de historial. |
| `warnNoStock` | No | Funcionalidad del carrito (rellenar descripción si se requiere más detalle). |
| `onAddOne` | No | Manejador de evento (UI). |
| `onSetQty` | No | Manejador de evento (UI). |
| `onUpdateQty` | No | Manejador de evento (UI). |
| `onRemoveFromCart` | No | Manejador de evento (UI). |
| `clearCart` | No | Limpia estado (p. ej., carrito). |
| `checkBeforeCheckout` | No | Valida precondiciones o existencias. |
| `openInvoice` | Sí | Abre una vista, modal o sección relacionada. |
| `previewInvoice` | No | Previsualiza contenido antes de confirmar. |
| `finalizePurchase` | No | Finaliza la compra (persistencia/limpieza). |
| `renderChips` | Sí | Renderiza **Chips** en el DOM. |
| `renderGrid` | Sí | Renderiza **Grid** en el DOM. |
| `renderProductGrid` | Sí | Renderiza **ProductGrid** en el DOM. |
| `renderCartTable` | Sí | Renderiza **CartTable** en el DOM. |
| `onAny` | Sí | Manejador de evento (UI). |
| `totalsBlock` | No | Construye/actualiza bloque de totales. |
| `renderLastSale` | Sí | Renderiza **LastSale** en el DOM. |
| `updateMiniCart` | Sí | Actualiza estado o vista. |
| `openHistory` | Sí | Abre una vista, modal o sección relacionada. |
| `fullRender` | Sí | Renderizado integral de la página a partir del estado. |
