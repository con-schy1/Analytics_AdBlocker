//console.log('<----- Content script started running ----->');

chrome.runtime.onMessage.addListener(msg=> {
    if (document.readyState === 'complete') {
        blockerFunction();
    } else {
        window.addEventListener('load', blockerFunction);
    }
});


function blockerFunction(){

    
///////////////////////////////////////////////////////
//Analytics Tracker Checker    

const regex1List = [/google\-analytics/,/googletagmanager/,/marketo/,/doubleclick/
,/scorecardresearch/,/connect\.facebook\.net/,/clarity\.ms/,
/go\-mpulse/,/analytics\.tiktok/,/quantcount/, /snap\.licdn/, /analytics\.similarweb/, /hotjar/, /pardot/,
/newrelic/, /foresee/, /smetrics\./, /tms\./, /crazyegg/, /krxd\.net/, /boomtrain/
, /cdn\.turner/, /optimizely/, /bounceexchange/, /visualime/, /tags\.tiqcdn/, /tealiumiq/,
/adobedtm/, /qualaroo/, /clicktale/, /funnelenvy/, /edge\.fullstory/, /tvsquared/, /heapanalytics/,
 /thebrighttag/, /s\.btstatic/, /raygun/, /ac\-target/, /demdex/, /utag/, /iperceptions/, /techtarget/, /bizible/,
 /6sc\.co/, /demandbase/, /engagio/, /akamai/, /qualtrics/, /rubiconproject/, /s\.yimg/,
  /cdn\.segment/, /marinsm/, /googlesyndication/, /chartbeat/, /gstatic/, /rlcdn/, /sojern/,
  /rmtag/, /impactradius\-event/, /bytedance/, /sprig/, /userleap/, /bat\.bing/, /adservice\.google/, /googleadservices/, /geoedge/, /taboola/, /ads\-twitter/, /sleeknote/, /pushcrew/, /onesignal/, /amazon\-adsystem/, /amplify\-outbrain/, /dianomi/, /s\-onetag/, /ads\.pubmatic/, /adroll/, /adnxs/, /crwdcntrl/, /redditstatic/, /ads.\linkedin/, /moatads/, /criteo/, /adlightning/, /turner\.com\/ads/, /quantserve/, /rubiconproject/, /mpulse/, /\.demex\.net\//, /gateway\.foresee\.com/, /\.scene7/, /googletagservices/, /analytics\.yahoo\.com/, /doubleverify/, /imrworldwide/, /analytics\.twitter/, /adsafeprotected/, /sc\-static/, /bidswitch/, /widgets\-outbrain/, /connect\.facebook\.net/, /igodigital/, /api\-segment/, /ad\-delivery/, /pix\.pub/, /nr\-data/, /c\.lytics/, /indexww/, /p1\.parsely/, /omtrdc/, /curalate/, /richrelevance/, /cquotient/, /api\.drift/, /app\.dynamics/, /pixel\.wp/, /s7\.addthis/, /webtrendslive/, /googleoptimize/, /px\-cloud\.net/, /liveperson/, /tamgrt/, /\.forter/, /piwik/, /3gl\.net/, /btttag/, /crwdcntrl\.net/, /exelator/, /helpscout/, /platform\.twitter/, /px\.ads\.linkedin/, /linkedin\.com\/li\/track/, /tvsquared/, /fullstory/, /powerreviews/, /mouseflow/, /brightcove/, /beacon\.walmart\.com/, /mathtag/, /\/clickstream\//, /\/gauge\/link\//, /\/gauge\/pageview\//, /adsrvr/, /bs\.serving\-sys/, /teads\.tv/, /tvpixel/, /monetate/, /dyntrace/, /custhelp/, /answerscloud/, /yotpo/, /kampyle/, /webcollage/, /salsify\-ecdn/, /ct\.pintrest/, /soptimize\.southwest/, /flashtalking/, /innovid/, /facebook\.com\/tr/, /everesttech/, /r\.turn/, /ads\.linkedin/, /content\.mink/, /siteimproveanalytics/, /newscgp/, /permutive/, /js\+ssdomvar\.js\+generic/, /apps\.bazaarvoice/, /snowplowanalytics/, /6sc\.co/, /bluekai/, /tapad/, /casalemedia/, /usabilla/, /xg4ken/, /api\.amplitude/, /\/b\/ss\//, /quantummetric/, /\/wt\.pl\?/, /spotxchange/, /mookie1/, /\/glassbox\/reporting\//, /\/ga\/gtag\.js/, /\/plugins\/like\.php/, /maxymiser\.net\//, /visualwebsiteoptimizer/, /d\.turn/, /ads\.stickyadstv/, /branch\.io/, /res\-x/, /narrativ/, /pubmatic\.com\/AdServer/, /ispot\.tv/, /dcf\.espn/, /bluecore/, /yjtag\.yahoo/, /ruxitagent/, /plausible\.io\/js/, /jscache/, /acuityplatform/, /cloudfront\.net\/form\-serialize/, /mr\.homedepot/, /static\/js\/t\.js/, /fwmrm\.net\/ad/, /dotmetrics\.net/, /hit\.xiti/, /plusone\.js/, /kaltura/, /tagcommander/, /boomerang\.js/, /techlab\-cdn/, /3lift/, /searchiq/, /\/js\/tealeaf/, /appboy\.com\/api/, /sharethis\.com/, /bizible/, /getclicky\.com\/js/, /track\.securedvisit/, /online\-metrix/, /dynamicyield/, /yottaa/, /atgvcs/, /agkn\.com/, /t\.co\//, /data\.microsoft/, /quantcast/, /cdn\.pdst/, /sgtm/, /flashtalking/, /owneriq/, /shoprunner/, /cxense/, /osano/, /gigya/, /log\.pinterest/, /hubspot/, /pinimg/, /\/opinionlab\//, /\.brsrvr/, /merkle\_track/, /ensighten/, /alexametrics/, /tr\.snapchat/, /c\.msn/, /advertising/, /keywee/, /bizographics\.com\/collect/, /adsymptotic/, /yahoo\.com\/admax/, /omnitagjs/, /yandex\.ru\/metrika\/a/, /evidon\-sitenotice\-tag\.js/, /dotomi/, /lijit/, /bluecava/, /data\.pendo\.io/, /heapanalytics/, /certona/, /sail\-horizon\.com\/spm/, /\.gumgum\.com/, /33across/, /mparticle/, /privy\.com\/collect/, /abtasty/, /dwin1/, /shopifycdn/, /uplift\-platform/, /w55c/, /liadm/, /sddan/, /sundaysky/, /\/atrk\.js/, /\/kinesis/, /zdassets/, /rfihub/, /ad\.360yield/, /ad\.wsod/, /ex\.co/];


var scripts = document.head.getElementsByTagName("script");



var scrptSrcs = [];
var strInMatches;
var foundArray = [];
var scrptCount = 0;

    for (var i = 0; i < scripts.length; i++) {
        scrptSrcs.push(scripts[i].src);
    }
    for (var i = 0; i < regex1List.length; i++) {
        strInMatches = scrptSrcs.filter(element => regex1List[i].test(element));
        foundArray.push(strInMatches);
        scrptCount += foundArray[i].length;
    }
//var scriptStr = scrptCount.toString();    
    
////////////////////////////////////////
// Image

var imgs = document.getElementsByTagName("img");

var imgSrcs = [];
var strImgMatches;
var foundImgArray = [];
var imgCount = 0;

    for (var i = 0; i < imgs.length; i++) {
        imgSrcs.push(imgs[i].src);
    }
    for (var i = 0; i < regex1List.length; i++) {
        strImgMatches = imgSrcs.filter(element => regex1List[i].test(element));
        foundImgArray.push(strImgMatches);
        imgCount += foundImgArray[i].length;
    }
    
 var total = scrptCount+imgCount;
    
var totalString = total.toString()
       
    /*console.log(count);
    console.log(foundArray); */
    

var counts = {total, totalString}

chrome.runtime.sendMessage(counts);
    
}