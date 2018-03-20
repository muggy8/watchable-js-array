var arrayWatchable = (function(){
    var observedArrayProto = Object.create(Array.prototype)
    Object.getOwnPropertyNames(Array.prototype).forEach(function(prop){
        (typeof Array.prototype[prop] === "function") && Object.defineProperty(observedArrayProto, prop, {
            configurable: false,
            enumerable: false,
            value: function(){
                var args = Array.prototype.slice.call(arguments)
                this.watchers && this.watchers.forEach(function(cb){
                    cb(prop, args)
                })
                return Array.prototype[prop].apply(this, args)
            }
        })
    })
    var watcherProto = Object.create(observedArrayProto)
    Object.defineProperty(observedArrayProto, "watch", {
        configurable: false,
        enumerable: false,
        value: function(callback){
            this.watchers.push(callback)
        }
    })
    Object.defineProperty(observedArrayProto, "watchers", {
        configurable: false,
        enumerable: false,
        value: []
    })
    return function(arr){
        Object.setPrototypeOf(arr, watcherProto)
        return arr
    }
})()