export type Task<T> = () => Promise<T>;
export type Result<T> = T | Error;

export const createQueue = async <T>(
  tasks: Task<T>[],
  maxNumOfWorkers: number
): Promise<Result<T>[]> => {
  type Signal = (value?: unknown) => void;

  let numOfWorkers = 0;
  let pendingSignals: Signal[] = [];

  const signalFinish = () => {
    numOfWorkers -= 1;
    const resolve = pendingSignals.shift();
    if (resolve) {
      resolve();
    }
  };

  const waitWorkers = async () => {
    if (numOfWorkers < maxNumOfWorkers) {
      numOfWorkers += 1;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      pendingSignals.push(resolve);
    });
  };

  const handleTask = async (task: Task<T>): Promise<Result<T>> => {
    try {
      return await task();
    } catch (err) {
      if (err instanceof Error) {
        return err;
      }
      return new Error(String(err));
    } finally {
      signalFinish();
    }
  };

  const results = tasks.map(async (task) => {
    await waitWorkers();
    return handleTask(task);
  });
  return await Promise.all(results);
};
