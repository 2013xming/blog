(function(win){
/*	var script = document.createElement("script");
	script.src = "/public/javascripts/echart/echarts-all.js";
	document.getElementsByTagName("head")[0].appendChild(script);*/
	var mycharts = function(id,chartType,chartOptions,callbackFun){
		this.echarts= win.echarts;
	};
	mycharts.prototype.createLineCharts = function(tagid,chartOptions,callbackFun) {
		// body...
		option = {
		    title : {
		        text : chartOptions.titleText,
		        subtext : chartOptions.titleSubText
		    },
		    tooltip : {
		        trigger: 'item',
		        formatter : function (params) {
		            var date = new Date(params.value[0]);
		            data = date.getFullYear() + '-'
		                   + (date.getMonth() + 1) + '-'
		                   + date.getDate(); /*+ ' '
		                   + date.getHours() + ':'
		                   + date.getMinutes();*/
		            return data + '<br/>'
		                   + params.value[1] /*+ ', ' 
		                   + params.value[2];*/
		        }
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    dataZoom: {
		        show: true,
		        start : 0
		    },
		    color:["#d23e6c",
		    	'#6495ed', '#ff7f50', '#87cefa', '#da70d6', '#32cd32',  
			    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0', 
			    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700', 
			    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0' 
		    ],
		    legend : {
		        data : [chartOptions.seriesName]
		    },
		    grid: {
//		        y2: 80
		    },
		    xAxis : [
		        {
		            type : 'time',
		            splitNumber:10
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name: chartOptions.seriesName,
		            type: 'line',
		            showAllSymbol: true,
/*		            symbolSize: function (value){
		                return Math.round(value[2]/10) + 2;
		            },*/
		            data: chartOptions.data,
		          /*  itemStyle : {
		            	normal : {
		            		lineStyle : {
		            			color:'#ff0000',
		            			width:1
		            		}
		            	}
		            }*/
		        }
		    ]
		};
		var myChart = this.echarts.init(document.getElementById(tagid));
		myChart.setOption(option);
		if(callbackFun)
			callbackFun();
		return myChart;
	};


	mycharts.prototype.createBarCharts = function(tagid,chartOptions,callbackFun) {
		option = {
		    title : {
		        text: chartOptions.titleText,
		        subtext: chartOptions.titleSubText
		    },
		    tooltip : {
		        trigger: 'axis'
		    },
		    legend: {
		        data:[chartOptions.seriesName]
		    },
		    toolbox: {
		        show : true,
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            magicType : {show: true, type: ['line', 'bar']},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    calculable : true,
		    xAxis : [
		        {
		            type : 'category',
		            axisLabel:{
		            	rotate:30
		            },
		            data : chartOptions.xAxis
		        }
		    ],
		    yAxis : [
		        {
		            type : 'value'
		        }
		    ],
		    series : [
		        {
		            name:chartOptions.seriesName,
		            type:'bar',
		            data:chartOptions.seriesData,
		            itemStyle:{
		            	normal:{
		            		label:{
		            			show:true,
		            			position:'top',
		            			textStyle:{
		            				color:'#0C0C0C'
		            			}
		            		}
		            	}
		            },
		            markPoint : {
		                data : [
		                    {type : 'max', name: '最大值'},
		                    {type : 'min', name: '最小值'}
		                ]
		            },
		            markLine : {
		                data : [
		                    {type : 'average', name: '平均值'}
		                ]
		            },
		            barMaxWidth : 30,
		        }
		    ]
		};
		var myChart = this.echarts.init(document.getElementById(tagid));
		myChart.setOption(option);
		if(callbackFun)
			callbackFun();
		return myChart;
	}

	mycharts.prototype.createMapCharts = function(tagid,chartOptions,callbackFun) {
		option = {
		    title : {
		        text: '',
		        subtext: '',
		        x:'center'
		    },
		    tooltip : {
		        trigger: 'item'
		    },
		    legend: {
		        orient: 'vertical',
		        x:'left',
		        data:['访问分布']
		    },
		    dataRange: {
		        min: 0,
//		        max: 2500,
				max: 200,
		        x: 'left',
		        y: 'bottom',
		        text:['高','低'],           // 文本，默认为数值文本
		        calculable : true
		    },
		    toolbox: {
		        show: true,
		        orient : 'vertical',
		        x: 'right',
		        y: 'center',
		        feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        }
		    },
		    roamController: {
		        show: true,
		        x: 'right',
		        mapTypeControl: {
		            'china': true
		        }
		    },
		    series : [
		        {
		            name: '访问量',
		            type: 'map',
		            mapType: 'china',
		            roam: false,
		            itemStyle:{
		                normal:{label:{show:true}},
		                emphasis:{label:{show:true}}
		            },
		            data:chartOptions.seriesData
		        }
		    ]
		};
		var myChart = this.echarts.init(document.getElementById(tagid));
		myChart.setOption(option);
		if(callbackFun)
			callbackFun();
		return myChart;
	}

	window.createCharts = mycharts;
})(window)