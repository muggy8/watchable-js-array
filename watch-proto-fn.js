var watchableProtoFn = (function(){
    function createOverridingProto(obj){
        var objProto = Object.getPrototypeOf(obj)
        var overlayProto = Object.create(objProto)

        while(objProto){
            Object.getOwnPropertyNames(objProto).forEach(function(calledProto, prop){
                (typeof calledProto[prop] === "function") && !overlayProto.hasOwnProperty(prop) && Object.defineProperty(overlayProto, prop, {
                    configurable: false,
                    enumerable: false,
                    value: function(){
                        var args = Array.prototype.slice.call(arguments)
                        this.watchers && this.watchers[prop] && this.watchers[prop].forEach(function(cb){
                            cb(args)
                        })
                        return calledProto[prop].apply(this, args)
                    }
                })
            }.bind(null, objProto))
            objProto = Object.getPrototypeOf(objProto)
        }
        
        !overlayProto.watchers && Object.defineProperty(overlayProto, "watchers", {
            configurable: false,
            enumerable: false,
            value: {}
        })
        
        !overlayProto.watch && Object.defineProperty(overlayProto, "watch", {
            configurable: false,
            enumerable: false,
            value: function(target, callback){
                if (typeof overlayProto.watchers !== "object"){
                    return false;
                }

                overlayProto.watchers[target] = overlayProto.watchers[target] || []
                overlayProto.watchers[target].push(callback)
            }
        })

        return overlayProto
    }

    return function(obj){
        var overrideProto = createOverridingProto(obj)
        Object.setPrototypeOf(obj, overrideProto)
        return obj
    }
})()
module !== undefined && module.exports = watchableProtoFn