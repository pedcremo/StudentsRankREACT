// In ES6 exists a new class called proxy let us intermediate with
// a preexisting object and is able to detect if have been changed
// thats wonderful for monitoring our data structures. When we detect
// a change we notify to a service the change.

import {events} from './eventsPubSubs.js';

function doProxy(targetObject,notifyService) {
    var proxy = new Proxy(targetObject, {
        apply: function(target, thisArg, argumentsList) {
          return thisArg[target].apply(this, argumentList);
        },
        deleteProperty: function(target, property) {
          console.log("Deleted %s", property);
          return true;
        },
        set: function(target, property, value, receiver) {      
          target[property] = value; 
         
          events.publish(notifyService,targetObject);
          console.log("Set %s to %o", property, value);
          return true;
        }
      });
    return proxy;
}

export {doProxy};