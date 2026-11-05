// /sitemap.xsl: TURNS THE SITEMAP INDEX AND BOTH URL SETS INTO A BRANDED TABLE IN THE BROWSER (CRAWLERS IGNORE IT AND READ THE XML).
// NO INLINE STYLE OR SCRIPT: THE CSP ALLOWS ONLY 'self', SO THE LOOK LIVES IN /sitemap.css. XSLT 1.0 ONLY (WHAT BROWSERS IMPLEMENT).
import { site } from '../data/site'
import { escapeXml } from '../utils/urls'

const name = escapeXml(site.name)

export const sitemapXsl = (): string => `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:sm="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
  exclude-result-prefixes="sm image">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <meta name="robots" content="noindex"/>
        <title>
          <xsl:choose>
            <xsl:when test="sm:sitemapindex">Sitemap index | ${name}</xsl:when>
            <xsl:otherwise>Sitemap | ${name}</xsl:otherwise>
          </xsl:choose>
        </title>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml"/>
        <link rel="stylesheet" href="/sitemap.css"/>
      </head>
      <body>
        <div class="wrap">
          <a class="brand" href="/"><img src="/favicon.svg" alt="" width="36" height="36"/><span>Buy<b>DummyFlights</b></span></a>
          <xsl:apply-templates select="sm:sitemapindex | sm:urlset"/>
          <p class="foot">This is the XML sitemap of ${name}, styled for people. Search engines read the plain XML.</p>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="sm:sitemapindex">
    <h1>Sitemap index</h1>
    <p class="lead">The sitemaps that list every page of this site. Submit this one address in Google Search Console.</p>
    <ul class="stats">
      <li><strong><xsl:value-of select="count(sm:sitemap)"/></strong>sitemaps</li>
    </ul>
    <div class="card">
      <table>
        <thead><tr><th>Sitemap</th><th class="num">Last modified</th></tr></thead>
        <tbody>
          <xsl:for-each select="sm:sitemap">
            <tr>
              <td class="url"><a href="{concat('/', substring-after(substring-after(sm:loc, '://'), '/'))}"><xsl:value-of select="sm:loc"/></a></td>
              <td class="num"><xsl:value-of select="sm:lastmod"/></td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </div>
  </xsl:template>

  <xsl:template match="sm:urlset">
    <h1>Sitemap</h1>
    <p class="lead">Every indexable URL in this sitemap, with the date its content last changed.</p>
    <ul class="stats">
      <li><strong><xsl:value-of select="count(sm:url)"/></strong>URLs</li>
      <li><strong><xsl:value-of select="count(sm:url/image:image)"/></strong>images</li>
    </ul>
    <div class="card">
      <table>
        <thead><tr><th class="num">#</th><th>URL</th><th class="num">Last modified</th><th class="num">Images</th></tr></thead>
        <tbody>
          <xsl:for-each select="sm:url">
            <tr>
              <td class="num"><xsl:value-of select="position()"/></td>
              <td class="url"><a href="{sm:loc}"><xsl:value-of select="sm:loc"/></a></td>
              <td class="num"><xsl:value-of select="sm:lastmod"/></td>
              <td class="num"><xsl:value-of select="count(image:image)"/></td>
            </tr>
          </xsl:for-each>
        </tbody>
      </table>
    </div>
    <p class="foot"><a href="/sitemap.xml">Back to the sitemap index</a></p>
  </xsl:template>
</xsl:stylesheet>
`
