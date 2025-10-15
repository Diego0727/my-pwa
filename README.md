# Investigación – PWA (Progressive Web Apps)
# Research – PWA (Progressive Web Apps)

---

##  Casos empresariales reales
##  Real Business Cases

Las **Progressive Web Apps (PWA)** han demostrado ser una tecnología clave para mejorar la experiencia de usuario, la velocidad y la conversión en entornos móviles. A continuación, se presentan casos reales de empresas que implementaron PWAs y lograron resultados medibles en sus indicadores.  
**Progressive Web Apps (PWAs)** have proven to be a key technology to improve user experience, speed, and conversion in mobile environments. Below are real business cases of companies that implemented PWAs and achieved measurable results in their key performance indicators.

---

###  AliExpress
**Problema:** la versión móvil tradicional era lenta y poco eficiente, lo que causaba altas tasas de rebote y bajas conversiones.  
**Solución:** lanzaron una PWA con carga rápida, notificaciones push y navegación offline.  
**Resultados:**  
- Incremento del **104 %** en conversiones de nuevos usuarios.  
- Duplicación del número promedio de páginas vistas por sesión.  
- Mayor retención y participación de usuarios recurrentes.  

**Problem:** The traditional mobile version was slow and inefficient, causing high bounce rates and low conversions.  
**Solution:** They launched a PWA with fast loading, push notifications, and offline navigation.  
**Results:**  
- **104 % increase** in new user conversions.  
- Doubled the average number of pages viewed per session.  
- Improved retention and engagement among returning users.

---

### Forbes
**Problema:** la web móvil tardaba hasta 10 s en cargar, afectando la visibilidad de sus artículos y anuncios.  
**Solución:** implementaron una PWA optimizada con precarga de contenido y caché inteligente.  
**Resultados:**  
- Aumento del **43 %** en sesiones por usuario.  
- Incremento del **20 %** en visibilidad de anuncios.  
- Duplicación del compromiso de los usuarios (tiempo de lectura y retorno).  

**Problem:** The mobile site took up to 10 s to load, affecting visibility of articles and ads.  
**Solution:** They implemented an optimized PWA with content preloading and smart caching.  
**Results:**  
- **43 % increase** in sessions per user.  
- **20 % increase** in ad visibility.  
- Doubled user engagement (reading time and return rate).

---

### BookMyShow
**Problema:** los usuarios abandonaban la compra de boletos debido a tiempos de carga lentos y fallos en red móvil.  
**Solución:** desarrollaron una PWA ligera (menos de 400 KB) con almacenamiento offline y confirmaciones instantáneas.  
**Resultados:**  
- **80 %** de aumento en conversiones.  
- Reducción del tiempo de carga de 8 s a menos de 3 s.  

**Problem:** Users abandoned ticket purchases due to long loading times and unstable mobile connections.  
**Solution:** They developed a lightweight PWA (under 400 KB) with offline storage and instant confirmations.  
**Results:**  
- **80 % increase** in conversions.  
- Reduced loading time from 8 s to less than 3 s.

---

###  Lancôme
**Problema:** el sitio móvil no ofrecía una experiencia fluida ni soporte offline, afectando las ventas.  
**Solución:** implementaron una PWA con notificaciones personalizadas y caché dinámico para productos.  
**Resultados:**  
- Incremento del **50 %** en sesiones móviles.  
- **17 %** más conversiones de usuarios móviles.  

**Problem:** The mobile site didn’t offer a smooth experience or offline support, which affected sales.  
**Solution:** They implemented a PWA with personalized notifications and dynamic caching for products.  
**Results:**  
- **50 % increase** in mobile sessions.  
- **17 % increase** in mobile user conversions.

---

###  Tabla comparativa de resultados
###  Comparative Results Table

| Empresa / Company | Problema principal / Main Problem | Mejora obtenida / Improvement | Indicadores destacados / Key Indicators |
|--------------------|----------------------------------|-------------------------------|----------------------------------------|
| **AliExpress** | Carga lenta, baja conversión / Slow load, low conversion | PWA rápida con caché y push / Fast PWA with cache & push | +104 % conversiones, 2× páginas/sesión / +104 % conversions, 2× pages per session |
| **Forbes** | Sitio móvil pesado / Heavy mobile site | Precarga y cacheo dinámico / Preload & dynamic caching | +43 % sesiones/usuario, +20 % visibilidad anuncios / +43 % sessions per user, +20 % ad visibility |
| **BookMyShow** | Tiempos de carga altos / Long load times | PWA ligera con offline / Lightweight offline PWA | +80 % conversiones, -60 % tiempo de carga / +80 % conversions, -60 % load time |
| **Lancôme** | Baja experiencia móvil / Poor mobile UX | PWA personalizada y offline / Personalized offline PWA | +50 % sesiones móviles, +17 % conversiones / +50 % mobile sessions, +17 % conversions |

> **Fuentes oficiales / Official Sources:**  
> - Google Developers – [PWA Success Stories](https://developers.google.com/web/showcase)  
> - AliExpress Case Study – Google Web Dev  
> - Forbes PWA Case – PWA Stats  
> - BookMyShow Case – Google Developers  
> - Lancôme Case – Think with Google  

---

##  Almacenamiento y sincronización offline
##  Offline Storage and Synchronization

Las PWAs ofrecen múltiples APIs que permiten persistir datos incluso cuando no hay conexión a Internet, asegurando una experiencia continua y fluida.  
PWAs provide multiple APIs that allow data persistence even without an Internet connection, ensuring a continuous and smooth user experience.

---

### IndexedDB
- Es un **almacén NoSQL asincrónico** basado en pares clave-valor.  
- Permite guardar información estructurada (formularios, usuarios, tareas, etc.) cuando el usuario está offline.  
- Ideal para guardar los registros del formulario en este proyecto.  
- Se accede mediante la API nativa o librerías como `idb`.  

- It is an **asynchronous NoSQL storage** based on key–value pairs.  
- It allows storing structured data (forms, users, tasks, etc.) when offline.  
- Ideal for saving form entries in this project.  
- Accessed through the native API or libraries such as `idb`.

