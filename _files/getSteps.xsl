<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="steps">
    <html>
      <body>
        <xsl:for-each select="step">
          <div class="step">
            <xsl:attribute name="id">panel-<xsl:value-of select="@id"/></xsl:attribute>
            <!-- contents of a DITA step: (cmd then (info or substeps or 
            tutorialinfo or stepxmp or choicetable or choices) (any number) then (stepresult) (optional) )  -->
            <span class="cmd">
              <xsl:if test="count(panel-desc/action)>0"></xsl:if>
              <xsl:value-of select="cmd"/>
            </span>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>