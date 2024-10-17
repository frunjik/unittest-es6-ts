function assert(expression: any, message: string = '') {
    if (!!expression) return;
    throw new Error(message || `assertion failed: ${expression}`);
}

function assertEqual(actual: any, expected: any, message: string = '') {
    if (actual === expected) return;
    const m = message || 'assertion failed';
    throw new Error(
        `${m} expected "${expected?.toString() ?? expected}", but got "${
            actual?.toString() ?? actual
        }"`
    );
}

class TestSuite {
    classes: any[] = [];

    constructor(testClass?: any) {
        testClass && this.addTests(testClass);
    }

    addTest(test: TestCase) {
        this.classes.push(test);
    }

    addTests(testClass: any) {
        if (Array.isArray(testClass)) {
            for (let c of testClass) this.addTests(c);
        } else {
            this.addTest(testClass);
        }
    }

    run(r?: TestResult) {
        const result = r || new TestResult();
        try {
            this.buildTestCases().forEach((test) => {
                test.run(result)
            });
        } catch(e) {
            console.log(`Error in Test Framework !!! - panic`);
            console.error(e);
            throw e;
        }
        return result;
    }

    buildTestCases(): TestCase[] {
        const result: TestCase[] = [];
        this.classes.forEach((c) => {
            if (c.prototype) {
                Object.getOwnPropertyNames(c.prototype)
                    .filter((m) => m.startsWith('test'))
                    .forEach((m) => result.push(new c(m)));
            } else {
                // its (already) a TestCase instance ... just add it
                result.push(c);
            }
        });
        return result;
    }
}

class TestResult {
    runCount = 0;
    failCount = 0;

    constructor(private preventLogging = false) {}

    testStarted() {
        this.runCount++;
    }

    testFailed(test?: TestCase, error?: any) {
        this.failCount++;
        if (!this.preventLogging) {
            test  && console.log(`${test?.name}`);
            error && console.error(error);
        }
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
            (this as any)[this.name]();
        } catch (error) {
            // console.error(`FAIL - ${this.constructor.name}.${this.name}`);
            result.testFailed(this, error);
        }
        this.tearDown();

        // console.log(`Ok - ${this.constructor.name}.${this.name}`);

        return result;
    }

    setUp() {}

    tearDown() {}
}

export { TestCase, TestResult, TestSuite, assert, assertEqual };
