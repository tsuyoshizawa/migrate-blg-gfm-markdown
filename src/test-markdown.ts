import { processMarkdownHeaders } from './markdown-processor';

// Test cases for markdown header processing
const testCases = [
  {
    name: 'Headers without spaces',
    input: '#Title\n##Subtitle\n###Section',
    expected: '# Title\n## Subtitle\n### Section'
  },
  {
    name: 'Mixed headers (some with spaces, some without)',
    input: '# Already Good\n##NeedsSpace\n### Also Good\n####AnotherOne',
    expected: '# Already Good\n## NeedsSpace\n### Also Good\n#### AnotherOne'
  },
  {
    name: 'Headers in middle of content',
    input: 'Some text\n#Header\nMore text\n##Another\nEnd',
    expected: 'Some text\n# Header\nMore text\n## Another\nEnd'
  },
  {
    name: 'No headers',
    input: 'Just regular text\nwith no headers',
    expected: 'Just regular text\nwith no headers'
  },
  {
    name: 'Headers with multiple #',
    input: '######DeepHeader\n#####Five\n####Four',
    expected: '###### DeepHeader\n##### Five\n#### Four'
  },
  {
    name: 'Empty content',
    input: '',
    expected: ''
  }
];

console.log('🧪 Testing Markdown Header Processing\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = processMarkdownHeaders(testCase.input, 'test', index);
  
  if (result.content === testCase.expected) {
    console.log(`✅ Test ${index + 1}: ${testCase.name}`);
    passed++;
  } else {
    console.log(`❌ Test ${index + 1}: ${testCase.name}`);
    console.log(`   Expected: ${JSON.stringify(testCase.expected)}`);
    console.log(`   Got:      ${JSON.stringify(result.content)}`);
    failed++;
  }
});

console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('🎉 All tests passed!');
} else {
  console.log('❌ Some tests failed');
  process.exit(1);
}
