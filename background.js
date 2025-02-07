var regex = /( irs | urgently | urgent | suspended | suspend | suspicious | expiring | expired | expire | inactivity | inactive | activity | activate | reactivate | clicking | click | download | login | log-in | logging | log | important | password | validate | account | verified | verify | terminated | termination | detected | required | requires | require | secure | link | noticed | notice | update | upgrade | temporarily | temporary | ban | access | redirected | redirect | immediately | immediate | vital | sign-in | sign-up | signed | sign | attachment | attached | attach | responded | respond | response | limited | limit | irregular | review | view | go | profile | file | received | receive | sent | help | continue | protected | protection | protect | open | regain | gain | contact )/g;

var linkRegex = /(([a-z]+:\/\/)?(([a-z0-9\-]+\.)+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel|local|internal))(:[0-9]{1,5})?(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-zA-Z0-9!$&'()*+.=-_~:@/?]*)?)(\s+|$)/gi

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request.message = "text") {
    	chrome.storage.local.clear();
    	console.log(request.data);
    	var selWithoutLinks = checkLinks(request.data);
    	parseDomForPhishyKeywords(selWithoutLinks);
    	checkForTypos(selWithoutLinks);
    }
});

function parseDomForPhishyKeywords(highlightedText) {
	highlightedText.toLowerCase();
	
	try {
		highlightedText = highlightedText.replace(/\./g, " ");
		highlightedText = highlightedText.replace(/\,/g, " ");
		highlightedText = highlightedText.replace(/\(/g, " ");
		highlightedText = highlightedText.replace(/\)/g, " ");
		highlightedText = highlightedText.replace(/\//g, " ");
		highlightedText = highlightedText.replace(/\:/g, " ");
		highlightedText = highlightedText.replace(/\</g, " ");
		highlightedText = highlightedText.replace(/\>/g, " ");
	} catch (e) {
		console.log(e);
	}

	var matches = highlightedText.match(regex);
	if(matches == null) {
		matches = [];
	}
	if(matches != null) {
		console.log(matches.toString());
		console.log(matches.length);
		chrome.storage.local.set({"phishyKeywords":matches.toString()});
		chrome.storage.local.set({"numPhishyKeywords":matches.length});
	} else {
		console.log("NO MATCHES");
		console.log(0);
		chrome.storage.local.set({"phishyKeywords":matches.toString()});
		chrome.storage.local.set({"numPhishyKeywords":0});
	}
	
}

function checkForTypos(highlightedText) {
	try {
		highlightedText = highlightedText.replace(/\(/g, " ");
		highlightedText = highlightedText.replace(/\)/g, " ");
		highlightedText = highlightedText.replace(/\//g, " ");
		highlightedText = highlightedText.replace(/\:/g, " ");
		highlightedText = highlightedText.replace(/\</g, " ");
		highlightedText = highlightedText.replace(/\>/g, " ");
		highlightedText = highlightedText.replace(/\%/g, " ");
		highlightedText = highlightedText.replace(/\$/g, " ");
		highlightedText = highlightedText.replace(/ /g, "%20");
		highlightedText = highlightedText.replace(/\n/g, "%20");
	} catch (e) {
		console.log(e);
	}
 	
	console.log(highlightedText);

	fetch("https://montanaflynn-spellcheck.p.rapidapi.com/check/?text=" + highlightedText, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "montanaflynn-spellcheck.p.rapidapi.com",
				"x-rapidapi-key": "insert your key"
			}
	})
	.then(response => {
		response.json().then(data => {
			try {
				chrome.storage.local.set({"unhighlightText":"No"});
				console.log(data.corrections);
				console.log(Object.keys(data.corrections).length + " typos");
				chrome.storage.local.set({"typos":Object.keys(data.corrections)});
				chrome.storage.local.set({"numTypos":Object.keys(data.corrections).length});
			} catch(e) {
				chrome.storage.local.set({"unhighlightText":"Yes"});
				chrome.storage.local.set({"typos":""});
				chrome.storage.local.set({"numTypos":0});
				console.log(e);
			}
		});


	})
	.catch(err => {
		console.log(err);
	});
}

function checkLinks(highlightedText) {
	highlightedText.toLowerCase();
	try {
		highlightedText = highlightedText.replace(/\</g, " ");
		highlightedText = highlightedText.replace(/\>/g, " ");
	} catch (e) {
		console.log(e);
	}

	var unsafeLinks = [];

	var linkMatches = highlightedText.match(linkRegex);
	if(linkMatches == null) {
		linkMatches = [];
		chrome.storage.local.set({"numUnsafeLinks":0});
	}
	if(linkMatches != null) {
		console.log(linkMatches.toString());
		console.log("NUMBER OF LINKS: " + linkMatches.length);

		var numUnsafeLinks = 0;
		for(i = 0; i < linkMatches.length; i++) {
			var trimmedLink = linkMatches[i].trim();
			var msg = {
        		"client": {
        			"clientId":      "Brandon And Siraaj Project",
        			"clientVersion": "1.5.2"
        		},
        		"threatInfo": {
        			"threatTypes":      ["MALWARE", "SOCIAL_ENGINEERING"],
        			"platformTypes":    ["WINDOWS"],
        			"threatEntryTypes": ["URL"],
        			"threatEntries": [
        			{"url": trimmedLink}
      				]
    			}
  			}
			fetch(" use https://safebrowsing.googleapis.com and get your own API KEY", {
				"method": "POST",
				"headers": {
					"Content-Type": "application/json"
				},
				"body": JSON.stringify(msg)
			})
			.then(response => {
				response.json().then(data => {
					try {
						if(data.matches == undefined) {
							console.log("SAFE");
						} else {
							console.log("UNSAFE");
							numUnsafeLinks++;
							unsafeLinks.push(data.matches[0].threat.url);
						}
						chrome.storage.local.set({"numUnsafeLinks":numUnsafeLinks});
						chrome.storage.local.set({"unsafeLinks":unsafeLinks.toString()});
					} catch(e) {
						console.log(e);
					}
				});
			})
			.catch(err => {
				console.log(err);
			});
		}

		for(i = 0; i < linkMatches.length; i++) {
			highlightedText = highlightedText.replace(linkMatches[i], " ");
		}
	} else {
		console.log("NO LINKS FOUND");
		console.log("NUMBER OF LINKS: " + "0");
	}

	return highlightedText;
}


