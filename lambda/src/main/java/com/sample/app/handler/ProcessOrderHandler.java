package com.sample.app.handler;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.sample.app.processor.OrderProcessor;
import com.sample.app.util.Log;

public class ProcessOrderHandler {

    final OrderProcessor processor;

    public ProcessOrderHandler() {
        this.processor = new OrderProcessor();
    }

    public void newOrder(SQSEvent event, Context context) {
        Log.setLogger(context.getLogger());
        for (SQSEvent.SQSMessage message : event.getRecords()) {
            Log.log(String.format("[%s] Processing message: %s", this.getClass().getSimpleName(), message));
            processor.process(message.getBody());
        }
    }

}
