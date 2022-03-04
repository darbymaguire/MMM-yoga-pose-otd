// Yoga Pose of the Day
// Copied from MMM-Pokemon (https://github.com/NolanKingdon/MMM-DailyPokemon/blob/master/MMM-DailyPokemon.js) to get the framework, edits made for relevancy to my project
// Pulls a yoga pose from the JSON file created by scrape done by parsehub
// API key: tx2BgHB0WxdW
// Parsehub API docs: https://parsehub.com/docs/ref/api/v2/?javascript#get-last-ready-data

Module.register("pose_otd",{
  // Default module config
  defaults: {
    updateInterval: 86400000, // 1 Day
  	text: "Hello Yoga World!"
  },

  requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function() { // Setting up interval for refresh
		var self = this;

		setInterval(function() {
			self.updateDom();
		}, this.config.updateInterval);
	},

	getDom: function() { // Creating initial div
		var wrapper = document.createElement("div");
		wrapper.id = "pose-wrapper";
		if(this.config.stats === true){
			wrapper.style.width = "400px";
		} else {
			wrapper.style.width = "200px";
		}
		var header = document.createElement("h4");
		header.innerHTML = "Yoga Pose of the Day";
		header.id = "pose-header";

		// wrapper.appendChild(header);
		this.getData(wrapper);//Sending the request
		return wrapper;
	},

	getData: function(wrapper) { // Sends XHTTPRequest
		var self = this;

		// var apiURL = "https://pokeapi.co/api/v2/pokemon/" + pokeNumber + "/";
		var httpRequest = new XMLHttpRequest();

    // My API Get Request
    var request = require('request');

    request({
      uri: 'https://parsehub.com/api/v2/projects/thQPbcL6BP7R/last_ready_run/data',
      method: 'GET',
      gzip: true,
      qs: {
        api_key: "{YOUR_API_KEY}",
        format: "csv"
      }
    }, function(err, resp, body) {
      console.log(body);
    });

    // Their API get request
		httpRequest.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				console.log(JSON.parse(this.responseText));
				var responsePose = JSON.parse(this.responseText);
				Log.log(responsePose);
				languageHttpRequest.open("GET", 'https://parsehub.com/api/v2/projects/thQPbcL6BP7R/last_ready_run/data', true);
				languageHttpRequest.send();


				self.createContent(responsePose, wrapper);
			} else {
				return "Loading...";
			}
		}
		httpRequest.open("GET", 'https://parsehub.com/api/v2/projects/thQPbcL6BP7R/last_ready_run/data', true);
		httpRequest.send();
	},

	createContent: function(data, wrapper) { // Creates the elements for display
		var poseWrapper = document.createElement("div");
		poseWrapper.id = "pose-info";
		var flexWrapper = document.createElement("div");
		flexWrapper.id = "flex-wrapper";
		var poseName = document.createElement("p");

		poseName.innerHTML = data.name.charAt(0).toUpperCase() + data.name.slice(1) + " - #" + data.id;
		poseName.id = "pose-name";

		if(this.config.gbaMode) poseName.style.fontFamily = "'pokegb'";

		// Font size/style modification
		if(this.config.nameSize != 32) {
			if(this.config.gbaMode){
				poseName.style.cssText = "font-size:" + this.config.nameSize + "px; font-family: 'pokegb';";
			} else {
				poseName.style.cssText = "font-size:" + this.config.nameSize + "px;";
			}
		} else if(this.config.nameSize == 32) {//Changing default size if gbaMode is enabled without size changes added
			if(this.config.gbaMode){
				poseName.style.cssText = "font-size: 22px; font-family: 'pokegb';";
			}
		}

		wrapper.appendChild(poseName);

		if(this.config.genera){
			var poseSubName = document.createElement("p");

			poseSubName.id = "pose-subname";
			if(this.config.gbaMode) poseSubName.style.cssText = "font-family: 'pokegb'";
			wrapper.appendChild(poseSubName);
		}

		var posePic = document.createElement("img");
		posePic.src = data.sprites.front_default;
		posePic.id = "pose-pic";
		if(this.config.grayscale) {
			posePic.id = "pose-pic-grayscale";
		}
		poseWrapper.appendChild(posePic);

		var types = document.createElement("div");
		types.id = "pose-types";
		var type1 = document.createElement("span");
		var type1Img = document.createElement("img");
		type1Img.src = "https://serebii.net/pokedex-dp/type/" + data.types[0].type.name + ".gif"
		if(this.config.grayscale){
				type1Img.id = "pose-pic-grayscale-type"
			}
		type1.appendChild(type1Img);

		types.appendChild(type1);
		if(data.types[1]){
			var type2 = document.createElement("span");
			var type2Img = document.createElement("img");
			if(this.config.grayscale){
				type2Img.id = "pose-pic-grayscale-type"
			}
			type2Img.src = "https://serebii.net/pokedex-dp/type/" + data.types[1].type.name + ".gif"

			type2.appendChild(type2Img);
			types.appendChild(type2);
		}
		poseWrapper.appendChild(types);
		flexWrapper.appendChild(poseWrapper);
		wrapper.appendChild(flexWrapper);

		if (this.config.flavorText) {
			var flavorTextWrapper = document.createElement("div");
			flavorTextWrapper.id = "flavor-text-wrapper";

			var flavorText = document.createElement("p");
			flavorText.innerHTML = data.flavorTextDisplay ? data.flavorTextDisplay : "";
			flavorText.id = "flavor-text";

			flavorText.style.fontSize = "24px";
			flavorText.style.lineHeight = "1.5";
			if (this.config.gbaMode) {
				flavorText.style.fontFamily = "'pokegb'";
				flavorText.style.fontSize = "18px";
			}

			flavorTextWrapper.appendChild(flavorText);
			wrapper.appendChild(flavorTextWrapper);
		}
	},

	getStyles: function() {
		return [this.file('pose-otd.css')]
	},

	getTranslations: function() {
		return {
			en: "translations/en.json",
			fr: "translations/fr.json"
		}
	}
});

  	// Override dom generator.
  	getDom: function() {
  		var wrapper = document.createElement("div");
  		wrapper.innerHTML = this.config.text;
  		return wrapper;
  	}
});
