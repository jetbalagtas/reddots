// stores.controllers.js controls the same view for all users whether they are authenticated or not.
// it displays the map, and ideally, locations of nearby stores based on data from the database.
// geolocation needs to work. this goes hand-in-hand with store location data populating the map.

angular
.module('stores')
.controller('StoresCtrl', function($state, $auth, $scope, StoresService, CartService, $stateParams, localStorageService, mapboxService, $ionicLoading, $window, $rootScope) {
  $rootScope.cartList = [];
  // console.log("YAY");
  $scope.addToCart = function(newCartProduct) {
    // console.log("HELLO");
    $scope.cartList.push(newCartProduct);
    // console.log($scope.cartList);
  };
  mapboxService.init({ accessToken: 'pk.eyJ1IjoiamV0YmFsYWd0YXMiLCJhIjoiY2lpZ28waDZlMDJobHY1bTF1YnZrcHcxdSJ9.2YP0ceOasnLzdmIAG9Uy3g' });
  $scope.map = {
    center: {
      latitude: 32.788969,
      longitude: -79.938103
    },
    zoom: 8
  };

   StoresService.getStores().success(function (stores) {
     $scope.stores = stores;
   });

   $scope.goToStoreView = function(store) {
     var id = store._id;
     $state.go('app.storeview', {storeId: id});
   };

   $scope.goToOrderView = function(store) {
     var id = store._id;
     $state.go('app.orderview', {storeId: id});
   };

   $scope.goToCart = function () {
     var id = $stateParams.storeId;
     $state.go('app.cart', {storeId: id});
   };

   $scope.addStore = function (store) {
     StoresService.createStore(store);
   };

   $scope.deleteStore = function (store) {
     $scope.stores.splice(index, 1);
   };

   $scope.signup = function(newStore) {
     console.log("STORE", newStore);
     $auth.signup({
       displayName: newStore.name,
       storeAddress: newStore.address,
       email: newStore.email,
       password: newStore.password,
       confirmPassword: newStore.confirmPassword
     }).catch(function(response) {
       console.log("ERROR SIGNUP", response);
       //where to go on failure
       $state.go('app.storesignup');
     });
     //where to go on success
      var id = store._id;
       $state.go('app.storeview', {storedId: id});
   };

    var vm = this;
    if($stateParams.storeId) {
      vm.storeMarker = StoresService.getStore($stateParams.storeId);
    }

     $scope.name="addProducts";
     var productsInStore = localStorageService.get('products');

      $scope.products = productsInStore || [];

      $scope.$watch('products', function () {
        localStorageService.set('products', $scope.products);
      }, true);

     $scope.addProduct = function (productName, productPrice) {
      $scope.products.unshift({
        productName: productName,
        productPrice: productPrice
      });
      $scope.productName = "";
      $scope.productPrice = "";
    };

    $scope.removeProduct = function (index) {
      $scope.products.splice(index, 1);
    };

    $scope.edit = function(item) {
      alert('Edit Item: ' + item.id);
    };

    $scope.getOneStore = function() {
      var id = $stateParams.storeId;
      StoresService.getStore(id).then(function(data) {
        //  console.log(data);
         $scope.stores = data;
       });
    };


   if($stateParams.newCartProduct) {
     vm.cart = CartService.getProduct($stateParams.newCartProduct);
   }

});
