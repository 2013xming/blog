;(function(){
	var maskLayer = function(tagid,option){
		this.tagDiv = document.getElementById(tagid);
		this.backgroundImg = option ? option.backgroundImg : undefined;
		this.backgroundColor = option ? option.backgroundColor : undefined;
		this.width = this.tagDiv.offsetWidth;
		this.height = this.tagDiv.offsetHeight;
		this.text = option ? (option.text || "") : undefined;
		this.opacity = option ? option.opacity : undefined;
		this.maskLayer = document.createElement("div");

	};
	maskLayer.prototype.initLayer = function(){
		if(this.tagDiv.style.position == "static"){
			this.tagDiv.style.position == "relative";
		}
		this.maskLayer.style.backgroundColor = this.backgroundColor || "#E8E7E3";
		if(this.backgroundImg){
			this.maskLayer.backgroundImgUrl = this.backgroundImgUrl;
		}
		this.maskLayer.style.position = "absolute";
		this.maskLayer.style.width = this.width;
		this.maskLayer.style.height = this.height;
		this.maskLayer.appendChild(new loading(this.maskLayer).loadingEle);
		this.maskLayer.style.opacity = this.opacity || 0.7;
//		var testdiv = document.getElementsByClassName("title-bar")[0];
		this.tagDiv.appendChild(this.maskLayer);
	}
	maskLayer.prototype.hide = function(){
		this.maskLayer.style.display = "none";
	}
	var loading = function(layer){
		this.loadingEle = document.createElement("div");
		this.loadingImg = document.createElement("img");
		this.loadingText = document.createElement("span");
		this.loadingImg.src = "/public/javascripts/self/loading.gif";
		this.loadingEle.style.position = "absolute";
		/*this.loadingEle.style.width = 
		this.loadingEle.style.height = "";*/
		this.loadingEle.style.left = "45%";
		this.loadingEle.style.top = "45%";
		this.loadingEle.appendChild(this.loadingImg);
		this.loadingText.innerText = "loading...";
		this.loadingEle.appendChild(this.loadingText);
	}
	window.maskLayer = maskLayer;
})();
