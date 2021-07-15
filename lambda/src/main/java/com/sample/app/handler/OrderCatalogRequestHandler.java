package com.sample.app.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.LambdaLogger;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.sample.app.processor.OrderCatalogRequestProcessor;
import com.sample.app.processor.RequestType;
import com.sample.app.util.Log;

import java.util.HashMap;

public class OrderCatalogRequestHandler {

    private final OrderCatalogRequestProcessor processor;

    public OrderCatalogRequestHandler() {
        processor = new OrderCatalogRequestProcessor();
    }

    public APIGatewayV2HTTPResponse getRequest(APIGatewayV2HTTPEvent request, Context context) {
        Log.setLogger(context.getLogger());
        Log.log(String.format("Handling request: %s", request));

        try {
            HashMap<String, String> headers = new HashMap<>();
            headers.put("Content-Type", "application/json");

            return APIGatewayV2HTTPResponse.builder()
                    .withStatusCode(200)
                    .withIsBase64Encoded(false)
                    .withHeaders(headers)
                    .withBody(processor.process(request, RequestType.GET_ORDER_BY_ID))
                    .build();
        } catch (Exception|Error e) {
            e.printStackTrace();
            Log.log(e.getMessage());
            return APIGatewayV2HTTPResponse.builder()
                    .withStatusCode(500)
                    .withIsBase64Encoded(false)
                    .withBody(e.getMessage())
                    .build();
        }
    }

    public APIGatewayV2HTTPResponse deleteRequest(APIGatewayV2HTTPEvent request, Context context) {
        Log.setLogger(context.getLogger());
        Log.log(String.format("Handling request: %s", request));

        HashMap<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");

        return APIGatewayV2HTTPResponse.builder()
                .withStatusCode(200)
                .withIsBase64Encoded(false)
                .withHeaders(headers)
                .withBody(processor.process(request, RequestType.DELETE_ORDER_BY_ID))
                .build();
    }

    public APIGatewayV2HTTPResponse postRequest(APIGatewayV2HTTPEvent request, Context context) {
        Log.setLogger(context.getLogger());
        Log.log(String.format("Handling request: %s", request));

        HashMap<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "text/plain");

        return APIGatewayV2HTTPResponse.builder()
                .withStatusCode(200)
                .withIsBase64Encoded(false)
                .withHeaders(headers)
                .withBody(processor.process(request, RequestType.NEW_ORDER))
                .build();
    }

}
