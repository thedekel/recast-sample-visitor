var recast = require('recast');

var visitors = {
  visitNode: visitNode
};

function visitNode(node, traverse) {
  traverse(node);
  return node; // maybe even `return traverse(node);`
}

function transform(ast) {
  var visitedAst = recast.visit(ast, visitors);
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
  compile: compile
};
