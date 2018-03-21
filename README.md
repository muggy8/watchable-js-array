# Watchable Prototype Functions
Watchable Prototype Functions isa javascript function that makes it easy to watch for when a method in an object's prototype chain has has been called. the primary use of this tool is to assist in keeping 2 way data binding objects in sync. As always, the function works nicely in Node and browser (or it should hehe xP)

## Usage
```javascript
var myArray = [1, 3, 3, 7]
watchableProtoFn(myArray)

myArray.watch("push", function(returnedFromPush, itemPushed, methodCalled){
	console.log("an item,", itemPushed, "has been pushed onto myArray with the index of", returnedFromPush)
})

myArray.push(42)
```

or more realistically
```javascript
var dataModel = watchableProtoFn([])
dataModel.watch("*", function(){
	myFramework.updateView(dataModel)
})
```