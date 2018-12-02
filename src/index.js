export default ({ types: t }) => ({
  visitor: {
    ImportDeclaration(path) {
      const { node } = path;
      const { specifiers, source } = node;
      const { value: pkgId } = source;

      if (
        !['date-fns', 'date-fns/fp', 'date-fns-tz', 'date-fns-tz/fp'].includes(
          pkgId,
        )
      ) {
        return;
      }

      if (!specifiers.filter(t.isImportSpecifier).length) {
        return;
      }

      specifiers.forEach(spec => {
        const { local, imported } = spec;
        const { name: localName } = local;

        let importedPath = pkgId;

        if (t.isImportSpecifier(spec)) {
          const { name: importedName } = imported;
          spec = t.importDefaultSpecifier(t.identifier(localName));

          importedPath = `${pkgId}/${importedName}`;
        }

        path.insertAfter(
          t.importDeclaration([spec], t.stringLiteral(importedPath)),
        );
      });

      path.remove();
    },
  },
});
