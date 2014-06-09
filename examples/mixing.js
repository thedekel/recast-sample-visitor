// This is an example of mixing multiple transformers

var recast = require('recast');
var b = recast.builders;
var n = recast.nodeNames;

// mix the main transformer from this repo, with a simple set of visitors
// in the guise of a transformer
var transformer1 = require('../index');
var transformer2 = {
  visitors: {
    visitIdentifier: function(node, traverse) {
      var replacementId = b.identifier(node.name + "__modified");
      traverse(replacementId); // traversal isn't really needed here
      return replacementId;
    },
    visitFunctionExpression: function(node) {
    }
  }
};

// from now on, it's a definition of a new visitor that mixes the two visitors

var resolveVisitorConflicts = function(node, nodeName) {
  // n.nodeName.check should be sufficient, i'm not sure if having `nodeName`
  // as a parameter is needed or a good idea
  if (n.functionExpression.check(node)) {
    return recast.chainVisitors(transformer2, transformer1 /*[, transformer3, ...]*/)
  } else if(n.identifier.check(node)) {
    return null; // return non-function in order to do nothing for a node type
  } else { // default behavior
    return recast.chainVisitors(transformer1, transformer2)
  }
};

// the visitors object should only define cases where a collision otherwise occurs
var visitors = recast.mixVisitors(resolveVisitorConflicts);

function transform(ast) {
  var visitedAst = recast.visitMixed(ast, visitors);
  return visitedAst;
}

function parse(code) {
  var baseAst = recast.parse(code);
  return transform(baseAst);
}

function compile(code, pretty) {
  var baseAst = recast.parse(code);
  var modifiedAst =  transform(baseAst);
  if (pretty) {
    return recsat.prettyPrint(modifiedAst);
  }
  return recast.print(modifiedAst);
}

module.exports = {
  transform: transform,
  parse: parse,
  compile: compile,
  visitors: visitors
};
