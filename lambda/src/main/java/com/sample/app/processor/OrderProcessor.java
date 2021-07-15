package com.sample.app.processor;

import com.amazonaws.services.sns.AmazonSNS;
import com.amazonaws.services.sns.AmazonSNSClientBuilder;
import com.amazonaws.services.sns.model.PublishRequest;
import com.sample.app.repository.OrderCatalogRepository;
import com.sample.app.util.Log;

public class OrderProcessor {

    final OrderCatalogRepository orderCatalogRepository;

    public OrderProcessor() {
        this.orderCatalogRepository = new OrderCatalogRepository();
    }

    public void process(String orderId) {
        String createdOrder = orderCatalogRepository.createOrder(orderId);
        Log.log(String.format("[%s] Sending notification: %s", this.getClass().getSimpleName(), createdOrder));
        AmazonSNS snsClient = AmazonSNSClientBuilder.defaultClient();
        final PublishRequest publishRequest = new PublishRequest("STRIPPED_ARN", createdOrder);
        snsClient.publish(publishRequest);
        Log.log(String.format("[%s] Notification sent.", this.getClass().getSimpleName()));
    }

}
