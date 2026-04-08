class Counter<T> {
    private _value: T | undefined;

    constructor(private val: T) {
        this._value = val;
    }

    public print(): void {
        console.log(this._value);
    }

    public setValue(val: T): void {
        this._value = val;
    }

    public getValue(): T | undefined {
        return this._value;
    }
}


let testCounter = new Counter<number>(10);
testCounter.print(); // Output: 10

testCounter.setValue(20);
testCounter.print(); // Output: 20
const calcVal = !testCounter.getValue() ? 0 : testCounter.getValue()! + 5;
console.log(calcVal); // Output: 25

let stringCounter = new Counter<string>("Hello");
stringCounter.print(); // Output: Hello

stringCounter.setValue("World");
stringCounter.print(); // Output: World
