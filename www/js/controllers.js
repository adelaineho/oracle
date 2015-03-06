angular.module('oracle.controllers', [])
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                element.bind('change', function(){
                    scope.$apply(function(){
                        model.assign(scope, element[0].files[0]);
                    });
                    this.classList.add('hide');
                    scope.$parent.buttonStatus = "Get started";
                    scope.$parent.selectedImageName = element[0].files[0].name;
                    scope.$apply();
                    scope.$parent.sendToCloudSight(element[0].files[0]);
                });
            }
        };
    }])

    .controller('OracleCtrl', function($scope, $stateParams, classifiedService) {
        $scope.categories = null;
        $scope.mostRelevant = '';
        $scope.navTitle = '<img class="logo" src="http://assets.homeimprovementpages.com.au/css/images/hip/hip_logo.svg" />';
        $scope.classify = function(str) {
            classifiedService.fetchClassified(str).then(function(response) {
                var result = [];
                var jsonObj;
                var predictions = response.data.predictions;
                for(i=0;i<predictions.length;i++){
                    result.push(predictions[i].class_name);
                }
                var firstCategory = result.shift();
                var catKeys = result;
                classifiedService.getJson().then(function(response){
                    jsonObj = response.data;
                    $scope.mostRelevant = jsonObj[firstCategory];
                    var catObj = {};
                    for(j=0;j<catKeys.length;j++){
                        if(typeof jsonObj[catKeys[j]] !== 'undefined'){
                            catObj[catKeys[j]] = jsonObj[catKeys[j]];
                        }
                    }
                    $scope.categories = catObj;
                });
            });
        };

        $scope.showSuggestedCategories = function() {
            $scope.clicked = true;
            $scope.mostRelevant = '';
        };

        $scope.hideSuggestedCategories = function() {
            $scope.clicked = false;
        };

        $scope.callLink = function(catKey) {
            window.open('http://www.homeimprovementpages.com.au/find/'+catKey+'/get_quotes_mobile', '_system', 'location=yes'); return false;
        };
    })

    .controller('CameraCtrl', function($scope, $cordovaCapture) {
        document.addEventListener("deviceready", function () {
            $scope.captureAudio = function() {
                var options = { limit: 3, duration: 10 };

                $cordovaCapture.captureAudio(options).then(function(audioData) {
                    // Success! Audio data is here
                }, function(err) {
                    // An error occurred. Show a message to the user
                });
            };

            $scope.captureImage = function() {
                var options = { limit: 3 };

                $cordovaCapture.captureImage(options).then(function(imageData) {
                    // Success! Image data is here
                }, function(err) {
                    // An error occurred. Show a message to the user
                });
            };

        }, false);
    })

    .controller('UploadCtrl', function($scope, $stateParams, $cordovaCamera, Camera, cloudSight, $timeout, classifiedService) {
        document.addEventListener("deviceready", function () {
            var options = {
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.CAMERA
            };
            $cordovaCamera.getPicture(options).then(function(imageURI) {
                var image = document.getElementById('myImage');
                image.src = imageURI;
            }, function(err) {
                // error
            });
            $scope.getPhoto = function() {
                Camera.getPicture().then(function(imageURI) {
                    console.log(imageURI);
                }, function(err) {
                    console.err(err);
                });
            };
            $cordovaCamera.cleanup().then(); // only for FILE_URI
        }, false);

        $scope.buttonStatus = 'Upload';
        $scope.processing = false;
        $scope.sendToCloudSight = function(file){
            if(typeof file !== 'undefined'){
                cloudSight.uploadFileToUrl(file)
                    .then(function(response){
                        var meta = response.data;
                        $scope.imageReturned =  meta.url;
                        $scope.selectedImageName = '';
                        $scope.progressButtonStatus = 'Interpreting...';
                        var poll = function() {
                            $timeout(function() {
                                cloudSight.getImageData(meta.token).then(function(response){
                                    if(response.data.status == 'completed') {
                                        classifiedService.fetchClassified(response.data.name).then(function(response) {
                                            var result = [];
                                            var jsonObj;
                                            var predictions = response.data.predictions;
                                            for(i=0;i<predictions.length;i++){
                                                result.push(predictions[i].class_name);
                                            }
                                            var firstCategory = result.shift();
                                            var catKeys = result;
                                            classifiedService.getJson().then(function(response){
                                                jsonObj = response.data;
                                                $scope.mostRelevant = jsonObj[firstCategory];
                                                var catObj = {};
                                                for(j=0;j<catKeys.length;j++){
                                                    if(typeof jsonObj[catKeys[j]] !== 'undefined'){
                                                        catObj[catKeys[j]] = jsonObj[catKeys[j]];
                                                    }
                                                }
                                                $scope.categories = catObj;
                                                $scope.processing = false;
                                            });
                                        });
                                    } else {
                                        poll();
                                    }
                                });
                            }, 1000);
                        };
                        poll();
                    });
                    $scope.processing = true;
                    $scope.progressButtonStatus = 'Uploading';
            }
        };

        $scope.showSuggestedCategories = function() {
            $scope.clicked = true;
            $scope.mostRelevant = '';
        };

        $scope.hideSuggestedCategories = function() {
            $scope.clicked = false;
        };

        $scope.refreshUpload = function() {
        };

        $scope.goToOracle = function() {
        };

        $scope.callLink = function(catKey) {
            window.open('http://www.homeimprovementpages.com.au/find/'+catKey+'/get_quotes_mobile', '_system', 'location=yes'); return false;
        };
    })

    .controller('ContentController', function($scope, $ionicSideMenuDelegate) {
        $scope.toggleRight = function() {
            $ionicSideMenuDelegate.toggleRight();
        };
    });
