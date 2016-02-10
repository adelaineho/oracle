angular.module('oracle.services', [])
    .service('classifiedService', function($http) {
        return {
            fetchClassified: function(str) {
                var dataObj = {
                    trained_model_id : 6619,
                    value : str
                };
                var req = {
                    method: 'POST',
                    url: '/classify',
                    withCredentials: true,
                    headers: {
                        'Authorization': "Basic 7zZmxxJNVhLH1ZeuCxu3UHwDxCAE8fQFXWyIzejwnNe9vxLLLC",
                        'Content-Type': "application/json"
                    },
                    data: dataObj
                };
                return $http(req)
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.warn('can\'t classify');
                    });
            },
            getJson: function() {
                return $http.get("/js/category.json")
                    .error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        console.warn('no data returned from json');
                    });
            }
        };
    })

    .service('cloudSight', ['$http', function ($http) {
        this.uploadFileToUrl = function(file){
            var fd = new FormData();
            fd.append('file', file);
            fd.append('image_request[image]',file);
            fd.append('image_request[locale]','en-US');
            var req = {
                method: 'POST',
                url: 'https://api.cloudsightapi.com/image_requests',
                transformRequest: angular.identity,
                headers: {
                    'Authorization': "CloudSight uNlREkBTDU0eIXBeuyxUTg",
                    'Content-Type': undefined
                },
                data: fd
            };
            return $http(req)
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.warn('something went wrong when sending to cloudsight');
                });
        };
        this.getImageData = function(token) {
            var req = {
                method: 'GET',
                url: 'https://api.cloudsightapi.com/image_responses/'+token,
                headers: {
                    'Authorization': "CloudSight uNlREkBTDU0eIXBeuyxUTg",
                    'Content-Type': 'application/json'
                }
            };
            return $http(req)
                .error(function(data, status, headers, config) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    console.warn('something went wrong when sending to cloudsight');
                });
        }
    }])

    .factory('Camera', ['$q', function($q) {
        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }])

    .factory('Chats', function() {
      // Might use a resource here that returns a JSON array

      // Some fake testing data
      var chats = [{
        id: 0,
        name: 'Ben Sparrow',
        lastText: 'You on your way?',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
      }, {
        id: 1,
        name: 'Max Lynx',
        lastText: 'Hey, it\'s me',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
      }, {
        id: 2,
        name: 'Andrew Jostlin',
        lastText: 'Did you get the ice cream?',
        face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
      }, {
        id: 3,
        name: 'Adam Bradleyson',
        lastText: 'I should buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
      }, {
        id: 4,
        name: 'Perry Governor',
        lastText: 'Look at my mukluks!',
        face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
      }];

      return {
        all: function() {
          return chats;
        },
        remove: function(chat) {
          chats.splice(chats.indexOf(chat), 1);
        },
        get: function(chatId) {
          for (var i = 0; i < chats.length; i++) {
            if (chats[i].id === parseInt(chatId)) {
              return chats[i];
            }
          }
          return null;
        }
      }
    })

    /**
     * A simple example service that returns some data.
     */
    .factory('Friends', function() {
      // Might use a resource here that returns a JSON array

      // Some fake testing data
      var friends = [{
        id: 0,
        name: 'Ben Sparrow',
        notes: 'Enjoys drawing things',
        face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
      }, {
        id: 1,
        name: 'Max Lynx',
        notes: 'Odd obsession with everything',
        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
      }, {
        id: 2,
        name: 'Andrew Jostlen',
        notes: 'Wears a sweet leather Jacket. I\'m a bit jealous',
        face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
      }, {
        id: 3,
        name: 'Adam Bradleyson',
        notes: 'I think he needs to buy a boat',
        face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
      }, {
        id: 4,
        name: 'Perry Governor',
        notes: 'Just the nicest guy',
        face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
      }];


      return {
        all: function() {
          return friends;
        },
        get: function(friendId) {
          // Simple index lookup
          return friends[friendId];
        }
      }
    });
