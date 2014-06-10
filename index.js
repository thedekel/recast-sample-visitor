var recast = require('recast');
var b = recast.builders; // more naturals than importing builders from ast-types

var visitors = {
  visitNode: visitNode,
  visitFunctionExpression: visitFunctionExpression
};

function visitNode(nodePath) {
  // this might be a good way to do logging by iterating on every node
  // although in this case, you probably only need `visitIdentifier`
  if (nodePath.value.name && nodePath.value.name === "foo") {
    console.log("detected a node named 'foo'");
  }
  return nodePath.traverse();
}

function visitFunctionExpression(nodePath) {
  //this visitor will replace functions that have a `rest` param with a function
  //that doesn't have the rest param, but instead has its name changed.
  if (nodePath.value.rest) {
    var newNode = recast.b.functionExpression(
      b.identifier(node.id.name + "WithoutRest"),
      node.params,
      node.body,
      node.generator,
      node.expression
    );
    // calling replace on nodePath removes the need to call `traverse`
    return nodePath.replace(newNode); 
  } else {
    return nodePath.traverse();
  }
}

function transform(ast) {
  var visitedAst = recast.visit(ast, visitors);
  return visitedAst;
}

module.exports = {
  transform: transform,
  parse: recast.genParse(transform),
  compile: recsat.genCompile(transform),
  visitors: visitors
};
