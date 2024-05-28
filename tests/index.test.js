import test from 'ava';

let tests = [
];

if (tests.find(({ only }) => only)) {
    tests = tests.filter(({ only }) => only);
}

test('foo', t => {
    t.pass();
})
