package com.sample.app.processor;

import org.junit.jupiter.api.Test;

import java.util.UUID;

public class OrderProcessorTest {

    @Test
    void dummyTest() {
        OrderProcessor orderProcessor = new OrderProcessor();
        orderProcessor.process(UUID.randomUUID().toString());
    }

}
