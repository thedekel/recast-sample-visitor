# Recast Sample Visitor

The idea behind this repo is that recast needs a solid canonical API for
writing specific transforms and visitors that will allow for some additional
extensibility and better lend themselves for some not-yet-supported use-cases
such as reverse traversal, visitors mixing, et al.


## This repo as a transformer and a visitor

This repo acts as a transformer and a visitor by itself and could be either
included in a project that uses recast to define a more complicated transformer
or simply executed in any generic project on either a file or string of code or
an AST that has been produced by recast/esprima to produce either printed (or
pretty-printed) output code, or yield an AST that might be passed through other
transformers or simply printed.


## goals/specifics

Ideally, a transformer that uses Recast should do the following:

1. Expose a `transform` function that can be run on ASTs with something
simple like `require('my-recast-transformer').transform(myAST);`
2. Similarly, expose a `parse` function that reads a code-string and
produces an AST from that, and a `compile` function that reads a code-string
and produces a printed code-string post-transform. Internally, `parse` and
`compile` will likely use the `transform` function.
3. Define specific node visitor methods that will be run whenever a node of
a corresponding type is found while recast traverses an AST. This visitor method
will either return quickly if no change is needed (returning the original node),
or alter (or replace) the provided node, and request that the traversal
continue.
4. A transformer should be able to decide whether recast should traverse an AST
in standard (from the root to the leaves) or reversed order. This could
potentially be done implicitly through #3, by deciding when child nodes are
traversed on a per-node basis.
