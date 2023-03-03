//This code is owned and the proprietary property of Globemallow.io LLC. Any use of this intellectual property without the consent of Globemallow.io LLC is illegal. All rights reserved.
chrome.runtime.onMessage.addListener(msg=> {
    
    if (document.readyState === 'complete') {
        blockerFunction();
        setTimeout(blockerFunction, 2000);
        setTimeout(blockerFunction, 4000);
        setTimeout(blockerFunction, 6000);
        setTimeout(blockerFunction, 8000);
    }

     else {
        window.addEventListener('load', blockerFunction);
    }
});


function blockerFunction(){
   
///////////////////////////////////////////////////////
//Analytics Tracker Checker    

const analList = [/google-analytics/, /googletagmanager/, /connect.facebook.net/, /clarity.ms/, /analytics.tiktok/, /quantcount/, /snap.licdn/, /analytics.similarweb/, /hotjar/, /pardot/,
/newrelic/, /foresee/, /smetrics./, /tms./, /crazyegg/, /boomtrain/
, /cdn.turner/, /optimizely/, /bounceexchange/, /visualime/, /tags.tiqcdn/, /tealiumiq/,
/adobedtm/, /qualaroo/, /clicktale/, /funnelenvy/, /edge.fullstory/, /tvsquared/, /heapanalytics/,
 /thebrighttag/, /s.btstatic/, /raygun/, /ac\-target/, /demdex/, /utag/, /iperceptions/, /techtarget/, /bizible/,
 /6sc.co/, /demandbase/, /engagio/, /akamai/, /qualtrics/, /rubiconproject/, /s.yimg/,
  /cdn.segment/, /marinsm/, /googlesyndication/, /chartbeat/, /gstatic/, /rlcdn/, /sojern/,
  /rmtag/, /impactradius\-event/, /bytedance/, /sprig/, /userleap/, /taboola/, /sleeknote/, /pushcrew/, /onesignal/, /amplify\-outbrain/, /dianomi/, /s\-onetag/, /redditstatic/, /rubiconproject/, /mpulse/, /.demex.net\//, /gateway.foresee.com/, /.scene7/, /googletagservices/, /analytics.yahoo.com/, /doubleverify/, /.imrworldwide./, /analytics.twitter/, /bidswitch/, /widgets\-outbrain/, /igodigital/, /api\-segment/, /pix.pub/, /nr\-data/, /c.lytics/, /indexww/, /p1.parsely/, /omtrdc/, /curalate/, /richrelevance/, /cquotient/, /api.drift/, /app.dynamics/, /pixel.wp/, /s7.addthis/, /webtrendslive/, /googleoptimize/, /px\-cloud.net/, /liveperson/, /tamgrt/, /.forter/, /piwik/, /3gl.net/, /btttag/, /crwdcntrl.net/, /exelator/, /helpscout/, /platform.twitter/, /linkedin.com\/li\/track/, /tvsquared/, /fullstory/, /powerreviews/, /mouseflow/, /brightcove/, /beacon.walmart.com/, /mathtag/, /\/clickstream\//, /\/gauge\/link\//, /\/gauge\/pageview\//, /bs.serving\-sys/, /dyntrace/, /custhelp/, /answerscloud/, /yotpo/, /kampyle/, /webcollage/, /salsify\-ecdn/, /ct.pintrest/, /soptimize.southwest/, /innovid/, /facebook.com\/tr/, /-tm.everesttech/, /r.turn/, /content.mink/, /siteimproveanalytics/, /newscgp/, /js\+ssdomvar.js\+generic/, /snowplowanalytics/, /6sc.co/, /bluekai/, /usabilla/, /xg4ken/, /api.amplitude/, /\/b\/ss\//, /quantummetric/, /\/wt.pl\?/, /spotxchange/, /mookie1/, /\/glassbox\/reporting\//, /\/ga\/gtag.js/, /\/plugins\/like.php/, /maxymiser.net\//, /visualwebsiteoptimizer/, /d.turn/, /branch.io/, /res\-x/, /narrativ/, /dcf.espn/, /bluecore/, /yjtag.yahoo/, /ruxitagent/, /plausible.io\/js/, /jscache/, /acuityplatform/, /cloudfront.net\/form\-serialize/, /mr.homedepot/, /static\/js\/t.js/, /dotmetrics.net/, /hit.xiti/, /plusone.js/, /kaltura/, /tagcommander/, /boomerang.js/, /techlab\-cdn/, /3lift/, /searchiq/, /\/js\/tealeaf/, /appboy.com\/api/, /sharethis.com/, /bizible/, /getclicky.com\/js/, /track.securedvisit/, /online\-metrix/, /dynamicyield/, /yottaa/, /atgvcs/, /agkn.com/, /t.co\//, /data.microsoft/, /quantcast/, /cdn.pdst/, /sgtm/, /owneriq/, /shoprunner/, /osano/, /gigya/, /log.pinterest/, /hubspot/, /pinimg/, /\/opinionlab\//, /merkle\_track/, /ensighten/, /alexametrics/, /tr.snapchat/, /c.msn/, /keywee/, /bizographics.com\/collect/, /omnitagjs/, /yandex.ru\/metrika\//, /evidon\-sitenotice\-tag.js/, /dotomi/, /lijit/, /bluecava/, /data.pendo.io/, /heapanalytics/, /certona/, /sail\-horizon.com\/spm/, /.gumgum.com/, /mparticle/, /privy.com\/collect/, /abtasty/, /dwin1/, /shopifycdn/, /uplift\-platform/, /w55c/, /liadm/, /sddan/, /sundaysky/, /\/atrk.js/, /\/kinesis/, /zdassets/, /rfihub/, /ex.co/, /\/launch\/launch\-/, /.com\/id\?d\_visid\_ver/, /marketo/, /simpleanalyticscdn.com/, /cdn.amplitude/, /ki.js/, /youtube.com\/ptracking/, /youtube.com\/pcs\/parallelactiveview/, /youtube.com\/api\/stats\/playback\//, /youtube.com\/pcs\/activeview/, /googleusercontent.com\/proxy\//, /cdn.yottaa.com\/rapid/, /cdn.matomo./, /cdn.pbbl.co/, /oracleinfinity/, /t.paypal.com\/ts/, /paypalobjects.com\/muse\//, /cdn.onthe.io\//, /matomo.js/, /js.taplytics/, /facebook.com\/tr/, /\/\/webanalytics./, /bugherd.com\/sidebarv2/, /tag.segmetrics.io/, /pixel.condenastdigital.com/, /segment\-data.zqtk.net/, /cloudfront.net\/p.js/, /capture.condenastdigital.com\/track/, /nielsen.js/, /www.google.com\/gen_204/, /analytics.js/, /.cloudfront.net\/tag-manager\//, /sessions.bugsnag.com/, /.myfonts.net\/count\//, /cdn.kampyle.com/, /cdn.piano.io/, /.instana.io/, /cloudflareinsights/, /.mxpnl.com\//, /firebase\-analytics.js\//, /.wistia./, /.pingdom.net\//, /blueconic.net/, /js.hsleadflows.net\//, /hs-analytics.net\//, /analytics.newscred/, /pxchk.net/, /px-cloud.net/, /cdn.sophi.io\//, /browser.sentry-cdn.com\//, /youtube.com\/generate_204/, /litix.io/, /vercel-insights/, /.apxlv.com\//, /.mutinycdn.com\/personalize\//, /reveal.clearbit.com/, /tracking.g2crowd.com\//, /akamaihd.net/, /sitesearch360.com/, /api.ipdata.co/, /\/analytics\/preloadInit.js/, /\/analytics\/segment\/init-production.js/, /cdn.dynamicyield.com\/api/, /browser-intake-datadoghq.com/, /tracker.affirm.com/, /cdn.rollbar.com\/rollbarjs/, /sentry.io\/api/, /web-assets.zendesk.com\/js\/analytics/, /.levexis.com/, /mybluemix.net/, /igodigital.com\/collect/, /hs-analytics.net/, /radar.cedexis/, /\/\/unagi.amazon./, /ns1p.net/, /avalon.perfdrive.com/, /sstats.adobe.com/, /xp.apple./, /supportmetrics.apple./, /.heatmap.it/, /.t-online.de\//, /speedcurve/, /ysucej/, /united-infos.net/, /.uicdn/, /bfops.io/, /ioam.de/, /improving.duckduckgo/, /metrics.roblox/, /.amagi.tv\/beacon/, /llnwd.net/, /analytics.shareaholic/, /partner.shareaholic/, /loomi-prod.xyz\/analytics/, /slack.com\/clog\/track/, /slack.com\/beacon/, /clarity.ms/, /msecnd.net/, /navdmp/, /t.tailtarget/, /cdn.ravenjs.com/, /aswpsdkus.com/, /horizon-track.globo.com/, /cohesionapps/, /px-cdn/, /btloader.com\/tag/, /clicks.hurriyet/, /netmera-web/, /ngastatic.com/, /js_tracking/, /widget.surveymonkey/, /geo.yahoo/, /windows.net/, /rvapps/, /page-script.creabl/, /ip-api/, /tag.aticdn.net/, /polyfill.io/, /bugsnag.min.js/, /sessioncam.recorder.js/, /joshuarms/, /app.launchdarkly/, /events.launchdarkly/, /evidon.com\/geo/, /tracker.metricool/, /stats.wp/, /lr-ingest.io/, /track.dictionary/, /track.thesaurus.com/, /webleads-tracker/, /dmpxs/, /newsnationnow.com\/wp-content/, /metrics.api.drift/, /hs-scripts/, /optimizelyjs/, /p.smartertravel/, /tm.hdmtools/, /brilliantcollector/, /ytc.js/, /monitor.azure/, /sentry-cdn/, /cleverpush/, /.com\/tag.aspx?/, /rbl.ms/, /cdn.salesloft/, /track.cbdatatracker/, /web-sdk.urbanairship/, /.com\/gtm.js/, /tr.www.cloudflare/, /api.radar.cloudflare.com/, /cgi-bin\/PelicanC.dll/, /\/acelogger./, /logger\/logger.js/, /.interworksmedia./, /rum.beusable./, /static.dable.io/, /\/io.narrative.io/, /trackonomics/, /rfpx1/, /newsroom.bi/, /opecloud/, /revi.rcs.it/, /mpsnare.iesnare/, /cdn4.forter/, /cdn.tinypass/, /cntxtfl.com/, /amp-analytics/, /tracking.univtec/, /ph-static.imgix/, /data.msn/, /bing.com\/api\/v1\/mediation\/tracking/, /pages.ebay.com\/identity\/device/, /devicebind.ebay/, /rover.ebay/, /gh\/useracquisition\/userbehavior?/, /gh\/dfpsvc?/, /backstory.ebay/, /cdn.speedcurve/, /testandtarget\/clientlibs/, /ced.sascdn.com/, /s0.wp./, /discover-metrics.cloud./, /cdn.fuseplatform.net/, /resource.csnstatic/, /.clmbtech/, /logs.infoedgeindia/, /logs.naukri/, /bms-analytics.js/, /.webengage.co/, /usmetric.rediff/, /moengage/, /va.tawk.to/, /trackonomics.net/, /extreme-ip-lookup/, /omniture.js/, /evgnet.com/, /coveo.analytics.js/, /techlab-cdn/, /typepad.com\/t\/stats/, /fls-na.amazon.com/, /unagi.amazon/, /amazon.com\/service\/web\/content\/uploadMetrics/, /js.trendmd/, /nytimes.com\/track/, /disqus.com\/count.js/, /wp-content\/plugins\/google-analyticator/, /gaug.es\/track/, /use.typekit.net/, /youtube.com\/api\/stats/, /imhd.io/, /confiant-integrations.net/, /memo.co/, /usefathom.c/, /fastly-insights.c/, /durationmedia.n/, /beacon.wikia-services.com/, /loggly.com/, /firstpromoter/, /datadoghq-browser-agent.c/, /ascent360.c/, /analysis.fi/, /posthog.c/, /convertexperiments/, /luckyorange.c/, /brandmentions.c/, /statcounter.c/, /opmnstr.c/, /omappapi.c/, /trstplse.c/, /metrics.gfycat/];
    
    
    
const adList = [/doubleclick/, /scorecardresearch/, /krxd.net/, /adservice.google/, /googleadservices/, /geoedge/, /ads\-twitter/, /amazon\-adsystem/, /ads.pubmatic/, /adroll/, /adnxs/, /ads.\linkedin/, /moatads/, /criteo/, /adlightning/, /turner.com\/ads/, /adsafeprotected/, /sc\-static/, /px.ads.linkedin/, /adsrvr/, /monetate/, /apps.bazaarvoice/, /tapad/, /casalemedia/, /ads.stickyadstv/, /pubmatic.com\/AdServer/, /ispot.tv/, /fwmrm.net/, /cxense/, /adsymptotic/, /yahoo.com\/admax/, /.brsrvr/, /advertising/, /ad.360yield/, /ad.wsod/, /teads.tv/, /tvpixel/, /youtube.com\/pagead/, /.impact\-ad./, /pubmatic.com\/AdServer\//, /\/player\/ad_break/, /\/api\/stats\/ads/, /33across/, /bat.bing/, /ad\-delivery/, /.adgrx.com\//, /ads.adthrive.com\//, /s.skimresources.com\//, /ntv.io/, /imasdk.googleapis.com\//, /pix.pub/, /mail\-ads.google.com\/mail/, /edge.api.brightcove.com/, /hotzones\/src\//, /floodlight\_global.js/, /tags.bkrtx/, /d9.flashtalking/, /servedby.flashtalking/, /mmstat.com/, /.refersion.com\/tracker\//, /\/comscore./, /.en25.com\//, /evgnet.com/, /gscontxt.net/, /vidazoo/, /quantserve/, /.grapeshot./, /-advertising\/tmg-/, /cdn.petametrics.com\//, /fastclick.net/, /dianomi.com\/js/, /hsadspixel/, /ytimg.com\/generate_204/, /google.com\/pagead/, /googlevideo.com\/generate_204/, /adform.net/, /rr2---sn-cxoqcc/, /adsales.snidigital.com\//, /javascripts\/adwords.js/, /cdn.vox-cdn.com/, /cdn.instapagemetrics.com\//, /permutive/, /js.hsadspixel.net/, /google.com\/adsense\//, /rr1---sn-vggsk/, /widget.beop.io/, /\/at.js/, /.mxcdn.net/, /yieldlove/, /nativendo/, /uimserv/, /yieldlab/, /360yield/, /c.bing/, /revcontent/, /.jwpltx.com\/v1/, /geoedge.be/, /nytimes.com\/ads/, /countess.twitch.tv/, /ttvnw.net/, /adtechus/, /yahoo.com\/info\/p.gif/, /yahoodns/, /akamaized/, /serving-sys.com\/adServingData/, /.components.video-ads/, /tracking.klaviyo.com/, /omappapi/, /nflximg/, /prod.adspsp.com/, /medyanetads/, /.gemius.pl/, /jixie.media/, /r2b2.io/, /eyeota.net/, /eyeotadtk.js/, /insurads/, /unblockia/, /tradedoubler/, /vidible.tv/, /carbonads/, /.servedby-buysellads.com/, /static.klaviyo.com/, /cdn.brandmetrics/, /ads.thesun.ie/, /snigelweb.com/, /zeus\/main.js/, /.carambo.la/, /hsleadflows/, /adpeeps/, /xapads/, /webads.nl/, /vrtzads/, /ads.vertoz/, /ads.brand.net/, /switchads/, /switchadhub/, /myswitchads/, /ayads.co/, /load.sumo/, /onetag.com/, /.clicktripz/, /tripadvisor.com\/PageMoniker/, /.visualstudio.com/, /moatad.js/, /adtechus/, /atwola/, /yahoo.com\/v2\/ads\/js/, /\/advertising.js/, /tru.am/, /static.scroll.com/, /srv.buysellads/, /confiant-integrations/, /adtech.redventures/, /.admantx.com/, /.naver.net/, /tracker.adbinead.com/, /\/\/adw.heraldm/, /ads.priel.co/, /.andbeyond.media/, /ad.yonhapnews.co/, /.adswizz./, /viglink/, /pippio/, /rezync/, /\/static\/ads.js/, /ad.daum./, /ads.revjet/, /ads.blogherads/, /ads.gemini/, /foxpush.net/, /sdk.mrf.io/, /speakol/, /gedistatic.it/, /-adzone/, /stats-dev.brid.tv/, /amp-ad-/, /amp-sticky-ad-/, /retargetly/, /richaudience/, /sync.springserve/, /loader.wisepops/, /th.bing/, /ms-ads.co/, /bing.com\/aes\/c/, /trace.mediago/, /srtb.msn.com\/notify/, /.sharethrough.com/, /w55c.net/, /gemini.yahoo/, /dyntrk/, /adkernel/, /creativecdn/, /zemanta/, /sitescout/, /smaato.net/, /openx.net/, /stackadapt.com/, /srtb.msn.com\/auction/, /fc.yahoo/, /ads\/identity/, /tags.news.com/, /delivery.adrecover/, /js\/ads.js/, /onetag-sys/, /.pubguru.net/, /automatad/, /rediffadserver/, /adscontent/,/ads.brandadvance.co/, /.affinity.c/, /cdn.adpushup/, /.ad.gt/, /kinja-static.com\/assets\/new-client\/trackers/, /ad.turn.com/, /bfmio.com/, /emxdgt.com/, /inmobi.com/, /.sonobi.com/, /smartadserver.com/, /.1rx.io/, /company-target.com/, /htlbid.js/, /fmpub.net/, /media.net/, /cpx.to/, /adzerk.net/, /firstimpression.io/, /pub.network/, /investingchannel.c/, /ay.delivery/, /ml314.c/, /admanmedia/, /.a-mo.net/, /technoratimedia.c/, /minutemedia-prebid.c/];


    
///////////////////////////////
//This script looks at all nextwork requests
    
    
var httpADSrcs = [];
var scrptADSrcs = [];
var strHTTPADMatches;
var foundHTTPADArray = [];
var httpADCount = 0;
const navAPI = performance.getEntriesByType('resource');
    
for (var i = 0; i < navAPI.length; i++) {
        httpADSrcs.push(navAPI[i].name);
}

for (var i = 0; i < adList.length; i++){
    strHTTPADMatches = httpADSrcs.filter(element => adList[i].test(element));
    foundHTTPADArray.push(strHTTPADMatches);
    httpADCount += foundHTTPADArray[i].length;

}

var httpSrcs = [];
var scrptSrcs = [];
var strHTTPMatches;
var foundHTTPArray = [];
var httpCount = 0;
    
for (var i = 0; i < navAPI.length; i++) {
        httpSrcs.push(navAPI[i].name);
}

for (var i = 0; i < analList.length; i++){
    strHTTPMatches = httpSrcs.filter(element => analList[i].test(element));
    foundHTTPArray.push(strHTTPMatches);
    httpCount += foundHTTPArray[i].length;

}
    
/*console.log(foundHTTPArray);
console.log(foundHTTPADArray);*/
    
 var totalAd = httpADCount;
    
var totalAnal = httpCount;
    
var totalTot = totalAd+totalAnal;
    
//////////////////////////////////////
    
    
    
    
    
if (totalTot === 0){  
//This script looks at script tags    
       

var scripts = document.getElementsByTagName("script");


//Analytics Scripts
var scrptSrcs = [];
var strInMatches;
var foundArray = [];
var scrptCount = 0;

    for (var i = 0; i < scripts.length; i++) {
        scrptSrcs.push(scripts[i].src);
    }
    for (var i = 0; i < analList.length; i++) {
        strInMatches = scrptSrcs.filter(element => analList[i].test(element));
        foundArray.push(strInMatches);
        scrptCount += foundArray[i].length;
    }
    
//Ad Scripts
var scrptAdSrcs = [];
var strAdMatches;
var foundAdArray = [];
var scrptAdCount = 0;

    for (var i = 0; i < scripts.length; i++) {
        scrptAdSrcs.push(scripts[i].src);
    }
    for (var i = 0; i < adList.length; i++) {
        strAdMatches = scrptAdSrcs.filter(element => adList[i].test(element));
        foundAdArray.push(strAdMatches);
        scrptAdCount += foundAdArray[i].length;
    }
    
    
////////////////////////////////////////
// Image

var imgs = document.getElementsByTagName("img");

//Analytics Imgs
var imgSrcs = [];
var strImgMatches;
var foundImgArray = [];
var imgCount = 0;

    for (var i = 0; i < imgs.length; i++) {
        imgSrcs.push(imgs[i].src);
    }
    for (var i = 0; i < analList.length; i++) {
        strImgMatches = imgSrcs.filter(element => analList[i].test(element));
        foundImgArray.push(strImgMatches);
        imgCount += foundImgArray[i].length;
    }
    
//Ad Imgs
var imgAdSrcs = [];
var strImgAdMatches;
var foundImgAdArray = [];
var imgAdCount = 0;

    for (var i = 0; i < imgs.length; i++) {
        imgAdSrcs.push(imgs[i].src);
    }
    for (var i = 0; i < adList.length; i++) {
        strImgAdMatches = imgAdSrcs.filter(element => adList[i].test(element));
        foundImgAdArray.push(strImgAdMatches);
        imgAdCount += foundImgAdArray[i].length;
    }
    
////////////////////////////////////////
// Sub Frame

var iframes = document.getElementsByTagName("iframe");

//Analytics Sub Frame
var iframeSrcs = [];
var strIframeMatches;
var foundIframeArray = [];
var iframeCount = 0;

    for (var i = 0; i < iframes.length; i++) {
        iframeSrcs.push(iframes[i].src);
    }
    for (var i = 0; i < analList.length; i++) {
        strIframeMatches = iframeSrcs.filter(element => analList[i].test(element));
        foundIframeArray.push(strIframeMatches);
        iframeCount += foundIframeArray[i].length;
    }
    
//Ad Sub Frame
    
var iFrameAdSrcs = [];
var striFrameAdMatches;
var foundiFrameAdArray = [];
var iframeAdCount = 0;

    for (var i = 0; i < iframes.length; i++) {
        iFrameAdSrcs.push(iframes[i].src);
    }
    for (var i = 0; i < adList.length; i++) {
        striFrameAdMatches = iFrameAdSrcs.filter(element => adList[i].test(element));
        foundiFrameAdArray.push(striFrameAdMatches);
        iframeAdCount += foundiFrameAdArray[i].length;
    }
    
var totalAd = iframeAdCount+imgAdCount+scrptAdCount+httpADCount;
    
var totalAnal = scrptCount+imgCount+iframeCount+httpCount;

    
var totalTot = totalAd+totalAnal;
    
    
}
    else{
        //
    }
try{    
var iframes = document.getElementsByTagName("iframe");
    
if (totalTot === 0 && iframes.length >= 1){
    
   var iframeTextAr = [];
   var foundTextMat;
   var foundTextAr = [];
   var textCount = 0;
        
    var iframeOuterHTML = document.getElementsByTagName('iframe')[0].contentWindow.document.head.outerHTML;
        
    iframeTextAr.push(iframeOuterHTML);
    
    for (var i = 0; i < analList.length; i++) {
        foundTextMat = iframeTextAr.filter(element => analList[i].test(element));
        foundTextAr.push(foundTextMat);
        textCount += foundTextAr[i].length;
    }
    
   var iframeTextArAd = [];
   var foundTextMatAd;
   var foundTextArAd = [];
   var textCountAd = 0;
        
    var iframeOuterHTML = document.getElementsByTagName('iframe')[0].contentWindow.document.head.outerHTML;
        
    iframeTextArAd.push(iframeOuterHTML);
    
    for (var i = 0; i < adList.length; i++) {
        foundTextMatAd = iframeTextArAd.filter(element => adList[i].test(element));
        foundTextArAd.push(foundTextMatAd);
        textCountAd += foundTextArAd[i].length;
    } 
    
    
/*    console.log(iframeOuterHTML);
    console.log(foundTextAr);
     console.log(foundTextArAd);*/
    
    totalAd = totalAd + textCountAd;
    
    totalAnal = totalAnal + textCount;
    
    totalTot = totalTot + textCount + totalAd;
        
    }
    
    else{
        //
    }
}
    catch(e) {
        //
    }

    
var totalString = totalTot.toString();
    
var hostURL = window.location.host;
const storedAt = Date.now();
    
var Analytics = totalAnal;
var Ads = totalAd;
 
  
/*console.log(foundHTTPArray);
console.log(foundHTTPADArray);*/

var counts = {totalAd, totalAnal, totalString, totalTot, hostURL, storedAt, Analytics, Ads, foundHTTPArray, foundHTTPADArray}

chrome.runtime.sendMessage(counts);


    
}