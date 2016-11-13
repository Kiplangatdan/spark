
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

.controller('LoginCtrl', function($scope, $timeout, $stateParams, ionicMaterialInk, ionicMaterialMotion, $location, $ionicHistory, $http, $state, $auth, $rootScope, $cordovaNetwork) {
        $scope.loginData = {};
        $scope.loginError = true;
        $scope.loginErrorText;
    $scope.loginData.username = '@sparkcommunication.co.ke';
    //$scope.loginData.password = '1234';
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
        //$http.post('http://192.168.1.103:8012/spark/authenticate',{
       $http.post('http://sparkcommunication.websandbox.nl/authenticate',{
            'email': $scope.loginData.username,
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
    // Set Ink
    ionicMaterialInk.displayEffect();
})
.controller('HomeCtrl', function( $rootScope, $ionicSlideBoxDelegate, $scope, $http, $ionicPopup, $stateParams, $timeout, ionicMaterialMotion, $state, $cordovaGeolocation, ionicMaterialInk) {
    $scope.user = $rootScope.currentUser;
  if(!$scope.user){
    $state.go('app.login');
  }

    var options = {timeout: 5000, enableHighAccuracy: true};

    $cordovaGeolocation.getCurrentPosition(options).then(function(position){

        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        $scope.lat = position.coords.latitude;
        $scope.lng = position.coords.longitude;

        var id = $rootScope.currentUser.user_id;
        $scope.$watch('[lng, lat]', function() {
            $http.post('http://sparkcommunication.websandbox.nl/api/latlng/' +id,{
                'lat': $scope.lat,
                'lng': $scope.lng
            }).success(function(data, status, headers, config) {
              
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

        $ionicPopup.alert({
         title: 'No Internet Connection',
         template: 'Sorry, your current location could not be determined. Please try later.',
         okText:'Retry',
         })
    });




  
  var deploy = new Ionic.Deploy();




  // Check Ionic Deploy for new code
  /*$scope.checkForUpdates = function() {
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
  }*/


  /////save work///////// 

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');

    /*$timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);*/

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})
    
.controller('GridCtrl', function ($http, $state, $rootScope, $scope, $stateParams, $timeout, $ionicPopup, $filter, $cordovaToast, ionicMaterialInk, ionicMaterialMotion) {
$scope.user = $rootScope.currentUser;
    if(!$scope.user){
        $state.go('app.login');
    }
    $scope.name = $stateParams.name;
    var lat = $filter('limitTo')($scope.user.lat, 5, 0);
    var lng = $filter('limitTo')($scope.user.lng, 5, 0);

    var lats = $filter('limitTo')($stateParams.lat, 5, 0);



    if ((lat == lats)){
       // console.log("In the right place");
    }else{
        var confirmPopup = $ionicPopup.alert({
           title: 'Wrong Outlet',
           template: 'It seems you are in the wrong outlet. Check your location and try again',
           okText:'Ok',
       });
        confirmPopup.then(function (response) {
            if(response){
               $state.go('app.outlets');
            }
        });
    }

    var outlet_id = $stateParams.outlet_id;
    var name = $stateParams.name;


    $scope.outlet_id = outlet_id;
    $scope.name = name;

    //Stock out page
    $scope.pos = function (outlet_id, name, lat) {
        $state.go('app.pos', {"outlet_id":outlet_id, "name":name, "lat":lat});

    }
    //Order Placement page
    $scope.order = function (id, name, lat) {
        $state.go('app.request', {"outlet_id":outlet_id, "name":name, "lat":lat});

    }
    //Competitor activities
    $scope.gallery = function (id, name, lat) {
        $state.go('app.gallery', {"outlet_id":outlet_id, "name":name, "lat":lat});

    }
    //Pricing page
     $scope.pricing = function (id, name, lat) {
        $state.go('app.pricing', {"outlet_id":outlet_id, "name":name, "lat":lat});

    }
})
.controller('InventoryCtrl', function($http, $rootScope, $scope, $stateParams, $timeout, $ionicPopup, $cordovaToast, ionicMaterialInk, ionicMaterialMotion) {
    
    $scope.user = $rootScope.currentUser;
    if(!$scope.user){
      $state.go('app.login');
    }
    //$scope.search = 'Naivas';
    $scope.inventory = [];
    var userid = $scope.user.user_id;
    $http.get('http://sparkcommunication.websandbox.nl/api/allstock_salesperson/' + userid).success(function(data, status, headers, config) {
        $scope.inventory = data.mystockrecords;
        //console.log(data);

    }).error(function(data, status) {
        $ionicPopup.alert({
            title: 'No Internet Connection',
            template: 'No Products Retrieved! Please try again.',
            okText:'Retry',
        })

    });


    $scope.doRefresh = function() {
        $http.get('http://sparkcommunication.websandbox.nl/api/allstock_salesperson/' + userid)

            .success(function(newItems) {
                //$scope.inventory = newItems;
            })
            .finally(function() {
                // Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
                $cordovaToast.showLongCenter('Stock List Refreshed', function(a){},function(b){});
            });
    }




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

})

.controller('recoverpwdCtrl', function($scope, $http, $state, $ionicPopup, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
  
    $scope.data = {};

    $scope.requestpwd = function(){
        var alertpop = $ionicPopup.alert({
            title:'Contact Admin',
            template:'Please contact admin to reset your password',
            okText:'Ok',
        });
        alertpop.then(function (res) {
           if(res){
               //do something
            } else{

            }
        })
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

.controller('PosController', function($scope, $rootScope, $http, $filter, $state, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
$scope.user = $rootScope.currentUser;
    if(!$scope.user){
        $state.go('app.login');
    }
   // var lats = $stateParams.lat;
    $scope.name = $stateParams.name;
    //var outlet_lng =$scope.user.outlet.lng;
    //user coordinates from GPS
    var lat = $filter('limitTo')($scope.user.lat, 5, 0);
    var lng = $filter('limitTo')($scope.user.lng, 5, 0);
    //Outlet coords from the database
    //var lngs = $filter('limitTo')($scope.user.outlet.lng, 5, 0);
    var lats = $filter('limitTo')($stateParams.lat, 5, 0);

    //console.log("GPS coords " + lat);
   // console.log("GPS coords " +lng);
    //console.log("Outlet Coords" + lats);

    /* Disable GPS Coords during testing
    if ((lat == lats)){
       // console.log("In the right place");
    }else{
        var confirmPopup = $ionicPopup.alert({
           title: 'Wrong Outlet',
           template: 'It seems you are in the wrong outlet. Check your location and try again',
           okText:'Ok',
       });
        confirmPopup.then(function (response) {
            if(response){
               $state.go('app.outlets');
            }
        });
    }*/
    $scope.faults = [];
    $scope.success =false;

    //Post PoS Details
    $scope.pos = {};
    var outlet_id = $stateParams.outlet_id;
    var name = $stateParams.name;
    $scope.savepos = function(id, quantity, status, comments){
        $scope.showspiner = true;
        $http.post('http://sparkcommunication.websandbox.nl/api/addproductstockout/' +id,{
            'user_id': $rootScope.currentUser.user_id,
            'status': status,
            'comments': comments,
            'outlet_id':outlet_id,
            'type':1


        }).success(function(data, status, headers, config) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Stock Out',
                template: 'Product stock updated Successfully. Do you want to request Stock?',
                cancelText: 'No',
                okText: 'Yes',
            });

            confirmPopup.then(function(res) {
                if(res) {
                   $state.go('app.request', {'outlet_id':outlet_id, 'name':name});
                } else {
                    $scope.showspiner = false;
                    $scope.pos.code = "";
                    $scope.pos.name = "";
                    $scope.pos.status = "";
                    $scope.comments = "";
                }
            });

            //console.log(data);

        }).error(function(data, status) {
            //$scope.errors = data.errors;
            $scope.showspiner = false;
        });
    }

    $scope.testfunc = function (code){
        var code = code;
        $http.get('http://sparkcommunication.websandbox.nl/api/pos_search_product/' +code)
            .success(function(data, status, headers, config) {
                $scope.searched_product = data.searched_product;
                if(!$scope.searched_product){
                    $scope.search_results = false;
                    //$scope.pos.name = $scope.searched_product.name;
                }else{
                    $scope.search_results = true;
                }

            }).error(function(data, status) {
            //$scope.errors = data.errors;
        });
    }
    $scope.$watch('pos.code', function(newValue, oldValue) {
        //$scope.testfunc(pos.code);
        var code = $scope.pos.code;
        $scope.testfunc(code);

    });



        var vm = this;
        //$scope.test = 1234;
        vm.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        vm.scanResults = result.text;
                        $scope.pos.code=1;

                    }, function(error) {
                        // An error occurred
                        vm.scanResults = 'Error: ' + error;
                    });
            });
        };

        vm.scanResults = '';
    })

.controller('PricingCtrl', function($scope, $rootScope, $http, $filter, $state, $cordovaBarcodeScanner, $ionicPlatform, $ionicPopup, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
$scope.user = $rootScope.currentUser;
    if(!$scope.user){
        $state.go('app.login');
    }
    $scope.name = $stateParams.name;

    $scope.faults = [];
    $scope.success =false;

    //Post PoS Details
    $scope.pos = {};
    var outlet_id = $stateParams.outlet_id;
    var name = $stateParams.name;
   console.log('Pos page ' + outlet_id);
    console.log('Pos page ' + name);
    $scope.savepos = function(id, quantity){
        $scope.showspiner = true;
        $http.post('http://sparkcommunication.websandbox.nl/api/saleproduct/' +id,{
            'user_id': $rootScope.currentUser.user_id,
            'quantity': quantity,
            'outlet_id':outlet_id,


        }).success(function(data, status, headers, config) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Price Updated',
                template: 'New price added. Add price for another product?',
                cancelText: 'No',
                okText: 'Yes',
            });

            confirmPopup.then(function(res) {
                if(res) {
                 $state.go('app.pricing', {'outlet_id':outlet_id, 'name':name});
                    $scope.showspiner = false;
                    $scope.pos.code = "";
                    $scope.pos.name = "";
                    $scope.pos.category = "";
                    $scope.pos.quantity = "";
                } else {
                 $state.go('app.grid', {'outlet_id':outlet_id, 'name':name});

                }
            });

            //console.log(data);

        }).error(function(data, status) {
            //$scope.errors = data.errors;
            $scope.showspiner = false;
        });
    }

    $scope.testfunc = function (code){
        var code = code;
        $http.get('http://sparkcommunication.websandbox.nl/api/pos_search_product/' +code)
            .success(function(data, status, headers, config) {
                $scope.searched_product = data.searched_product;
                if(!$scope.searched_product){
                    $scope.search_results = false;
                    //$scope.pos.name = $scope.searched_product.name;
                }else{
                    $scope.search_results = true;
                }

            }).error(function(data, status) {
            //$scope.errors = data.errors;
        });
    }
    $scope.$watch('pos.code', function(newValue, oldValue) {
        //$scope.testfunc(pos.code);
        var code = $scope.pos.code;
        $scope.testfunc(code);

    });



        var vm = this;
        //$scope.test = 1234;
        vm.scan = function(){
            $ionicPlatform.ready(function() {
                $cordovaBarcodeScanner
                    .scan()
                    .then(function(result) {
                        // Success! Barcode data is here
                        vm.scanResults = result.text;
                        $scope.pos.code=1;

                    }, function(error) {
                        // An error occurred
                        vm.scanResults = 'Error: ' + error;
                    });
            });
        };

        vm.scanResults = '';
    })

.controller('Stock_requestCtrl', function($scope, $rootScope, $http, $filter, $state, $ionicPlatform, $ionicPopup, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
   $scope.user = $rootScope.currentUser;
    $scope.faults = [];
    $scope.success = false;

    var outlet_id = $stateParams.outlet_id;
    var name = $stateParams.name;

    $scope.name = name;
     $http.get('http://sparkcommunication.websandbox.nl/api/allproducts').success(function(data, status, headers, config) {
        $scope.products = data.products;

    }).error(function(data, status) {


    });

    $scope.check = function (id, status) {
        if(status){
            $http.post('http://sparkcommunication.websandbox.nl/api/addproductstockout/' +id,{
            'user_id': $rootScope.currentUser.user_id,
            'outlet_id': outlet_id,
			'type':2

        }).success(function(data, status, headers, config) {
            //$scope.showConfirm = function() {

              });
        }else{
            //check if passed id is in db and delete
        }

    }

    $scope.notcheck = function (id) {
        console.log('notchecked');
    }

    console.log('Stock Request Page ' + $state.params.outlet_id);
    console.log('Stock Request Page ' + name );


    })

.controller('OutletsCtrl', function($scope, $rootScope, $http, $filter, $state, $ionicPlatform, $ionicPopup, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
        $scope.user = $rootScope.currentUser;
    if(!$scope.user){
        $state.go('app.login');
    }
        $scope.faults = [];
        $scope.success = false;


    $scope.planners = [];
    var userid = $scope.user.user_id;
    $http.get('http://sparkcommunication.websandbox.nl/api/allclientuserplans/' + userid).success(function(data, status, headers, config) {
        $scope.planners = data.plans;
        console.log(data);


    }).error(function(data, status) {
        console.log('Not working');

    });



$scope.outlets = [];
    $http.get('http://sparkcommunication.websandbox.nl/api/alloutlets').success(function(data, status, headers, config) {
        $scope.outlets = data.outlets;
        console.log(data);


    }).error(function(data, status) {
        console.log('Not working');

    });



    $scope.out = function (id, name, lat) {
        $state.go('app.grid', {"outlet_id":id, "name":name, "lat":lat});

    }

    ionicMaterialInk.displayEffect();
  })

.controller('GalleryCtrl', function ($scope, $rootScope, $http, $state, $stateParams, $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet) {
    $scope.user = $rootScope.currentUser;
    var outlet_id = $state.params.outlet_id;
    var outlet_name = $state.params.name;
    if(!$scope.user) {
        $state.go('app.login');
    }
	
    $scope.image = null;
    console.log('Gallery ' + $state.params.outlet_id);
    console.log('Gallery ' + outlet_name );
        // Present Actionsheet for switch Camera / Library
        $scope.loadImage = function() {
            var options = {
                title: 'Select Image Source',
                buttonLabels: ['Load from Library', 'Use Camera'],
                addCancelButtonWithLabel: 'Cancel',
                androidEnableCancelButton : true,
            };
            $cordovaActionSheet.show(options).then(function(btnIndex) {
                var type = null;
                if (btnIndex === 1) {
                    type = Camera.PictureSourceType.PHOTOLIBRARY;
                } else if (btnIndex === 2) {
                    type = Camera.PictureSourceType.CAMERA;
                }
                if (type !== null) {
                    $scope.selectPicture(type);
                }
            });
        };

        // Take image with the camera or from library and store it inside the app folder
        // Image will not be saved to users Library.
        $scope.selectPicture = function(sourceType) {
            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: sourceType,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(function(imagePath) {
                    // Grab the file name of the photo in the temporary directory
                    var currentName = imagePath.replace(/^.*[\\\/]/, '');

                    //Create a new name for the photo
                    var d = new Date(),
                        n = d.getTime(),
                        newFileName =  $scope.user.fname + "_" + n + ".jpg";

                    // If you are trying to load image from the gallery on Android we need special treatment!
                    if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
                        window.FilePath.resolveNativePath(imagePath, function(entry) {
                                window.resolveLocalFileSystemURL(entry, success, fail);
                                function fail(e) {
                                    console.error('Error: ', e);
                                }

                                function success(fileEntry) {
                                    var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
                                    // Only copy because of access rights
                                    $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                                        $scope.image = newFileName;
                                    }, function(error){
                                        $scope.showAlert('Error', error.exception);
                                    });
                                };
                            }
                        );
                    } else {
                        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
                        // Move the file to permanent storage
                        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
                            $scope.image = newFileName;
							
							
							
                        }, function(error){
                            $scope.showAlert('Error', error.exception);
                        });
                    }
                },
                function(err){
                    // Not always an error, maybe cancel was pressed...
                })
        };

        // Returns the local path inside the app for an image
        $scope.pathForImage = function(image) {
            if (image === null) {
                return '';
            } else {
                return cordova.file.dataDirectory + image;
            }
        };

    $scope.callthis = function(filename, category, description, outlet_id) {
        $http.post('http://sparkcommunication.websandbox.nl/api/uploadimage', {
            'user_id': $rootScope.currentUser.user_id,
            'filename': filename,
            'category': category,
            'description': description,
            'outlet_id': outlet_id

        }).success(function (data, status, headers, config) {
              /*  $ionicPopup.alert({
                title: 'Uploaded',
                template: 'Image and Description saved',
                okText: 'Ok'
            });*/
        }).error(function (data, status) {
            $ionicPopup.alert({
                title: 'Not Uploaded',
                template: 'Something is not working right. Try again later.',
                okText: 'Retry'
            });
        });

    }
    //$scope.gallery = {};

        $scope.uploadImage = function(description, category) {
            $scope.showspiner = true;
            // Destination URL
            var url = "http://sparkcommunication.websandbox.nl/uploads/upload.php";
            //var url = "http://sparkcommunication.websandbox.nl/api/uploadimage";

            // File for Upload
            var targetPath = $scope.pathForImage($scope.image);

            // File name only
            var filename = $scope.image;

            var options = {
                fileKey: "file",
                fileName: filename,
                chunkedMode: false,
                mimeType: "multipart/form-data",
                params : {'fileName': filename}
            };


            $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {

            $scope.callthis(filename, category, description, outlet_id);
				$scope.showspiner = false;
                 var confirmPopup = $ionicPopup.alert({
                title: 'Image Posted',
                template: 'Posted successfully',
                okText: 'Ok',
            });

            confirmPopup.then(function(res) {
                if(res) {


                } else {
                    $ionicPopup.alert({
                           title: 'Not running',
                           template: 'Something is wrong',
                           okText: 'Ok'
                       });
                }
            });
                
				
                  
                   //$http.post('http://sparkcommunication.websandbox.nl/api/uploadimage/' + id, {
                    
                   
					


                    $scope.showConfirm('Uploaded', 'Upload another Image?');
					
            });

        }

        $scope.showAlert = function(title, msg) {
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
            });
        };
    })

