<?xml version="1.0"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml"/>
  <xsl:variable name="task-id">task-<xsl:value-of select="task/@id" /></xsl:variable>

  <xsl:template match="task">
    <html>
      <body>
        <xsl:apply-templates select="taskbody">
          <xsl:with-param name="task-id"><xsl:copy-of select="$task-id"/></xsl:with-param>
        </xsl:apply-templates> 
      </body>
    </html>
  </xsl:template>

  <xsl:template match="taskbody">
    <xsl:param name="task-id"/>
    <xsl:apply-templates select="prereq"/> 
    <xsl:apply-templates select="context"/>
    <xsl:apply-templates select="steps">
      <xsl:with-param name="steps-id"><xsl:copy-of select="$task-id"/>-step</xsl:with-param>
    </xsl:apply-templates>
    <xsl:apply-templates select="result"/>
    <xsl:apply-templates select="postreq"/>
  </xsl:template>

  <xsl:template match="prereq | context | result | postreq">
    <div>
      <xsl:attribute name="class">dita-<xsl:value-of select="name(.)" /></xsl:attribute>
      <xsl:attribute name="id"><xsl:copy-of select="$task-id" />-<xsl:value-of select="name(.)" /></xsl:attribute>
      <xsl:copy-of select="node()"/>
    </div>
  </xsl:template>

  <xsl:template match="steps | substeps">
    <xsl:param name="steps-id" />
    
    <xsl:for-each select="step | substep">
      <xsl:variable name="step-id">
        <xsl:copy-of select="$steps-id" />-<xsl:choose>
          <xsl:when test="@id">
            <xsl:value-of select="@id" />
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="position()" />
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>
      
      <xsl:apply-templates select=".">
        <xsl:with-param name="step-id">
          <xsl:copy-of select="$step-id" />
        </xsl:with-param>
        <xsl:with-param name="step-type"><xsl:value-of select="name(.)"/></xsl:with-param>
      </xsl:apply-templates>

    </xsl:for-each>
  </xsl:template>

  <xsl:template match="step | substep">
    <xsl:param name="step-id" />
    <xsl:param name="step-type" />
    <div>
      <xsl:attribute name="class">dita-<xsl:copy-of select="$step-type" /></xsl:attribute>
      <xsl:attribute name="id"><xsl:copy-of select="$step-id" /></xsl:attribute>

      <xsl:apply-templates select="cmd">
        <xsl:with-param name="step-id">
          <xsl:copy-of select="$step-id" />
        </xsl:with-param>
      </xsl:apply-templates>

      <xsl:apply-templates select="info">
        <xsl:with-param name="step-id">
          <xsl:copy-of select="$step-id" />
        </xsl:with-param>
      </xsl:apply-templates>

      <xsl:apply-templates select="substeps">
        <xsl:with-param name="steps-id"><xsl:copy-of select="$step-id" />-substep</xsl:with-param>
      </xsl:apply-templates>
    </div>
  </xsl:template>

  <xsl:template match="cmd | info">
    <xsl:param name="step-id" />
    <span>
      <xsl:attribute name="class">dita-<xsl:value-of select="name(.)"/></xsl:attribute>
      <xsl:attribute name="id"><xsl:copy-of select="$step-id" />-<xsl:value-of select="name(.)"/></xsl:attribute>
      <xsl:apply-templates select="node()"/>
    </span>
  </xsl:template>
  
  <xsl:template match="xref">
    <a>
      <xsl:attribute name="href"><xsl:value-of select="@href"/></xsl:attribute>
      <xsl:copy-of select="node()"/>
    </a>
  </xsl:template>

  <xsl:template match="image">
    <img>
      <xsl:attribute name="src"><xsl:value-of select="@href"/></xsl:attribute>
      <xsl:attribute name="alt"><xsl:value-of select="alt"/></xsl:attribute>
    </img>
  </xsl:template>  

  <xsl:template match="@*|node()">
      <xsl:copy>
          <xsl:apply-templates select="@*|node()"/>
      </xsl:copy>
  </xsl:template>


</xsl:stylesheet>