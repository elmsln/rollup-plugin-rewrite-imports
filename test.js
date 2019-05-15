import test from "ava";
import rollupPluginRewriteImport from "./index";

function rollupTestMacro(t, input, expected) {
  const { renderChunk } = rollupPluginRewriteImport("example/");
  const processedInput = renderChunk(input);
  const expectedResult = expected
    ? {
        code: expected
      }
    : expected;
  t.deepEqual(processedInput, expectedResult);
}
rollupTestMacro.title = (_, input, expected) =>
  `${input} becomes ${expected}`.trim();

test(
  rollupTestMacro,
  'import _ from "lodash";',
  'import _ from "example/lodash";'
);
test(
  rollupTestMacro,
  'import _ from "lodash"',
  'import _ from "example/lodash"'
);
test(rollupTestMacro, 'import "side-effect";', 'import "example/side-effect";');
test(rollupTestMacro, 'import "side-effect"', 'import "example/side-effect"');
test(
  rollupTestMacro,
  'import("side-effect");',
  'import("example/side-effect");'
);
test(rollupTestMacro, 'import("side-effect")', 'import("example/side-effect")');
test(
  rollupTestMacro,
  'const _ = await import("lodash");',
  'const _ = await import("example/lodash");'
);
test(
  rollupTestMacro,
  'const _ = await import("lodash")',
  'const _ = await import("example/lodash")'
);
test(rollupTestMacro, 'let variable = importLikeFunctionName("test")', null);
