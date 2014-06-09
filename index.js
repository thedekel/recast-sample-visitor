var recast = require('recast');
var b = recast.builders; // more naturals than importing builders from ast-types

var visitors = {
  visitNode: visitNode,
  visitFunctionExpression: visitFunctionExpression
};

function visitNode(node, traverse) {
  traverse(node);
  return node; // maybe even `return traverse(node);`
}

function visitFunctionExpression(node, traverse) {
  //this visitor will replace functions that have a `rest` param with a function
  //that doesn't have the rest param, but instead has its name changed.
  if (node.rest) {
    var newNode = recast.b.functionExpression(
      b.identifier(node.id.name + "WithoutRest"),
      node.params,
      node.body,
      node.generator,
      node.expression
    );
    traverse(newNode); // in-order traversal creates the replacement node, and
                       // only then traverses it
    return newNode;
  } else {
    traverse(node);
    return node;
  }
}

function transform(ast) {
  var visitedAst = recast.visit(ast, visitors);
  return visitedAst;
}

// I think that parse and compile can be defined automatically by recast
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
