import * as cdk from "@aws-cdk/core";
import * as sqs from "@aws-cdk/aws-sqs";

export class Queues extends cdk.Construct {

    public readonly newOrdersQueue : sqs.Queue;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        this.newOrdersQueue = this.createRequestQueue();
    }

    private createRequestQueue() : sqs.Queue {
        return new sqs.Queue(this, "RequestQueue", {
            queueName: "RequestsQueue",
        })
    }
}
