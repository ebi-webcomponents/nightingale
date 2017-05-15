function Foo(foo, ...args) {
    let [bar, baz] = args;

    for(let arg of args) {
        let bar = 22;
        console.log(`arg: ${arg} bar: ${bar}`);
    }

    console.log(`done: ${bar} :: ${baz}`);
}

module.exports = Foo;