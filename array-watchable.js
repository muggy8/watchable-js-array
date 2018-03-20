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
    !observedArrayProto.watch && Object.defineProperty(observedArrayProto, "watch", {
        configurable: false,
        enumerable: false,
        value: function(callback){
            this.watchers.push(callback)
        }
    })
    return function(arr){
        // each object needs its own set of watch and watchables 
        var watcherProto = Object.create(observedArrayProto)
        
        Object.defineProperty(watcherProto, "watchers", {
            configurable: false,
            enumerable: false,
            value: []
        })
        Object.setPrototypeOf(arr, watcherProto)
        return arr
    }
})()