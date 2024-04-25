# What are Microservices? 
Microservices - also known as the microservices architecture - is a software development technique. A variant of the service oriented architecture (SOA), that structures an application as a collection of loosely-coupled, fine-grained services. With microservices, we can organize out back-end as a set of services that are highly maintainable, testable, independently deployable and organized around business capabilities. Oftentimes, they are owned by small team, since microservices encapsulate specific smaller domains. 
The benefits of microservices are numerous, some of the most important ones are:
- **Independent deployments**: we can deploy each service independently, which means we can deploy more often and faster. We can also scale each service independently, which means we can scale only the services that need to be scaled.
- **Modularity**: This makes the application easier to understand, develop, and test. Different teams can work on different services without having to know the details of other services.
- **Technology diversity**:we can use different technologies for different services. For example, we can use Node.js for one service and Java for another service.

but there are also some drawbacks:

- **Complexity**: With microservices we need to deal with distributed systems, which are more complex than monolithic applications. Also, inter-service communication has a higher latency than in-process calls in monolithic applications.
- **Data consistency**: Maintaining data consistency across services is challenging. Some operations may require transactions that span multiple services, which is not that simple to implement.
- **Testing**: Testing microservices is more complex than testing monolithic applications. To test each service in isolation, We need to mock all the other services. Also, we need to test the integration between services (e2e, integration tests).
- **Deployment complexity**: We need to deploy multiple services, which is more complex than deploying a single monolithic application.

This technique is not a silver bullet, and it's not suitable for avery application as it introduces additional complexity and overhead, new problems and new challenges we need to deal with, such as network latency, fault tolerance, data consistency, etc. As software developers, we need to always carefully consider the pros and cons before we decide to use microservices in our application.

# Monolithic Architecture vs Microservices
When working in a monolithic architecture, we have a single application that contains all of our business logic. These monolithic applications are usually divided into modules but all these modules are deployed together as a single unit. These applications are usually deployed onto a single server, and all the modules share the same memory and CPU. The modules communicate with each other using in-process calls, be it function calls, method calls, etc. That's why we can easily share data between modules and we can also transactions that span multiple modules, also we can easily debug monolithic applications as we have a single process and can easily trace the execution flow.
In microservices architecture, we have a set of small services that are deployed independently. Each service is a separate application that contains all of the business logic for a specific domain. These services can communicate with each other using the network via HTTP, TCP, RCP, etc. or message brokers like RabbitMQ, Kafka, etc. 
It is necessary to keep in mind that each architecture has its pros and cons.