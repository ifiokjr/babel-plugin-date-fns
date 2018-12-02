'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;
  return {
    visitor: {
      ImportDeclaration: function ImportDeclaration(path) {
        var node = path.node;
        var specifiers = node.specifiers,
            source = node.source;
        var pkgId = source.value;


        if (!['date-fns', 'date-fns/fp', 'date-fns-tz', 'date-fns-tz/fp'].includes(pkgId)) {
          return;
        }

        if (!specifiers.filter(t.isImportSpecifier).length) {
          return;
        }

        specifiers.forEach(function (spec) {
          var _spec = spec,
              local = _spec.local,
              imported = _spec.imported;
          var localName = local.name;


          var importedPath = pkgId;

          if (t.isImportSpecifier(spec)) {
            var importedName = imported.name;

            spec = t.importDefaultSpecifier(t.identifier(localName));

            importedPath = pkgId + '/' + importedName;
          }

          path.insertAfter(t.importDeclaration([spec], t.stringLiteral(importedPath)));
        });

        path.remove();
      }
    }
  };
};