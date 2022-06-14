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
  /rmtag/, /impactradius\-event/, /bytedance/, /sprig/, /userleap/, /bat\.bing/, /adservice\.google/, /googleadservices/, /geoedge/, /taboola/, /ads\-twitter/, /sleeknote/, /pushcrew/, /onesignal/, /amazon\-adsystem/, /amplify\-outbrain/, /dianomi/, /s\-onetag/, /ads\.pubmatic/, /adroll/, /adnxs/, /crwdcntrl/, /redditstatic/, /ads.\linkedin/, /moatads/, /criteo/, /adlightning/, /turner\.com\/ads/, /quantserve/, /rubiconproject/, /mpulse/, /\.demex\.net\//, /gateway\.foresee\.com/, /\.scene7/, /googletagservices/, /analytics\.yahoo\.com/, /doubleverify/, /imrworldwide/, /analytics\.twitter/, /adsafeprotected/, /sc\-static/, /bidswitch/, /widgets\-outbrain/, /connect\.facebook\.net/, /igodigital/, /api\-segment/, /ad\-delivery/, /pix\.pub/, /nr\-data/, /c\.lytics/, /indexww/, /p1\.parsely/, /omtrdc/, /curalate/, /richrelevance/, /cquotient/, /api\.drift/, /app\.dynamics/, /pixel\.wp/, /s7\.addthis/, /webtrendslive/, /googleoptimize/, /px\-cloud\.net/, /liveperson/, /tamgrt/, /\.forter/, /\.piwik\.pro/, /3gl\.net/, /btttag/, /crwdcntrl\.net/, /exelator/, /helpscout/, /platform\.twitter/, /px\.ads\.linkedin/, /linkedin\.com\/li\/track/, /tvsquared/, /fullstory/, /powerreviews/, /mouseflow/, /brightcove/, /beacon\.walmart\.com/, /mathtag/, /\/clickstream\//, /\/gauge\/link\//, /\/gauge\/pageview\//, /adsrvr/, /bs\.serving\-sys/, /teads\.tv/, /tvpixel/, /monetate/, /dyntrace/, /custhelp/, /answerscloud/, /yotpo/, /kampyle/, /webcollage/, /salsify\-ecdn/, /ct\.pintrest/, /soptimize\.southwest/, /flashtalking/, /innovid/, /facebook\.com\/tr/, /everesttech/, /r\.turn/, /ads\.linkedin/, /content\.mink/, /siteimproveanalytics/, /newscgp/, /permutive/, /js\+ssdomvar\.js\+generic/, /apps\.bazaarvoice/, /snowplowanalytics/, /6sc\.co/, /bluekai/, /tapad/, /casalemedia/, /usabilla/, /xg4ken/, /api\.amplitude/, /\/b\/ss\//, /quantummetric/, /\/wt\.pl\?/, /spotxchange/, /mookie1/];


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
    
    
    var scriptStr = scrptCount.toString();
       
    /*console.log(count);
    console.log(foundArray); */
    

var counts = {scrptCount, scriptStr}

chrome.runtime.sendMessage(counts);
    
}