'use strict';

angular.module('sapience.charts').controller('dashboardController', ['$rootScope', '$scope', '$http', '$filter', function($rootScope, $scope, $http, $filter) {
    $http.get('sapience/metrics').success(function(data) {
    	$scope.mainMetrics=[];
    	$scope.mainMetrics=data;
    	console.log('Main metrics data is : '+$scope.mainMetrics);
    });
    
    $scope.section1=false;
    $scope.section2=false;
    $scope.section3=false;
    
 // List of Categories
    $scope.cateogories=[];
    
 // List of Product Selected
    $scope.applicationList=[];
    
    $scope.spiderChartModel = {};
    $scope.lineChartModel = {};
    $scope.spiderChartModel.expectedSeries = {name: 'Expected', data: []};
    $scope.lineChartModel.expectedSeries = {name: 'Expected', data: []};
 
    $rootScope.$on('productSelection', function(event, application) {
    	
    	if($scope.applicationList==''){

    	    
    	    $scope.cateogories= [{
    			
    	        'value': 'Code Quality',
    	        'selected':false,
    	        'connectorId': '531be23471154d0000b07505,533e2a5bb34b99201ee85345' // code quality for Clover or Sonar connectors
    	    },{
    	    	
    	        'value': 'Project Tracking',
    	        'selected':false,
    	        'connectorId': '533a3dfef48d45e41873a7a9' // project Tracking for Jenkin connector
    	    },{
    	    	
    	        'value': 'Defect Metrics',
    	        'selected':false,
    	        'connectorId': '531be20171154d0000b07504' // defect metrics for Jira connector
    	    }];
    	}
    	
    	application.selected = !application.selected;

    	if(application.selected){
    		
    	$scope.applicationList.push(application.name);
    	
    	}else{
    		
    		$scope.applicationList.splice($scope.applicationList.indexOf(application.name), 1);
    	}
    	
    	console.log('Selected Products are : '+$scope.applicationList);
    	
    	if($scope.cateogories!=''){
    		
    		$scope.cateogories.forEach(function(category){
    			if(category.selected){
    				 // direct fetch graph by product (FGBP) , when category is alreay selected then check the product
    				$scope.applicationSelected(category,'directFGBP');
    			}
    		});
    		
    	}
    	
    	
    });
    
    $scope.applicationSelected=function(application,fetchBy) {
    	
    	console.log('selected Category is : '+application.value);
    	
   	 	$scope.spiderApplicationSeries = [];
		$scope.lineApplicationSeries = [];
		   
		 $scope.metricData = {};
		 // List of dated
		 $scope.dateWiseMetricData={};
		 
		 $scope.spiderChartModel.categories = [];
		 $scope.lineChartModel.categories = [];
		 var repeat=0;
		 var nonRepeative=0;
		 
		 $scope.mainMetrics.forEach(function(metric) {
			 var selectedConnectors=application.connectorId.split(',');
			 selectedConnectors.forEach(function(selectedConnector) {

				 if(metric.category.connector==selectedConnector){
					 
					 if($scope.spiderChartModel.categories==[]){
						 $scope.spiderChartModel.categories.push(metric.category.name+'-'+metric.category.position);
						 $scope.lineChartModel.categories.push(metric.category.name+'-'+metric.category.position);
					 }
					 
					 var check=false;
					 $scope.spiderChartModel.categories.forEach(function(eachCategory){
						 if(metric.category.name+'-'+metric.category.position==eachCategory){
							 check=true;
						 }
					 });
					 if(check==false){
						 nonRepeative=nonRepeative+1;
						 console.log('inside non repeativ '+nonRepeative);
						 $scope.spiderChartModel.categories.push(metric.category.name+'-'+metric.category.position);
						 $scope.lineChartModel.categories.push(metric.category.name+'-'+metric.category.position);
					 }
 		
				      var ProductWithDate=metric.product.name +'_'+$filter('date')(metric.created, "dd/MM/yyyy");
				     
					  if(metric.product.name in $scope.dateWiseMetricData){
							console.log('inside repeative product');
							$scope.dateWiseMetricData[metric.product.name]=$scope.dateWiseMetricData[metric.product.name].concat([ProductWithDate +'_'+ metric.value+'-'+metric.category.position]);
							
					  }else{
							console.log('inside separate product :'+ ProductWithDate);
							$scope.dateWiseMetricData[metric.product.name]=[ProductWithDate +'_'+ metric.value+'-'+metric.category.position];
							
					  }
				 }
 		
			 });

		 });
		 
		 if(fetchBy=='directFGBC'){
			 application.selected = !application.selected;
		 }

		 if (application.selected) {
			 
			 /*sorting category name*/
			$scope.spiderChartModel.categoryArray=[];
			$scope.lineChartModel.categoryArray=[];
			$scope.categoryAList={};
			
			console.log('Initial category list is : '+$scope.spiderChartModel.categories);
				
			$scope.spiderChartModel.categories.forEach(function(spCat){
				console.log('cat pos is : '+spCat.split('-')[1]);
				console.log('cat name is : '+spCat.split('-')[0]);
				$scope.categoryAList[spCat.split('-')[1]]=spCat.split('-')[0];
			});
			
			console.log('filtered value at pos is : '+$scope.categoryAList[4]);
			 
			for(var j=1;$scope.categoryAList[j]!=undefined;j++){
				$scope.spiderChartModel.categoryArray.push($scope.categoryAList[j]);
				$scope.lineChartModel.categoryArray.push($scope.categoryAList[j]);
			}
			
			console.log('final sorted category name is : '+$scope.categoryArray);

			// end of sorting category
			
			 $scope.applicationList.forEach(function(productApplication){
			 
			var DWProductsList=$scope.dateWiseMetricData[productApplication];

			var dateWiseProductWithValues=DWProductsList.toString().split(',');
			
			$scope.dateWisePValue={};
			$scope.dateWisePNames=[];
			
			dateWiseProductWithValues.forEach(function(dateWiseProduct) {
				var pdList=dateWiseProduct.split('_');
				var nameAndDate=(pdList[0]+'_'+pdList[1]).toString();
				console.log('pdList value is :' +pdList[2]);
				if(nameAndDate in $scope.dateWisePValue){
					$scope.dateWisePValue[nameAndDate]=$scope.dateWisePValue[nameAndDate].concat([pdList[2]]);
				}
				else{
					$scope.dateWisePNames.push(nameAndDate);
					$scope.dateWisePValue[nameAndDate]=[pdList[2]];
				}
			 });
			
			 
			$scope.dateWisePNames.forEach(function(dateWName) {
				
				/*sorting fetched values*/
				$scope.finalStoredData=[];
				$scope.finalStoredDataList={};
				
				var preStoredData=$scope.dateWisePValue[dateWName].toString().split(',');
				
				preStoredData.forEach(function(preStroeD){
					$scope.finalStoredDataList[preStroeD.split('-')[1]]=preStroeD.split('-')[0];
				})
				
				for(var i=1;$scope.finalStoredDataList[i]!=undefined;i++){
					$scope.finalStoredData.push(parseFloat($scope.finalStoredDataList[i]));
				}
				
			 var randomColor = '#' + ((1 << 24) * Math.random() | 0).toString(16);
			 $scope.spiderApplicationSeries.push({name: dateWName, data: $scope.finalStoredData, color: randomColor});
			 $scope.lineApplicationSeries.push({name: dateWName, data: $scope.finalStoredData, color: randomColor});
			});
			 
			 });
			 
		 } else {
			 var applicationToPop = $.grep($scope.spiderApplicationSeries, function(e) {
				 return e.name == application.name;
			 });
			 $scope.spiderApplicationSeries.pop(applicationToPop);
			 $scope.lineApplicationSeries.pop(applicationToPop);
		 }

		 $scope.spiderChartModel.applicationSeries = $scope.spiderApplicationSeries;
		 $scope.lineChartModel.applicationSeries = $scope.lineApplicationSeries;

		 if(application.connectorId=='533a3dfef48d45e41873a7a9'){
			 if(application.selected){
			 
				 console.log('inside'+ application.value);
				 $scope.section2= true;
				 $scope.buildSpiderChart($scope.spiderChartModel, 'spiderChart2', 'Project Tracking');
				 $scope.buildLineChart($scope.lineChartModel, 'lineChart2', 'Project Tracking');
			 }
			 else{
				 $scope.section2= false;
			 }
		 }
		 else if (application.connectorId=='531be20171154d0000b07504') {
			 if(application.selected){

				 console.log('inside'+ application.value);
				 $scope.section3= true;
				 $scope.buildSpiderChart($scope.spiderChartModel, 'spiderChart3', 'Defect Metrics');
				 $scope.buildLineChart($scope.lineChartModel, 'lineChart3', 'Defect Metrics');
			 }
			 else{
				 $scope.section3= false;
			 }
		}
		else{
			if(application.selected){
				
				console.log('inside'+ application.value);
				$scope.section1= true;
				$scope.buildSpiderChart($scope.spiderChartModel, 'spiderChart', 'Code Quality');
				$scope.buildLineChart($scope.lineChartModel, 'lineChart', 'Code Quality');
			}
			else{
				$scope.section1= false;
			}
		 }
    	
    };

    $scope.buildLineChart = function(lineChartModel, lineChartId, selectedCategoryName) {
        new Highcharts.Chart({
            chart: {
                renderTo: lineChartId,
                type: 'line',
                height: 400
            },
            title: {
                text: selectedCategoryName,
                x: -20 //center
            },
            subtitle: {
                x: -20
            },
            xAxis: {
                categories: lineChartModel.categoryArray
            },
            yAxis: {
                title: {
                    text: 'Count'
                },
                plotLines: [
                    {
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }
                ]
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [lineChartModel.expectedSeries].concat(lineChartModel.applicationSeries)
        });
    };

    $scope.buildSpiderChart = function(spiderChartModel, spriderChartId, selectedCategoryName) {
        new Highcharts.Chart({
            chart: {
                renderTo: spriderChartId,
                polar: true,
                type: 'line',
                height: 500
            },

            title: {
                text: selectedCategoryName,
                x: -50,
                y: 50
            },

            xAxis: {
                categories: spiderChartModel.categoryArray,
                tickmarkPlacement: 'on',
                lineWidth: 0
            },

            yAxis: {
                gridLineInterpolation: 'polygon',
                lineWidth: 0,
                min: 0
            },

            tooltip: {
                shared: true,
                pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
            },

            legend: {
                align: 'right',
                verticalAlign: 'top',
                y: 70,
                layout: 'vertical'
            },

            series: [spiderChartModel.expectedSeries].concat(spiderChartModel.applicationSeries)
        });
    };
    
}]);