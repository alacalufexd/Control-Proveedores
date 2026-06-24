# 🚀 Guía de Configuración — Control OC & Facturas
## Microsoft 365 + SharePoint + GitHub Pages

---

## Resumen de la arquitectura

```
Tu equipo (navegador)
       ↓  login con cuenta Microsoft
Azure AD (autenticación)
       ↓  token de acceso
Graph API → SharePoint Lists (base de datos compartida)
       ↑
GitHub Pages (hosting del HTML/JS)
```

**Tiempo estimado de configuración:** 20-30 minutos  
**Requisitos:** Cuenta admin de Microsoft 365, cuenta de GitHub

---

## PASO 1 — Crear el repositorio en GitHub

1. Ve a **github.com** → **New repository**
2. Nombre: `control-oc` (o el que prefieras)
3. Visibilidad: **Public** (necesario para GitHub Pages gratis) o Private con plan de pago
4. Sube estos 3 archivos:
   - `index.html` (el archivo principal, renombra `control-oc.html` a `index.html`)
   - `config.js`
   - `SETUP.md` (este archivo, opcional)

5. Ve a **Settings → Pages**
6. Source: **Deploy from branch** → rama `main` → carpeta `/ (root)`
7. Guardar → en 2-3 minutos tendrás una URL como: `https://tuusuario.github.io/control-oc`

> ⚠️ **Anota esta URL**, la necesitarás en el Paso 2.

---

## PASO 2 — Registrar la aplicación en Azure AD

1. Ve a **portal.azure.com** → inicia sesión con tu cuenta admin
2. Busca **"App registrations"** → **New registration**
3. Completa:
   - **Name:** `Control OC Facturas`
   - **Supported account types:** *Accounts in this organizational directory only*
   - **Redirect URI:** Selecciona **Single-page application (SPA)** → ingresa tu URL de GitHub Pages:
     ```
     https://tuusuario.github.io/control-oc/
     ```
     > Incluye la barra final `/`
4. Haz clic en **Register**

### 2a. Copiar los IDs

En la página **Overview** de tu app recién creada, copia:
- **Application (client) ID** → esto va en `clientId` en config.js
- **Directory (tenant) ID** → esto va en `tenantId` en config.js

### 2b. Configurar permisos API

1. En tu App Registration → **API permissions** → **Add a permission**
2. Selecciona **Microsoft Graph** → **Delegated permissions**
3. Busca y agrega estos permisos:
   - `Sites.ReadWrite.All`
   - `User.Read`
4. Haz clic en **Add permissions**
5. Haz clic en **Grant admin consent for [tu organización]** → Confirm

### 2c. Verificar token configuration

1. En tu App Registration → **Authentication**
2. Verifica que tu URL de GitHub Pages aparece en **Single-page application** redirect URIs
3. En **Implicit grant and hybrid flows**: asegúrate que **NO** estén marcados (SPA usa PKCE, no implicit)

---

## PASO 3 — Crear el sitio SharePoint y las listas

### 3a. Crear o elegir un sitio SharePoint

1. Ve a **sharepoint.com** → tu tenant
2. Puedes usar un sitio existente o crear uno nuevo:
   - **New site** → Team site → Nombre: `Control Compras`

### 3b. Obtener el Site ID

1. Ve a **Graph Explorer**: [developer.microsoft.com/graph/graph-explorer](https://developer.microsoft.com/en-us/graph/graph-explorer)
2. Inicia sesión con tu cuenta admin
3. Ejecuta esta consulta (reemplaza con el nombre de tu sitio):
   ```
   GET https://graph.microsoft.com/v1.0/sites?search=Control+Compras
   ```
4. En la respuesta, copia el valor del campo **"id"** del sitio encontrado
   - Se ve así: `tuempresa.sharepoint.com,xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx,yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy`
5. Ese valor va en `siteId` en config.js

### 3c. Crear las listas en SharePoint

Ve al sitio SharePoint y crea **2 listas** con estos nombres y columnas exactas:

---

#### Lista 1: `OC_Control`

**Site contents → New → List → Blank list → Nombre: `OC_Control`**

Agrega estas columnas (Tipo en paréntesis):

| Nombre columna | Tipo |
|---|---|
| `NocManager` | Single line of text |
| `Fecha` | Single line of text |
| `Unidad` | Single line of text |
| `UnidadRut` | Single line of text |
| `Proveedor` | Single line of text |
| `ProvRut` | Single line of text |
| `ItemsJSON` | Multiple lines of text |
| `Subtotal` | Number |
| `Iva` | Number |
| `Total` | Number |
| `Estado` | Single line of text |
| `IsUF` | Yes/No |
| `OrigenPDF` | Yes/No |
| `Observaciones` | Multiple lines of text |
| `MailCompras` | Single line of text |

> La columna **Title** ya existe por defecto, la usamos para el N° OC.

---

#### Lista 2: `Facturas_Control`

**Site contents → New → List → Blank list → Nombre: `Facturas_Control`**

| Nombre columna | Tipo |
|---|---|
| `Num` | Single line of text |
| `OcId` | Single line of text |
| `Proveedor` | Single line of text |
| `RutProveedor` | Single line of text |
| `Receptor` | Single line of text |
| `RutReceptor` | Single line of text |
| `Glosa` | Multiple lines of text |
| `FechaIngreso` | Single line of text |
| `FechaVenc` | Single line of text |
| `FormaPago` | Single line of text |
| `Neto` | Number |
| `Iva` | Number |
| `Total` | Number |
| `ValorUF` | Number |
| `MailAprov` | Single line of text |
| `Estado` | Single line of text |
| `FechaAprobacion` | Single line of text |
| `Aprobo` | Single line of text |
| `OrigenPDF` | Yes/No |

> La columna **Title** ya existe por defecto, la usamos para el ID de factura.

---

## PASO 4 — Configurar config.js y subir a GitHub

1. Abre el archivo `config.js`
2. Reemplaza los valores:

```javascript
window.OC_CONFIG = {
  clientId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',  // de Paso 2a
  tenantId: 'f1e2d3c4-b5a6-7890-abcd-ef0987654321',  // de Paso 2a
  siteId:   'tuempresa.sharepoint.com,abc...,def...', // de Paso 3b
  listOC:       'OC_Control',
  listFacturas: 'Facturas_Control',
};
```

3. Sube el `config.js` actualizado a tu repositorio GitHub
4. También asegúrate que `index.html` tiene esta línea en el `<head>` **antes del cierre `</head>`**:
   ```html
   <script src="config.js"></script>
   ```

---

## PASO 5 — Dar acceso al equipo

### En Azure AD:
No es necesario agregar usuarios a la App Registration si usas *"Accounts in this organizational directory only"* — todos los usuarios de tu tenant podrán autenticarse automáticamente.

### En SharePoint:
1. Ve al sitio SharePoint → **Settings → Site permissions**
2. Agrega a los miembros de tu equipo con rol **Member** o **Contributor**
3. Ellos podrán leer y escribir las listas

---

## PASO 6 — Verificar que funciona

1. Abre tu URL de GitHub Pages
2. Debería aparecer la pantalla de login
3. Haz clic en "Iniciar sesión con Microsoft"
4. Acepta los permisos la primera vez
5. El dashboard debería cargar (vacío al inicio)
6. Importa una OC de prueba y verifica que aparece en la lista de SharePoint

---

## Solución de problemas comunes

| Error | Causa probable | Solución |
|---|---|---|
| `AADSTS50011` | Redirect URI no coincide | Verifica la URL exacta en Azure AD → Authentication |
| `403 Forbidden` | Sin permisos en SharePoint | Agrega el usuario a los miembros del sitio |
| `Invalid client` | clientId incorrecto | Copia el Application ID, no el Object ID |
| `Lista no encontrada` | Nombre de lista incorrecto | Verifica mayúsculas/minúsculas en config.js |
| CORS error | SPA no configurado en Azure | Verifica que el Redirect URI esté en "Single-page application", no en "Web" |

---

## Estructura de archivos en GitHub

```
control-oc/
├── index.html      ← Aplicación principal (renombrar desde control-oc.html)
├── config.js       ← Configuración (clientId, tenantId, siteId)
└── SETUP.md        ← Esta guía
```

---

## Seguridad

- Las credenciales **nunca** están en el código — solo están en `config.js` que es público pero no contiene secretos (el flujo OAuth SPA no usa client secrets)
- La autenticación es 100% Microsoft — el token de acceso lo emite Azure AD
- Los datos viven en **SharePoint de tu organización**, no en servidores externos
- Puedes revocar el acceso desde Azure AD en cualquier momento

---

*Creado con Claude · Sistema Control OC & Facturas v2.0*
