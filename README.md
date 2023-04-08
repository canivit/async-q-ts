# Async Request Queue in TypeScript

During my internship at AWS, I needed to implement an async request queue in Java.

Here are the basic requirements:
- Let's define *Task* to be a function that returns a
[CompletableFuture](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/concurrent/CompletableFuture.html).
- The queue is a function that accepts a list of *Tasks* and integer representing
the maximum number of concurrent *Tasks* we can execute.
- The queue should return a single CompletableFuture that once completed,
should produce the list of results of all the given *Tasks*.
- Calling the queue function must not fail regardless of whether the individual *Tasks* fail or not.

I thought the implementation could become handy in the future so here is the simplified 
Promise based version in TypeScript. It can be useful in situations where we need to 
make large number of async requests as fast as possible to a throttle limited API.
