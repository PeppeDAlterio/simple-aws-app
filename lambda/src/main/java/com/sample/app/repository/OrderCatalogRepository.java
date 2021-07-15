package com.sample.app.repository;

import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.PutItemOutcome;
import com.sample.app.util.Log;

import java.util.concurrent.ThreadLocalRandom;

public class OrderCatalogRepository {

    static AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().build();
    static DynamoDB dynamoDB = new DynamoDB(client);

    public OrderCatalogRepository() {
    }

    public String getOrderById(String id) {
        Log.log(String.format("[%s] getOrderById: %s", this.getClass().getSimpleName(), id));
        try {
            final String order = dynamoDB.getTable("OrderCatalog").getItem("id", id).toJSON();
            Log.log(String.format("[%s] Read order: %s", this.getClass().getSimpleName(), order));
            return order;
        } catch (Exception|Error e) {
            e.printStackTrace();
            Log.log(String.format("[%s] getOrderById failed: %s", this.getClass().getSimpleName(), e.getMessage()));
            return "";
        }
    }

    public String createOrder(String id) {
        Log.log(String.format("[%s] Create Order with id: %s", this.getClass().getSimpleName(), id));
        try {
            Item item = new Item()
                    .with("id", id)
                    .with("name", "TestUser_"+ ThreadLocalRandom.current().nextInt(0,1000))
                    .with("email", "asdfa@asdfasdf.it")
                    .withDouble("price", ThreadLocalRandom.current().nextDouble(1D,1000D));
            dynamoDB.getTable("OrderCatalog").putItem(item);
            Log.log(String.format("[%s] Create order: %s", this.getClass().getSimpleName(), item.toJSON()));
            return item.toJSON();
        } catch (Exception|Error e) {
            e.printStackTrace();
            Log.log(String.format("[%s] Create order failed: %s", this.getClass().getSimpleName(), e.getMessage()));
            return "";
        }
    }

}
