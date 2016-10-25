
'use strict';
angular.module('starter.controllers', ['ionic', 'ngCordova'])


.controller('AppCtrl', function($rootScope, $scope, $http, $ionicModal, $ionicPopover, $timeout, $state) {
    //$scope.showspiner = false;
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.user = function() {
      if(!$rootScope.currentUser){
        $state.go('app.login');
      }else{
        $scope.user = $rootScope.currentUser;
      }
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, $location, $ionicHistory, $http, $state, $auth, $rootScope) {

        $scope.loginData = {}
        $scope.loginError = true;
        $scope.loginErrorText;

        $scope.$watch('loginData.username + loginData.password', function(newValue,oldValue) {
          if(newValue){
            $scope.loginErrorText;
            
          }else{
            //console.log('they are the same');
          }
        });
  
        $scope.login = function() {
         // $scope.showspiner2 = true; 
         $scope.loginErrorText;
         $scope.showspiner = true; 

         ///new login script /////
         $http.post('http://sparkcommunication.websandbox.nl/authenticate',{
            'username': $scope.loginData.username,
            'password': $scope.loginData.password,

        }).success(function(data, status, headers, config) {
             //window.location = "#/app/my_work";
             //console.log(data.user);
             //$scope.user = data.user;
             $rootScope.currentUser = data.user;
             if($rootScope.currentUser){
                $state.go('app.home');
                
             }else{
              $scope.loginErrorText = "Incorrect Credentials, Please try again!";
              $scope.showspiner = false;
             }
          
        }).error(function(data, status) { 
        //$scope.errors = data.errors;
        });

        
        }
    $scope.$parent.clearFabs();
    
    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 1);

    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})
    .controller('HomeCtrl', function( $rootScope, $ionicSlideBoxDelegate, $scope, $http, $stateParams, $timeout, ionicMaterialMotion, $state, $cordovaGeolocation, ionicMaterialInk) {
        $scope.user = $rootScope.currentUser;
        if(!$scope.user){
            $state.go('app.login');
        }

        var options = {timeout: 5000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function(position){

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;
            $scope.$watch('[lng, lat]', function() {
                $http.post('http://sparkcommunication.websandbox.nl/api/latlng',{
                    'lat': $scope.lat,
                    'lng': $scope.lng,

                }).success(function(data, status, headers, config) {
                    console.log(data);

                }).error(function(data, status) {
                    //$scope.errors = data.errors;
                });
            });


            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            loadMarkers();
            function loadMarkers(){
                google.maps.event.addListenerOnce($scope.map, 'idle', function(){var marker = new google.maps.Marker({map: $scope.map,animation: google.maps.Animation.DROP, position: latLng});
                    var infoWindow = new google.maps.InfoWindow({content: "Current location"});
                    google.maps.event.addListener(marker, 'click', function () {infoWindow.open($scope.map, marker);});
                });
            }

        }, function(error){
            $ionicPopup.confirm({
                title: 'No Internet Connection',
                content: 'Sorry, no Internet connectivity detected. Please reconnect and try again.'
            })
            //console.log("Could not get location");
        });





        var deploy = new Ionic.Deploy();




        // Check Ionic Deploy for new code
        $scope.checkForUpdates = function() {
            ///check for updates
            $scope.checkupdate = "adrian Deploy: Checking for updates...";
            $scope.updateavailable = "adrian Deploy: Update available...Will take upto 5 minutes to download and install.";
            console.log('Ionic Deploy: Checking for updates');
            deploy.check().then(function(hasUpdate) {
                $scope.updateavailable = "adrian Deploy: Update available...";
                $scope.updating = "adrian Deploy: Updating application...";
                console.log('adrian Deploy: Update available: ' + hasUpdate);
                $scope.hasUpdate = hasUpdate;

                if (hasUpdate){
                    /// install updates
                    deploy.update().then(function(res) {
                        $scope.updatesuccess = "adrian Deploy: Update Success!";
                        console.log('Ionic Deploy: Update Success! ', res);
                    }, function(err) {
                        $scope.updatefailed = "adrian Deploy: Update error!";
                        console.log('Ionic Deploy: Update error! ', err);
                    }, function(prog) {
                        $scope.updatefailed = "adrian Deploy: Progress...update error";
                        console.log('adrian Deploy: Progress... ', prog);

                    });
                }else{
                    /// no updates to install
                    $scope.noupdate = "adrian Deploy: No Update Available...";
                }


            }, function(err) {
                $scope.checkupdatefail = "adrian Deploy: Unable to check for updates";
                console.error('adrian Deploy: Unable to check for updates', err);
            });
        }


        /////save work/////////

        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab('right');

        $timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();
    })

.controller('InventoryCtrl', function($http, $rootScope, $scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    
    $scope.user = $rootScope.currentUser;
    if(!$scope.user){
      $state.go('app.login');
    }
   
$scope.doRefresh = function(){
    $scope.init();
    $scope.$broadcast('scroll.refreshComplete');

    $cordovaToast.showLongBottom('Jobs list Refreshed!')
        .then(function(success) {
            // Do something on success
        }, function(error) {
            // Handle error
        });
  }

    $scope.jobs = [];
    var userid = $scope.user.id;
    $http.get('http://adrian.websandbox.nl/api/allregions/' + userid).success(function(data, status, headers, config) {
          $scope.jobs = data.myjobs;

    }).error(function(data, status) {
            console.log('failed myjobs');

    });

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('recoverpwdCtrl', function($scope, $http, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  
    $scope.data = {};
    $scope.requestpwd = function(){

      $http.post('http://adrian.websandbox.nl/api/requestpwd',{
        'email' : $scope.data.email,
      }
      ).success(function(data, status, headers, config) {
        //$scope.user_requestpwd = data.user;
        if(data.user){
          $scope.user_requestpwd = "Password sent to your email.";
        }else{
          $scope.user_requestpwd = "Email you provided does not exist, re-type email or contact admin.";
        }

      }).error(function(data, status) { 
      //$scope.errors = data.errors;
      });

    }


    $scope.$parent.clearFabs();

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('SignupCtrl', function($scope, $http, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
        // Set Header
        $scope.faults = [];
        $scope.success =false;

        $scope.pwdmatch =false;
        $scope.password = "";
        $scope.re_password = "";

        $scope.$watch('password + re_password', function() {
            if($scope.password === $scope.re_password){
                $scope.pwdmatch =true;
            }else{
                $scope.pwdmatch =false;
            }
        });


        $scope.signup = function(){

            $http.post('http://sparkcommunication.websandbox.nl/api/addnewuser',{
                'fname': $scope.fname,
                'lname': $scope.lname,
                'mobile': $scope.mobile,
                'idno': $scope.idno,
                'region': $scope.signup.region,
                'email': $scope.email,
                'password': $scope.password,

            }).success(function(data, status, headers, config) {
                $scope.registereduser = data.registereduser;
                $scope.success =true;

            }).error(function(data, status) {
                //$scope.errors = data.errors;
            });
        }

        $scope.$parent.clearFabs();

        // Set Motion
        $timeout(function() {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        $timeout(function() {
            $scope.$parent.hideHeader();
        }, 0);

        $timeout(function() {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);

        // Set Ink
        ionicMaterialInk.displayEffect();
    })

.controller('AboutCtrl', function($scope, $rootScope, $state, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.user = $rootScope.currentUser;
    if(!$scope.user){
      $state.go('app.login');
    }
    // Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(false);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('LogoutCtrl', function( $rootScope, $scope, $http, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion ) {
    $scope.user = $rootScope.currentUser;
    if(!$scope.user){
      $state.go('app.login');
    }
    $scope.logout = function(){

        $http.get('http://sparkcommunication.websandbox.nl/logout').success(function(data, status, headers, config) {
            console.log('Successfully logged out'); 

        }).error(function(data, status) { 
            console.log('failed logged out'); 

        });
    }
})

.controller('PosController', function($scope, $rootScope, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup, $timeout) {

        $scope.showConfirm = function() {

            var alertPopup = $ionicPopup.alert({
                title: 'Point of Sale',
                template: 'Product Sold Successfuly'
            });

            alertPopup.then(function(res) {
                // Custom functionality....
            });
        }




        var vm = this;
        //$scope.test = 1234;
        vm.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        vm.scanResults = result.text;
                        $scope.code=result.text;
                        if($scope.code==6164000242496) {
                            $scope.name = "Tissue Papers";
                            $scope.metrics = "4 Pieces";
                        } else if($scope.code==6164000418518) {
                            $scope.name = "Sea Salt";
                            $scope.metrics = "250 Grams";
                        }else if($scope.code==61601079) {
                            $scope.name = "Blueband";
                            $scope.metrics = "500 Grams";
                        }else if($scope.code==6161101811132) {
                            $scope.name = "Bluelabel Salt";
                            $scope.metrics = "50 Grams"
                        }else if($scope.code==6161100770003) {
                            $scope.name = "Natural Honey";
                            $scope.metrics = "500 ml";
                        }else if($scope.code==6161102170023) {
                            $scope.name = "Soko Unga";
                            $scope.metrics = "2 Kg";
                        }else if($scope.code==6161108977046) {
                            $scope.name = "Kiwi Suede";
                            $scope.metrics = "100 ml";
                        }else if($scope.code==5449000004840) {
                            $scope.name = "Fanta Juice";
                            $scope.metrics = "2 Litres";
                        } else{
                            $scope.name="Product not found";
                            $scope.metrics="Uknown";
                        }

                    }, function(error) {
                        // An error occurred
                        vm.scanResults = 'Error: ' + error;
                    });
            });
        };

        vm.scanResults = '';
    })

.controller('GalleryCtrl', ['$scope', "CameraPopover", "$ionicActionSheet",function($scope, CameraPopover, $ionicActionSheet){
        $scope.showProgress = false;

        var uploadFileUrl = "your serve api";

        $scope.showActionSheet = function(){
            // Show the action sheet
            var hideSheet = $ionicActionSheet.show({
                buttons: [
                    { text: 'Camera' },
                    { text: 'Gallery' }
                ],
                // destructiveText: 'Delete',
                titleText: 'Upload Product From:',
                cancelText: 'Cancel',
                cancel: function() {
                    hideSheet();
                },
                buttonClicked: function(index) {
                    // click "take phone"
                    if(index == 0){
                        takePicture({
                            quality : 100,
                            allowEdit : true,
                            targetWidth: 500,
                            targetHeight: 225,
                            // Android doesn't recognize this.
                            // http://stackoverflow.com/questions/29392639/error-capturing-image-with-phonegap-on-android
                            // saveToPhotoAlbum: true,
                            sourceType: Camera.PictureSourceType.CAMERA,
                            encodingType: Camera.EncodingType.JPEG,
                            destinationType: Camera.DestinationType.FILE_URI
                        });
                    }else if(index == 1){
                        takePicture({
                            quality : 100,
                            allowEdit : true,
                            targetWidth: 500,
                            targetHeight: 225,
                            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                            encodingType: Camera.EncodingType.JPEG,
                            destinationType: Camera.DestinationType.FILE_URI
                        });
                    }else{
                        return true;
                    }
                    hideSheet();
                }
            });
        };

        // upload file with a imageURI
        var uploadFile = function(imageURI){
            // show the progress bar
            safeApply( $scope, function(){
                $scope.showProgress = true;
            });
            var uploadOptions = new FileUploadOptions();
            uploadOptions.fileKey = "avatar";
            uploadOptions.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            uploadOptions.mimeType = "image/jpeg";
            uploadOptions.chunkedMode = false;

            var ft = new FileTransfer();

            var statusDom = document.getElementById("ft-prog");

            ft.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    var perc = Math.floor(progressEvent.loaded / progressEvent.total * 100);
                    statusDom.value = perc;
                    if(perc == 100){
                        safeApply($scope, function(){
                            $scope.showProgress = false;
                        });
                    }
                } else {
                    console.log("loading....");
                }
            };

            ft.upload(imageURI, encodeURI(uploadFileUrl), onSuccess, onFail, uploadOptions, true);

            function onSuccess(responseData){
                // FIXME: if use responseData.response.avatar_thumb_url will get a undefined
                responseString = JSON.stringify(responseData);
                responseObject = JSON.parse(responseString);
                responsePerson = JSON.parse(responseObject.response);
                safeApply($scope, function(){
                    // update your url
                    // $scope.person.avatar_square_url = responsePerson.avatar_square_url;
                });
            };
            function onFail(){
                alert("something wrong, please try again");
            };
        };

        //get photos form device and return a file path url
        var takePicture = function(options) {
            CameraPopover.getPicture(options).then(function(imageURI){
                uploadFile(imageURI);
            }, function(err){
                console.error(err);
            });
        };

    }])


