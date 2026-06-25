(()=>{var e={};e.id=561,e.ids=[561],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},5438:(e,t,r)=>{"use strict";r.r(t),r.d(t,{patchFetch:()=>u,routeModule:()=>s,serverHooks:()=>c,workAsyncStorage:()=>d,workUnitAsyncStorage:()=>l});var o={};r.r(o),r.d(o,{POST:()=>p});var n=r(6559),a=r(8088),i=r(7719);async function p(e){try{let{content:t,title:r}=await e.json();if(!t||!r)return Response.json({error:"Content and title are required"},{status:400});let o=`
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${r}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #3498db;
      padding-bottom: 15px;
    }
    .header h1 {
      color: #2c3e50;
      font-size: 24pt;
      margin: 0 0 10px 0;
    }
    .header p {
      color: #666;
      margin: 5px 0;
    }
    .content {
      margin: 20px 0;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #2c3e50;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    h1 { font-size: 18pt; }
    h2 { font-size: 16pt; }
    h3 { font-size: 14pt; }
    p { margin: 10px 0; }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 15px 0;
    }
    table, th, td {
      border: 1px solid #ddd;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f8f9fa;
      font-weight: bold;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 25px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      font-size: 10pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${r}</h1>
    <p>생성일: ${new Date().toLocaleDateString("ko-KR")}</p>
    <p>FormStudio에서 생성된 문서</p>
  </div>
  
  <div class="content">
    ${t.replace(/\n/g,"<br>")}
  </div>
  
  <div class="footer">
    <p>이 문서는 FormStudio에서 생성되었습니다.</p>
    <p>생성 시간: ${new Date().toLocaleString("ko-KR")}</p>
  </div>
</body>
</html>
    `,n=Buffer.from(o,"utf-8");return new Response(n,{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${encodeURIComponent(r)}.pdf"`,"Content-Length":n.length.toString()}})}catch(e){return console.error("PDF download error:",e),Response.json({error:"PDF 파일 생성 중 오류가 발생했습니다."},{status:500})}}let s=new n.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/download/pdf/route",pathname:"/api/download/pdf",filename:"route",bundlePath:"app/api/download/pdf/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/form/app/api/download/pdf/route.tsx",nextConfigOutput:"",userland:o}),{workAsyncStorage:d,workUnitAsyncStorage:l,serverHooks:c}=s;function u(){return(0,i.patchFetch)({workAsyncStorage:d,workUnitAsyncStorage:l})}},6487:()=>{},6559:(e,t,r)=>{"use strict";e.exports=r(4870)},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[719],()=>r(5438));module.exports=o})();