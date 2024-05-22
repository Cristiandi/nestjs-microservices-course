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

# Pattern: Database per Service
Each service has its own dedicated database that cannot be directly accesed by any other services. This pattern is usually used whe we want to achieve a high level of isolation between services, it's also very useful if want to use different database technologies for different services.
So there are a few different ways to keep a service's Persistence Data private.
- **Private-tables-per-service**: Each service owns a set of tables that musy only be accessed by that service. Other services cannt access these tables directly. If other services need to query data on these tables, they must do it through the owning service.
- **Schema per service**: Each service has a database schema that's private to that service.
- **Database server per service**: Each service its own dedicated database server, this approach requires much more resources, but it also provides a higher lever of isolation. While having database per service generally makes a lot of sense for larger rprganizations where teams are working on different services, it's not always the best choice for smaller organizations.

# Orchestration vs Choreography
## Orchestration
is a centralized approach to service coordination. In this approach, we have a central component (called orchestrator) that is responsible for coordinating the execution of services. The orchestrator is aware of the state of each service and knows exactly when to invoke each service. The orchestrator is also responsible for handling errors and retries. Note that this orchestrator could be implemented as either a separate service or it could be part of one of the existing services.

## Choreography
On the other hand, Choreography is a decentralized approach to service coordination. In this approach, each service is responsible for handling its own state and knows exactly when to invoke other services. The services communicate with each other using events. The main advantage of this approach is that it's more flexible and scalable. However, it's also more complex and harder to debug.

Each of these approaches has its own pros and cons as there is no one-size-fits-all solution. In some cases, orchestration might be a better choice, while in others choreography might work out better. It all depends on your specific use case and requirements.

# Data Consistency
In monolithic applications, we might use ACID for our database transactions. Which stands for Atomicity, Consistency, Isolation, and Durability to ensure data consistency however with microservices architectures we don't have this luxury any more, instead we need to come up with a different approaches to ensure data consistency among all our different services.

With some of the different approaches we will achieve eventual consistency, which means that the system will eventually become consistent after a certain period of time. This is in contrast to strong consistency, which means that the system is always consistent. Eventual consistency is a trade-off that we make in distributed systems to achieve better availability and partition tolerance.

## Inbox pattern
The inbox pattern is a pattern that we can use to achieve eventual consistency in our microservices. In this pattern, we have an inbox service that receives messages from other services. When a service wants to update its data, it sends a message to the inbox service. The inbox service then processes the message and updates the data in the database. This way, we can ensure that the data is updated in the correct order and that all services eventually become consistent.

The inbox pattern, though, is more useful on the consumer side, where we have a dedicated table called "inbox" which stores all incoming messages. Instead of outgoing messages as within the outbox pattern. In contrary to the outbox pattern, we first save the message in the inbox table and then return "ACK" the message to the message broker. This way, if the consumer service crashes before sending the ACK the message will be redelivered to the consumer service again. Hence, the guarantee is know as "at least once delivery". However, with the use of the inbox table, we can actually easily check if the message was already processed or not, which usually let us to achieve "exactly once delivery" guarantee.

## Outbox pattern
The outbox pattern is another pattern that we can use to achieve eventual consistency in our microservices. In this pattern, each service has an outbox table that contains messages that need to be sent to other services. When a service wants to update its data, it writes a message to the outbox table. Another service then reads the message from the outbox table and processes it. This way, we can ensure that the data is updated in the correct order and that all services eventually become consistent.

The transactional outbox pattern is a design pattern that could be used to ensure data consistency among different services. In this pattern instead of directly calling other services or sending messages to the message broker as part of the local transaction, We first insert a new message in the databse table called "outbox" and then send it to the other services using a separate process called "outbox processor". For example:

when we creeate a new building into our current system we first insert a new building into the database and then create a new worflow for this building by calling the workflows service. With the transactional outbox pattern. Instead of calling the workflows service we would insert a new record into the outbox table as part of the local database transaction that represents a Task, which eventually call this service. Lastly, we would need a background job or process called Outbox Processor that would periodically checks the outbox table for new messages and send them to the message broker.