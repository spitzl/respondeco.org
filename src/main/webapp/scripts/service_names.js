/**
 * Created by Clemens Puehringer on 25/11/14.
 */

'use strict';

respondecoApp.factory('UserNames', function ($resource, $cacheFactory) {
    var UserNamesService = $resource('app/rest/names/users', { filter: "" }, { });
    var cache = $cacheFactory("UserNames");

    return {
        getUsernames: function(partialName) {
            var names = cache.get(partialName);
            if(!names) {
                names = UserNamesService.query({ filter: partialName });
                cache.put(partialName, names);
            }
            return names;
        }
    }
});

respondecoApp.factory('PropertyTagNames', function ($resource, $cacheFactory) {
    var PropertyTagNamesService = $resource('app/rest/propertytags', { filter: "", fields: "name" }, { });
    var cache = $cacheFactory("PropertyTagNames");

    return {
        getPropertyTagNames: function(partialName) {
            var names = cache.get(partialName);
            if(!names) {
                names = PropertyTagNamesService.query({ filter: partialName });
                cache.put(partialName, names);
            }
            return names;
        }
    }
});

respondecoApp.factory('ResourceTagNames', function ($resource, $cacheFactory) {
    var ResourceTagNamesService = $resource('app/rest/resourcetags', { filter: "", fields: "name" }, { });
    var cache = $cacheFactory("ResourceTagNames");

    return {
        getResourceTagNames: function(partialName) {
            var names = cache.get(partialName);
            if(!names) {
                names = ResourceTagNamesService.query({ filter: partialName });
                cache.put(partialName, names);
            }
            return names;
        }
    }
});

respondecoApp.factory('ProjectNames', function ($resource, $cacheFactory) {
    var ProjectNamesService = $resource('app/rest/projects', { filter: "", fields: "name" }, { });
    var cache = $cacheFactory("ProjectNames");

    return {
        getProjectNames: function(partialName) {
            var names = cache.get(partialName);
            if(!names) {
                names = ProjectNamesService.query({ filter: partialName });
                cache.put(partialName, names);
            }
            return names;
        }
    }
});
