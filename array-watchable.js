var arrayWatchable = (function(){
    var observedArrayProto = Object.create(Array.prototype)
    Object.getOwnPropertyNames(Array.prototype).forEach(function(prop){
        (typeof Array.prototype[prop] === "function") && Object.defineProperty(observedArrayProto, prop, {
            configurable: false,
            enumerable: false,
            value: function(){
                console.log(prop, "called")
                return Array.prototype[prop].apply(this, Array.prototype.slice.call(arguments))
            }
        })
    })
    return function(arr){
        Object.setPrototypeOf(arr, observedArrayProto)
    }
})()