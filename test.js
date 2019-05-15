import test from "ava";
import rollupPluginRewriteImport from "./index";

test("static import from", t => {
  const { renderChunk } = rollupPluginRewriteImport("example/");
  t.deepEqual(renderChunk('import _ from "lodash";'), {
    code: 'import _ from "example/lodash";'
  });
});

test("static import side effect", async t => {
  const { renderChunk } = rollupPluginRewriteImport("example/");
  t.deepEqual(renderChunk('import "side-effect";'), {
    code: 'import "example/side-effect";'
  });
});

test("dynamic import side effect", async t => {
  const { renderChunk } = rollupPluginRewriteImport("example/");
  t.deepEqual(renderChunk('import("side-effect");'), {
    code: 'import("example/side-effect");'
  });
});

test("dynamic import var", async t => {
  const { renderChunk } = rollupPluginRewriteImport("example/");
  t.deepEqual(renderChunk('const _ = await import("lodash");'), {
    code: 'const _ = await import("example/lodash");'
  });
});
