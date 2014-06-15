var fs = require('fs')
var inherits = require('inherits')
var protobuf = require('ipfs-protobuf-codec')
var multihashing = require('multihashing')

module.exports = ipfsObject

function ipfsObject(data) {
  if (!(this instanceof ipfsObject))
    return new ipfsObject(data)

  data = data || new Buffer(0)
  if (!(data instanceof Buffer))
    data = ipfsObject.encode(data)

  this.buffer = data
}

ipfsObject.inherits = function(child, parent) {
  return inherits(child, parent || ipfsObject)
}

// override this to provide custom behavior to
// objects. Lists can concatenate, for example.
ipfsObject.prototype.data = function() {
  return this.rawData()
}

// returns the data of this object raw, encoded.
ipfsObject.prototype.rawData = function() {
  return this.decode().data
}

// returns all the links within this object
ipfsObject.prototype.links = function() {
  return this.decode().links
}

// returns size of this object (encoded)
ipfsObject.prototype.size = function() {
  return this.buffer.length
}

// returns link to _this_ object
ipfsObject.prototype.link = function(name) {
  return ipfsObject.link(this.multihash(), name, this.size())
}

ipfsObject.prototype.decode = function() {
  return ipfsObject.codec.decode(this.buffer)
}

ipfsObject.prototype.encode = function() {
  return this.buffer
}

ipfsObject.prototype.multihash = function() {
  if (!this._multihash) // lazy construction.
    this._multihash = multihashing(this.buffer, 'sha1')
  return this._multihash
}

ipfsObject.encode = function encode(data) {
  try {
    return ipfsObject.codec.encode(data)
  } catch (e) {
    throw new Error("Encoding ipfs object: " + e)
  }
}

ipfsObject.link = function(hash, name, size) {
  var o = {}
  if (hash) o.hash = hash
  if (name) o.name = name
  if (size) o.size = size
  return o
}

var src = fs.readFileSync(__dirname + '/object.proto', 'utf-8')
var protos = protobuf.fromProtoSrc(src)
ipfsObject.codec = protos.Object
