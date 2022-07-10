
chrome.runtime.onMessage.addListener(msg=> {
    if (document.readyState === 'complete') {
        blockerFunction();
        setInterval(blockerFunction, 2000);
    } else {
        window.addEventListener('load', blockerFunction);
    }
});


function blockerFunction(){

    
///////////////////////////////////////////////////////
//Analytics Tracker Checker    

const analList = [/google\-analytics/,/googletagmanager/,/connect\.facebook\.net/,/clarity\.ms/,
/go\-mpulse/,/analytics\.tiktok/,/quantcount/, /snap\.licdn/, /analytics\.similarweb/, /hotjar/, /pardot/,
/newrelic/, /foresee/, /smetrics\./, /tms\./, /crazyegg/, /boomtrain/
, /cdn\.turner/, /optimizely/, /bounceexchange/, /visualime/, /tags\.tiqcdn/, /tealiumiq/,
/adobedtm/, /qualaroo/, /clicktale/, /funnelenvy/, /edge\.fullstory/, /tvsquared/, /heapanalytics/,
 /thebrighttag/, /s\.btstatic/, /raygun/, /ac\-target/, /demdex/, /utag/, /iperceptions/, /techtarget/, /bizible/,
 /6sc\.co/, /demandbase/, /engagio/, /akamai/, /qualtrics/, /rubiconproject/, /s\.yimg/,
  /cdn\.segment/, /marinsm/, /googlesyndication/, /chartbeat/, /gstatic/, /rlcdn/, /sojern/,
  /rmtag/, /impactradius\-event/, /bytedance/, /sprig/, /userleap/, /taboola/, /sleeknote/, /pushcrew/, /onesignal/, /amplify\-outbrain/, /dianomi/, /s\-onetag/, /crwdcntrl/, /redditstatic/, /quantserve/, /rubiconproject/, /mpulse/, /\.demex\.net\//, /gateway\.foresee\.com/, /\.scene7/, /googletagservices/, /analytics\.yahoo\.com/, /doubleverify/, /\.imrworldwide\./, /analytics\.twitter/, /bidswitch/, /widgets\-outbrain/, /connect\.facebook\.net/, /igodigital/, /api\-segment/, /pix\.pub/, /nr\-data/, /c\.lytics/, /indexww/, /p1\.parsely/, /omtrdc/, /curalate/, /richrelevance/, /cquotient/, /api\.drift/, /app\.dynamics/, /pixel\.wp/, /s7\.addthis/, /webtrendslive/, /googleoptimize/, /px\-cloud\.net/, /liveperson/, /tamgrt/, /\.forter/, /piwik/, /3gl\.net/, /btttag/, /crwdcntrl\.net/, /exelator/, /helpscout/, /platform\.twitter/, /linkedin\.com\/li\/track/, /tvsquared/, /fullstory/, /powerreviews/, /mouseflow/, /brightcove/, /beacon\.walmart\.com/, /mathtag/, /\/clickstream\//, /\/gauge\/link\//, /\/gauge\/pageview\//, /bs\.serving\-sys/, /dyntrace/, /custhelp/, /answerscloud/, /yotpo/, /kampyle/, /webcollage/, /salsify\-ecdn/, /ct\.pintrest/, /soptimize\.southwest/, /innovid/, /facebook\.com\/tr/, /everesttech/, /r\.turn/, /content\.mink/, /siteimproveanalytics/, /newscgp/, /permutive/, /js\+ssdomvar\.js\+generic/, /snowplowanalytics/, /6sc\.co/, /bluekai/, /usabilla/, /xg4ken/, /api\.amplitude/, /\/b\/ss\//, /quantummetric/, /\/wt\.pl\?/, /spotxchange/, /mookie1/, /\/glassbox\/reporting\//, /\/ga\/gtag\.js/, /\/plugins\/like\.php/, /maxymiser\.net\//, /visualwebsiteoptimizer/, /d\.turn/, /branch\.io/, /res\-x/, /narrativ/, /dcf\.espn/, /bluecore/, /yjtag\.yahoo/, /ruxitagent/, /plausible\.io\/js/, /jscache/, /acuityplatform/, /cloudfront\.net\/form\-serialize/, /mr\.homedepot/, /static\/js\/t\.js/, /dotmetrics\.net/, /hit\.xiti/, /plusone\.js/, /kaltura/, /tagcommander/, /boomerang\.js/, /techlab\-cdn/, /3lift/, /searchiq/, /\/js\/tealeaf/, /appboy\.com\/api/, /sharethis\.com/, /bizible/, /getclicky\.com\/js/, /track\.securedvisit/, /online\-metrix/, /dynamicyield/, /yottaa/, /atgvcs/, /agkn\.com/, /t\.co\//, /data\.microsoft/, /quantcast/, /cdn\.pdst/, /sgtm/, /owneriq/, /shoprunner/, /osano/, /gigya/, /log\.pinterest/, /hubspot/, /pinimg/, /\/opinionlab\//, /merkle\_track/, /ensighten/, /alexametrics/, /tr\.snapchat/, /c\.msn/, /keywee/, /bizographics\.com\/collect/, /omnitagjs/, /yandex\.ru\/metrika\//, /evidon\-sitenotice\-tag\.js/, /dotomi/, /lijit/, /bluecava/, /data\.pendo\.io/, /heapanalytics/, /certona/, /sail\-horizon\.com\/spm/, /\.gumgum\.com/, /mparticle/, /privy\.com\/collect/, /abtasty/, /dwin1/, /shopifycdn/, /uplift\-platform/, /w55c/, /liadm/, /sddan/, /sundaysky/, /\/atrk\.js/, /\/kinesis/, /zdassets/, /rfihub/, /ex\.co/, /\/launch\/launch\-/, /\.com\/id\?d\_visid\_ver/, /marketo/, /simpleanalyticscdn\.com/, /cdn\.amplitude/, /ki\.js/, /youtube.com\/ptracking/, /youtube\.com\/pcs\/parallelactiveview/, /youtube.com\/api\/stats\/playback\//, /youtube.com\/pcs\/activeview/, /googleusercontent.com\/proxy\//, /cdn\.yottaa\.com\/rapid/, /cdn\.matomo\./, /cdn\.pbbl\.co/, /oracleinfinity/, /t\.paypal\.com\/ts/, /paypalobjects\.com\/muse\//, /cdn\.onthe\.io\//, /matomo\.js/, /js\.taplytics/, /facebook.com\/tr/, /\/\/webanalytics\./, /bugherd\.com\/sidebarv2/, /tag\.segmetrics\.io/, /pixel\.condenastdigital\.com/, /segment\-data\.zqtk\.net/, /cloudfront\.net\/p\.js/, /capture\.condenastdigital\.com\/track/, /nielsen\.js/];
    
    
const adList = [/doubleclick/, /scorecardresearch/, /krxd\.net/, /adservice\.google/, /googleadservices/, /geoedge/, /ads\-twitter/, /amazon\-adsystem/, /ads\.pubmatic/, /adroll/, /adnxs/, /ads.\linkedin/, /moatads/, /criteo/, /adlightning/, /turner\.com\/ads/, /adsafeprotected/, /sc\-static/, /px\.ads\.linkedin/, /adsrvr/, /monetate/, /apps\.bazaarvoice/, /tapad/, /casalemedia/, /ads\.stickyadstv/, /pubmatic\.com\/AdServer/, /ispot\.tv/, /fwmrm\.net\/ad/, /cxense/, /adsymptotic/, /yahoo\.com\/admax/, /\.brsrvr/, /advertising/, /ad\.360yield/, /ad\.wsod/, /teads\.tv/, /tvpixel/, /www\.youtube\.com\/pagead/, /.impact\-ad./, /pubmatic.com\/AdServer\//, /\/player\/ad_break/, /\/api\/stats\/ads/, /33across/, /bat\.bing/, /ad\-delivery/, /\.adgrx\.com\//, /ads\.adthrive\.com\//, /s\.skimresources\.com\//, /\.ntv\.io/, /imasdk\.googleapis\.com\//, /pix\.pub/, /mail\-ads\.google\.com\/mail/, /edge\.api\.brightcove\.com/, /hotzones\/src\//, /floodlight\_global\.js/, /tags\.bkrtx/, /d9\.flashtalking/, /servedby\.flashtalking/];


    
////////////////////////////////
    
    
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
    
 var totalAd = httpADCount;
    
var totalAnal = httpCount;
    
var totalTot = totalAd+totalAnal;
    
//////////////////////////////////////
    
    
    

    
    
if (totalTot == 0){
       

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

/*console.log(foundAdArray);
console.log(scrptAdCount);*/
    
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
    
////////////////////////////////////////////////////
//xmlhttprequest Analytics
    
    
var httpSrcs = [];
var scrptSrcs = [];
var strHTTPMatches;
var foundHTTPArray = [];
var httpCount = 0;

const navAPI = performance.getEntriesByType('resource');
    
for (var i = 0; i < navAPI.length; i++) {
    if ((navAPI[i].initiatorType == "xmlhttprequest")){
        httpSrcs.push(navAPI[i].name);
    }
}

for (var i = 0; i < analList.length; i++){
    strHTTPMatches = httpSrcs.filter(element => analList[i].test(element));
    foundHTTPArray.push(strHTTPMatches);
    httpCount += foundHTTPArray[i].length;

}   
    
    
    
 ////////////////////////////////////////////////////
//xmlhttprequest ADs
    
    
var httpADSrcs = [];
var scrptADSrcs = [];
var strHTTPADMatches;
var foundHTTPADArray = [];
var httpADCount = 0;
    
for (var i = 0; i < navAPI.length; i++) {
    if ((navAPI[i].initiatorType == "xmlhttprequest")){
        httpADSrcs.push(navAPI[i].name);
    }
}

for (var i = 0; i < adList.length; i++){
    strHTTPADMatches = httpADSrcs.filter(element => adList[i].test(element));
    foundHTTPADArray.push(strHTTPADMatches);
    httpADCount += foundHTTPADArray[i].length;

} 
    



var totalAd = iframeAdCount+imgAdCount+scrptAdCount+httpADCount;
    
var totalAnal = scrptCount+imgCount+iframeCount+httpCount;

    
var totalTot = totalAd+totalAnal;
    
    
    
}

    
var totalString = totalTot.toString()
       
    /*console.log(count);
    console.log(foundArray); */
    

var counts = {totalAd, totalAnal, totalString, totalTot}

chrome.runtime.sendMessage(counts);
    
}