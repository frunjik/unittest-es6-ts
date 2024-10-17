import {
    TestCase,
    TestResult,
    TestSuite,
    assertEqual /*, assert*/,
} from "./unittests.js";

class WasRun extends TestCase {
    log: string = "";

    setUp() {
        this.log = "setUp ";
    }

    tearDown() {
        this.log += "tearDown ";
    }

    testMethod() {
        this.log += "testMethod ";
    }

    testBrokenMethod() {
        throw new Error("testBrokenMethod");
    }
}

class TestCaseTest extends TestCase {
    createTestResultWithoutLogging() {
        return new TestResult(true);
    }

    testTemplateMethod() {
        const test = new WasRun("testMethod");
        test.run();
        assertEqual(test.log, "setUp testMethod tearDown ", "log");
    }

    testResult() {
        const test = new WasRun("testMethod");
        const result = test.run();
        assertEqual(result.summary(), "1 run, 0 failed", "summary");
    }

    testFailedResultFormatting() {
        const result = new TestResult(true);
        result.testStarted();
        result.testFailed(({name: 'DUMMYTESTCASE'} as TestCase));
        assertEqual(result.summary(), "1 run, 1 failed", "summary");
    }

    testFailedResult() {
        const test = new WasRun("testBrokenMethod");
        const r = this.createTestResultWithoutLogging();
        test.run(r);
        assertEqual(r.summary(), "1 run, 1 failed", "summary");
    }

    testSuite() {
        const suite = new TestSuite();
        suite.addTest(new WasRun("testMethod"));
        suite.addTest(new WasRun("testBrokenMethod"));
        const r = new TestResult(true);
        suite.run(r);
        assertEqual(r.summary(), "2 run, 1 failed", "summary");
    }

    testAddTests() {
        const suite = new TestSuite(WasRun);
        assertEqual(suite.classes.length, 1);
    }

    testBuildTestCases() {
        const suite = new TestSuite(WasRun);
        assertEqual(suite.buildTestCases().length, 2);
    }
}

function runTests(log: Function) {
    const verbose = true;       // show all ran tests
    const silent  = false;      // dont log errors ..

    const r = new TestResult(silent, verbose, log);
    log(new TestSuite(TestCaseTest).run(r).summary());
}

export { runTests };
