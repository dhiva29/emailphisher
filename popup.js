var numPhishyKeywordsScore = 0;
var numTyposScore = 0;
var numUnsafeLinksScore = 0;
var totalScore = 0;

chrome.storage.local.get("phishyKeywords", function(data) {
	if(data.phishyKeywords == undefined) {
		document.getElementById("numKeywords").title = "no words found";
	} else {
		if(data.phishyKeywords != "") {
			var keywords;
			try {
				keywords = data.phishyKeywords.toString();
				keywords = keywords.replace(/ /g, "");
				keywords = keywords.replace(/\,/g, ", ");
			} catch(e) {
				keywords = "";
			}
			document.getElementById("numKeywords").title = keywords;
		} else {
			document.getElementById("numKeywords").title = "no words found";
		}
	}
});


chrome.storage.local.get("numPhishyKeywords", function(data) {
	if(data.numPhishyKeywords == undefined) {
		document.getElementById("numKeywords").innerHTML = "0";
		document.getElementById("innerBarKeywords").style.width = "0%";
		document.getElementById("numKeywords").style.color = "green";
	} else {
		var barPercent = 0;
		document.getElementById("numKeywords").innerHTML = data.numPhishyKeywords;
		numPhishyKeywordsScore = data.numPhishyKeywords;
		if(data.numPhishyKeywords == 0) {
			document.getElementById("innerBarKeywords").style.width = "0%";
			document.getElementById("numKeywords").style.color = "green";
		} else {
			barPercent = data.numPhishyKeywords / 7;
			if(barPercent < 1) {
				barPercent *= 100;
			} else {
				barPercent = 100;
			}	
			document.getElementById("innerBarKeywords").style.width = barPercent.toString() + "%";

			if(barPercent <= 30) {
				document.getElementById("numKeywords").style.color = "green";
				document.getElementById("innerBarKeywords").style.backgroundColor = "green";
			} else if (barPercent > 30 && barPercent <= 70) {
				document.getElementById("numKeywords").style.color = "orange";
				document.getElementById("innerBarKeywords").style.backgroundColor = "orange";
			} else {
				document.getElementById("numKeywords").style.color = "red";
				document.getElementById("innerBarKeywords").style.backgroundColor = "red";
			}
		}
	}
});

chrome.storage.local.get("typos", function(data) {
	if(data.typos == undefined) {
		document.getElementById("numTypos").title = "no typos found";
	} else {
		if(data.typos != "") {
			var typos;
			try {
				typos = data.typos.toString();
				typos = typos.replace(/ /g, "");
				typos = typos.replace(/\,/g, ", ");
			} catch(e) {
				typos = "no typos found";
			}
			document.getElementById("numTypos").title = typos;	
		} else {
			document.getElementById("numTypos").title = "no typos found";
		}
	}
});


chrome.storage.local.get("numTypos", function(data) {
	if(data.numTypos == undefined) {
		document.getElementById("numTypos").innerHTML = "0";
		document.getElementById("innerBarTypos").style.width = "0%";
		document.getElementById("numTypos").style.color = "green";
	} else {
		var barPercent = 0;
		document.getElementById("numTypos").innerHTML = data.numTypos;
		numTyposScore = data.numTypos;
		if(data.numTypos == 0) {
			document.getElementById("innerBarTypos").style.width = "0%";
			document.getElementById("numTypos").style.color = "green";
		} else {
			barPercent = data.numTypos / 10;
			if(barPercent < 1) {
				barPercent *= 100;
			} else {
				barPercent = 100;
			}	
			document.getElementById("innerBarTypos").style.width = barPercent.toString() + "%";

			if(barPercent <= 30) {
				document.getElementById("numTypos").style.color = "green";
				document.getElementById("innerBarTypos").style.backgroundColor = "green";
			} else if (barPercent > 30 && barPercent <= 70) {
				document.getElementById("numTypos").style.color = "orange";
				document.getElementById("innerBarTypos").style.backgroundColor = "orange";
			} else {
				document.getElementById("numTypos").style.color = "red";
				document.getElementById("innerBarTypos").style.backgroundColor = "red";
			}
		}
	}
});


chrome.storage.local.get("unsafeLinks", function(data) {
	if(data.unsafeLinks == undefined) {
		document.getElementById("numUnsafeLinks").title = "no unsafe links found";
	} else {
			if(data.unsafeLinks != "") {
			var links;
			try {
				links = data.unsafeLinks.toString();
				links = links.replace(/ /g, "");
				links = links.replace(/\,/g, ", ");
				links = "(" + links + ")";
			} catch(e) {
				links = "";
			}
			document.getElementById("numUnsafeLinks").title = links;	
		} else {
			document.getElementById("numUnsafeLinks").title = "no unsafe links found";
		}
	}
});



chrome.storage.local.get("numUnsafeLinks", function(data) {
	if(data.numUnsafeLinks == undefined) {
		document.getElementById("numUnsafeLinks").innerHTML = "0";
		document.getElementById("numUnsafeLinks").style.color = "green";
		document.getElementById("numUnsafeLinks").title = "no unsafe links found";
	} else {
		document.getElementById("numUnsafeLinks").innerHTML = data.numUnsafeLinks;
		numUnsafeLinksScore = data.numUnsafeLinks;
		if(data.numUnsafeLinks == 0) {
			document.getElementById("numUnsafeLinks").style.color = "green";
			document.getElementById("numUnsafeLinks").title = "no unsafe links found";
		} else {
			document.getElementById("numUnsafeLinks").style.color = "red";
		}
	}
});


chrome.storage.local.get("phishyKeywords", function(data) {
	if(data.phishyKeywords == undefined) {
		document.getElementById("scoreText").innerHTML = "Highlight some text and then click this icon again!";
	} else {
		if(numPhishyKeywordsScore >= 7) {
			numPhishyKeywordsScore = 60;
		} else {
			numPhishyKeywordsScore = (numPhishyKeywordsScore / 7) * 60;
		}
		if(numTyposScore >= 10) {
			numTyposScore = 19;
		} else {
			numTyposScore = (numTyposScore / 10) * 19;
		}
		if(numUnsafeLinksScore >= 3) {
			numUnsafeLinksScore = 19;
		} else {
			numUnsafeLinksScore = (numUnsafeLinksScore / 3) * 19;
		}	
		totalScore = numPhishyKeywordsScore + numTyposScore + numUnsafeLinksScore;
		totalScore = Math.round(totalScore);
		if(totalScore == 0) {
			document.getElementById("scoreText").innerHTML ="There is a 2% chance that this email is phishing.";
		} else {
			document.getElementById("scoreText").innerHTML ="There is a " + totalScore + "% chance that this email is phishing.";	
		}
	}
});


chrome.storage.local.get("unhighlightText", function(data) {
	if(data.unhighlightText == "Yes") {
		document.getElementById("scoreText").innerHTML = "Highlight some text and then click this icon again!";
	} else { }
});














