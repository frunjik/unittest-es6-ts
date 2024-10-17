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
        const result = new TestResult();
        result.testStarted();
        result.testFailed(({name: 'test'} as TestCase));
        assertEqual(result.summary(), "1 run, 1 failed", "summary");
    }

    testFailedResult() {
        const test = new WasRun("testBrokenMethod");
        const result = test.run();
        assertEqual(result.summary(), "1 run, 1 failed", "summary");
    }

    testSuite() {
        const suite = new TestSuite();
        suite.addTest(new WasRun("testMethod"));
        suite.addTest(new WasRun("testBrokenMethod"));
        const result = suite.run();
        assertEqual(result.summary(), "2 run, 1 failed", "summary");
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
    log(new TestSuite(TestCaseTest).run().summary());
}

export { runTests };
