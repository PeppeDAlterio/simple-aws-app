package com.sample.app.processor;

import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.SendMessageRequest;
import com.sample.app.repository.OrderCatalogRepository;
import com.sample.app.util.Log;

import java.util.Map;
import java.util.UUID;

public class OrderCatalogRequestProcessor {

    private final OrderCatalogRepository orderCatalogRepository;

    private LambdaLogger logger;

    public OrderCatalogRequestProcessor() {
        this.orderCatalogRepository = new OrderCatalogRepository();
    }

    public void setLogger(LambdaLogger lambdaLogger) {
        this.logger = lambdaLogger;
    }

    public String process(APIGatewayV2HTTPEvent request, RequestType requestType) {

        final String requestBody = request.getBody();
        final Map<String, String> queryStringParameters = request.getQueryStringParameters();
        Log.log(String.format("[%s] queryStringParameters: %s", this.getClass().getSimpleName(), queryStringParameters));

        String response;
        switch (requestType) {
            case NEW_ORDER:
                response = createOrder(requestBody);
                break;

            case GET_ORDER_BY_ID:
                response = getOrderById(queryStringParameters.getOrDefault("id", "-1"));
                break;

            case DELETE_ORDER_BY_ID:
                response = queryStringParameters.getOrDefault("id", "-1");
                break;

            default:
                throw new IllegalArgumentException(String.format("Unknown or no command received: '%s'", requestType));
        }

        Log.log(String.format("[%s] response: %s", this.getClass().getSimpleName(), response));
        return response;

    }

    // very dummy implementation
    String createOrder(String requestBody) {
        AmazonSQS sqs = AmazonSQSClientBuilder.defaultClient();
        String orderId = UUID.randomUUID().toString();
        Log.log(String.format("Sending message: %s", orderId));
        SendMessageRequest orderRequest = new SendMessageRequest()
                .withQueueUrl("STRIPPED_URL")
                .withMessageBody(orderId);
        sqs.sendMessage(orderRequest);
        Log.log("Message sent.");
        return orderId;
    }

    String getOrderById(String orderId) {
        Log.log(String.format("[%s] getOrderById: %s", this.getClass().getSimpleName(), orderId));
        return orderCatalogRepository.getOrderById(orderId);
    }

}
