import TestClass from "./test-class.js";

const testClass = new TestClass(1);
const methodNames=['method1','method2']
testClass[methodNames[1]]()
testClass[methodNames[0]]()