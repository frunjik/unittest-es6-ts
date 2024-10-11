function assert(expression: any, message: string) {
	if (!!expression) return;
	throw new Error(message || `assertion failed: ${expression}`);
}

function assertEqual(actual: any, expected: any, message: string = '') {
	if (actual === expected) return;
	const m = message || 'assertion failed';
	throw new Error(`${m} expected "${expected}", but got "${actual}"`);
}

class TestSuite {

    tests: TestCase[];

	constructor(testClass?: any) {
		this.tests = [];
		testClass && this.addTests(testClass);
	}
	
	addTest(test: TestCase) {
		this.tests.push(test);
	}

	addTests(testClass: any) {
		Object.getOwnPropertyNames(testClass.prototype)
			.filter(m => m.startsWith('test'))
			.forEach(m => this.addTest(new testClass(m)))
	}

	run(r?: TestResult) {
		const result = r || new TestResult();
		this.tests.forEach(test => test.run(result));
		return result;
	}
}

class TestResult {

    runCount = 0;
    failCount = 0;

	testStarted() {
		this.runCount++;
	}
	
	testFailed(test?: TestCase, error?: any) {
		this.failCount++;
		// console.log(`${test.name} - ${error}`);
	}

	summary() {
		return `${this.runCount} run, ${this.failCount} failed`;
	}
}

class TestCase {

    name: string;

	constructor(name: string) {
		this.name = name;
	}

	run(r?: TestResult) {
		this.setUp();
		const result = r || new TestResult();
		result.testStarted();
		try {
			this[this.name]();
		} catch (error) {
			result.testFailed(this, error);
		}
		this.tearDown();
		return result;
	}

	setUp() {
	}

	tearDown() {
	}
}

export { TestCase, TestResult, TestSuite, assert, assertEqual };
