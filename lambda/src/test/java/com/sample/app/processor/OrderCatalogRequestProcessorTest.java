package com.sample.app.processor;

import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import org.junit.jupiter.api.Test;

import java.util.HashMap;

public class OrderCatalogRequestProcessorTest {

    @Test
    void process_dummyTest() {
        OrderCatalogRequestProcessor processor = new OrderCatalogRequestProcessor();

        HashMap<String, String> queryParams = new HashMap<>();
        queryParams.put("id", "123");

        processor.process(APIGatewayV2HTTPEvent.builder()
                .withQueryStringParameters(queryParams)
                .build(), RequestType.GET_ORDER_BY_ID);
    }

}
