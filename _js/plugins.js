// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f(){ log.history = log.history || []; log.history.push(arguments); if(this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);}};

// make it safe to use console.log always
(function(a){function b(){}for(var c="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),d;!!(d=c.pop());){a[d]=a[d]||b;}})
(function(){try{console.log();return window.console;}catch(a){return (window.console={});}}());

/*
 * jquery.xslt.js
 *
 * Copyright (c) 2005-2008 Johann Burkard (<mailto:jb@eaio.com>)
 * <http://eaio.com>
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
 * NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
 * USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
 
/**
 * jQuery client-side XSLT plugins.
 * 
 * @author <a href="mailto:jb@eaio.com">Johann Burkard</a>
 * @version $Id: jquery.xslt.js,v 1.10 2008/08/29 21:34:24 Johann Exp $
 */
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?"":e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--){d[e(c)]=k[c]||e(c)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('(2(C){C.l.h=2(){k 7};0 D=/^\\s*</;1(a.11){C.l.h=2(F,G){0 H=C(7);0 J=2(){0 K="V";1(I.5==K&&E.5==K){b.W(2(){H.z(I.P(E.Q))},R)}};0 I=a.r("6");I.d=J;I[D.f(F)?"n":"o"]=F;0 E=a.r("6");E.d=J;E[D.f(G)?"n":"o"]=G;C("T").g(I).g(E);k 7}}8{1(b.m!=e&&b.U!=e&&b.i!=e){0 B=9 i();0 A=t;1(C.v(B.j)){A=b.M!=e}8{A=q}1(A){C.l.h=2(G,H){0 I=C(7);0 F=t;0 J={5:4};0 E={5:4};0 K=2(){1(J.5==4&&E.5==4&&!F){0 L=9 i();1(C.v(L.j)){c=a.X.Y("","",y);L.j(J.3,E.3,c,y);I.z(9 M().Z(c))}8{L.10(E.3);c=L.O(J.3,a);I.S().g(c)}F=q}};1(D.f(G)){J.3=9 m().x(G,"p/6")}8{J=C.u({w:"6",N:G});J.d=K}1(D.f(H)){E.3=9 m().x(H,"p/6");K()}8{E=C.u({w:"6",N:H});E.d=K}k 7}}}}})(12);',62,65,'var|if|function|responseXML||readyState|xml|this|else|new|document|window|resultDoc|onreadystatechange|undefined|test|append|xslt|XSLTProcessor|transformDocument|return|fn|DOMParser|innerHTML|src|text|true|createElement||false|ajax|isFunction|dataType|parseFromString|null|html|||||||||||||XMLSerializer|url|transformToFragment|transformNode|XMLDocument|50|empty|body|XMLHttpRequest|complete|setTimeout|implementation|createDocument|serializeToString|importStylesheet|recalc|jQuery'.split('|'),0,{}))

// place any jQuery/helper plugins in here, instead of separate, slower script files.