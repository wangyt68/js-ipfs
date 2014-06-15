var log = console.log
var Block = logCall(require('./block'))
var List = logCall(require('./list'))
var Tree = logCall(require('./tree'))
var Commit = logCall(require('./commit'))

var b1 = Block({data: new Buffer("b1b1b1")})
var b2 = Block({data: new Buffer("b1b1b1")})
var b3 = Block({data: new Buffer("b1b1b1")})

var l1 = List([b1, b2, b3])
var l2 = List([b1, b2, b3])
var l3 = List({data: {item: [0, 1, 2]}, links: [b1.link(), b2.link(), b3.link()]})
var l4 = List([b1, b2, b2, b2, b3, b3])

// call + log
function logCall(func) {
  return function() {
    log('-------------------------------------------------')
    log('construct ' + func.name)
    var r = func.apply(this, arguments)
    log(r.buffer.toString('hex'))
    return r
  }
}
