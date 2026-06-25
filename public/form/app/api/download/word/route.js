(()=>{var e={};e.id=441,e.ids=[441],e.modules={846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1753:(e,t,o)=>{"use strict";o.r(t),o.d(t,{patchFetch:()=>m,routeModule:()=>a,serverHooks:()=>c,workAsyncStorage:()=>p,workUnitAsyncStorage:()=>l});var r={};o.r(r),o.d(r,{POST:()=>d});var n=o(6559),i=o(8088),s=o(7719);async function d(e){try{let{content:t,title:o}=await e.json();if(!t||!o)return Response.json({error:"Content and title are required"},{status:400});let r=`
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <title>${o}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotPromptForConvert/>
      <w:DoNotShowInsertionsAndDeletions/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page {
      margin: 1in;
    }
    body {
      font-family: 'Malgun Gothic', '맑은 고딕', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      color: #2c3e50;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    h1 { font-size: 18pt; font-weight: bold; }
    h2 { font-size: 16pt; font-weight: bold; }
    h3 { font-size: 14pt; font-weight: bold; }
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
      background-color: #f2f2f2;
      font-weight: bold;
    }
    ul, ol {
      margin: 10px 0;
      padding-left: 30px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #3498db;
      padding-bottom: 15px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      font-size: 9pt;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${o}</h1>
    <p>생성일: ${new Date().toLocaleDateString("ko-KR")}</p>
    <p>FormStudio에서 생성된 문서</p>
  </div>
  
  <div class="content">
    ${t.replace(/\n/g,"<br>")}
  </div>
  
  <div class="footer">
    <p>이 문서는 FormStudio (https://formstudio.com)에서 생성되었습니다.</p>
    <p>생성 시간: ${new Date().toLocaleString("ko-KR")}</p>
  </div>
</body>
</html>
    `,n=Buffer.from(r,"utf-8");return new Response(n,{headers:{"Content-Type":"application/vnd.openxmlformats-officedocument.wordprocessingml.document","Content-Disposition":`attachment; filename="${encodeURIComponent(o)}.doc"`,"Content-Length":n.length.toString()}})}catch(e){return console.error("Word download error:",e),Response.json({error:"Word 파일 생성 중 오류가 발생했습니다."},{status:500})}}let a=new n.AppRouteRouteModule({definition:{kind:i.RouteKind.APP_ROUTE,page:"/api/download/word/route",pathname:"/api/download/word",filename:"route",bundlePath:"app/api/download/word/route"},resolvedPagePath:"/Users/baejinho/Documents/resty/form/app/api/download/word/route.tsx",nextConfigOutput:"",userland:r}),{workAsyncStorage:p,workUnitAsyncStorage:l,serverHooks:c}=a;function m(){return(0,s.patchFetch)({workAsyncStorage:p,workUnitAsyncStorage:l})}},3033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},4870:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},6487:()=>{},6559:(e,t,o)=>{"use strict";e.exports=o(4870)},8335:()=>{},9294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")}};var t=require("../../../../webpack-runtime.js");t.C(e);var o=e=>t(t.s=e),r=t.X(0,[719],()=>o(1753));module.exports=r})();