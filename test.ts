import { Result, Task, createQueue } from "./async-q";

const resolveAfter = <T>(value: T, delay: number): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), delay);
  });

const rejectAfter = <T>(message: string, delay: number): Promise<T> =>
  new Promise((_resolve, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });

const createSuccessTask =
  <T>(value: T, delay: number): Task<T> =>
  () =>
    resolveAfter(value, delay);

const createFailTask =
  <T>(message: string, delay: number): Task<T> =>
  () =>
    rejectAfter(message, delay);

const tasks: Task<number>[] = [
  createSuccessTask(2, 10),
  createSuccessTask(3, 50),
  createFailTask("Failed", 20),
  createSuccessTask(5, 30),
  createSuccessTask(4, 20),
  createFailTask("Failed", 30),
  createSuccessTask(1, 40),
];

const test_q = <T>(
  tasks: Task<T>[],
  expectedResults: Result<T>[],
  maxNumOfWorkers: number,
  minTime: number,
  maxTime: number
) => {
  test(`testing queue with ${maxNumOfWorkers} max number of workers`, async () => {
    const start = Date.now();
    const results = await createQueue(tasks, maxNumOfWorkers);
    const elapsed = Date.now() - start;
    expect(results).toStrictEqual(expectedResults);
    expect(elapsed).toBeGreaterThanOrEqual(minTime);
    expect(elapsed).toBeLessThanOrEqual(maxTime);
  });
};

describe("async request queue", () => {
  const expectedResults = [
    2,
    3,
    new Error("Failed"),
    5,
    4,
    new Error("Failed"),
    1,
  ];
  test_q(tasks, expectedResults, 1, 199, 215);
  test_q(tasks, expectedResults, 2, 99, 115);
  test_q(tasks, expectedResults, 3, 79, 90);
  test_q(tasks, expectedResults, 4, 69, 80);
  test_q(tasks, expectedResults, 5, 59, 70);
  test_q(tasks, expectedResults, 6, 49, 60);
  test_q(tasks, expectedResults, 7, 49, 60);
});
