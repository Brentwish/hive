export const Api = [
  '# Hive',
  '### Welcome to hive, a platform for designing AIs for a simple RTS style game.',
  '>\n',
  '>There are two types of ants: queens and workers.  ',
  '>Queens are capable of laying eggs to hatch workers or more queens.  ',
  '>Workers, being much cheaper than queens, are expendable hunters, gatherers, explorers etc.  ',
  '>Each Ant has the ability to lay a trail which other ants can detect and make decisions off of.  ',
  '```js',
  'if (antData.type === "worker") {',
  '  return {',
  '    type: "move",',
  '    direction: _.sample(dirs),',
  '  }',
  '}',
  '```'
].join("\n");
