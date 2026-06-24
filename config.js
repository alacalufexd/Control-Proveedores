// ══════════════════════════════════════════════════════════
//  CONFIGURACIÓN — Control OC & Facturas
//  Edita este archivo con los valores de tu organización
//  Guía completa en SETUP.md
// ══════════════════════════════════════════════════════════

window.OC_CONFIG = {

  // 1. Azure App Registration → Overview
  clientId: 'PEGAR_AQUI_EL_CLIENT_ID',      // Ej: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

  // 2. Azure App Registration → Overview → Directory (tenant) ID
  tenantId: 'PEGAR_AQUI_EL_TENANT_ID',      // Ej: 'f1e2d3c4-b5a6-7890-abcd-ef0987654321'

  // 3. Graph Explorer → GET https://graph.microsoft.com/v1.0/sites?search=NombreSitio
  //    Copiar el campo "id" del sitio donde crearás las listas
  siteId: 'PEGAR_AQUI_EL_SITE_ID',          // Ej: 'tuempresa.sharepoint.com,abc123...,def456...'

  // 4. Nombres de las listas en SharePoint (no cambiar si seguiste la guía)
  listOC:       'OC_Control',
  listFacturas: 'Facturas_Control',
};
