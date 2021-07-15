import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import {Code} from "@aws-cdk/aws-lambda";
import * as iam from "@aws-cdk/aws-iam";
import * as sqs from "@aws-cdk/aws-sqs";
import {SqsEventSource} from "@aws-cdk/aws-lambda-event-sources";
import {Duration} from "@aws-cdk/core";

export class Lambdas extends cdk.Construct {

    public readonly orderProcessorFunction: lambda.Function;
    public readonly createOrderFunction : lambda.Function;
    public readonly getOrderDetailFunction : lambda.Function;
    public readonly deleteOrderFunction : lambda.Function;

    private readonly props: LambdasProps;

    constructor(scope: cdk.Construct, id: string, props: LambdasProps) {
        super(scope, id);


        this.props = props;

        this.orderProcessorFunction = this.createOrderProcessorFunction();
        this.createOrderFunction = this.createCreateOrderFunction();
        this.getOrderDetailFunction = this.createGetOrderDetailFunction();
        this.deleteOrderFunction = this.createDeleteOrderFunction();
    }

    private createOrderProcessorFunction() : lambda.Function {
        return new lambda.Function(this, "OrderProcessorFunction", {
            functionName: "OrderProcessorFunction",
            code: Code.fromAsset("./lambda/target/lambda-1.0-SNAPSHOT.jar"),
            runtime: lambda.Runtime.JAVA_8,
            handler: "com.sample.app.handler.ProcessOrderHandler::newOrder",
            memorySize: 512,
            role: this.props.processOrderFunction.role,
            events: [new SqsEventSource(this.props.processOrderFunction.workloadQueue)],
            timeout: Duration.minutes(5),
        })
    }

    private createCreateOrderFunction() : lambda.Function {
        return new lambda.Function(this, "POST_CreateOrderFunction", {
            functionName: "POST_CreateOrderFunction",
            code: Code.fromAsset("./lambda/target/lambda-1.0-SNAPSHOT.jar"),
            runtime: lambda.Runtime.JAVA_8,
            handler: "com.sample.app.handler.OrderCatalogRequestHandler::postRequest",
            memorySize: 512,
            role: this.props.createOrderFunction.role,
            timeout: Duration.minutes(5),
        })
    }

    private createGetOrderDetailFunction() : lambda.Function {
        return new lambda.Function(this, "GET_OrderDetailFunction", {
            functionName: "GET_OrderDetailFunction",
            code: Code.fromAsset("./lambda/target/lambda-1.0-SNAPSHOT.jar"),
            runtime: lambda.Runtime.JAVA_8,
            handler: "com.sample.app.handler.OrderCatalogRequestHandler::getRequest",
            memorySize: 512,
            role: this.props.getOrderDetailFunction.role,
            timeout: Duration.minutes(5),
        })
    }

    private createDeleteOrderFunction() : lambda.Function {
        return new lambda.Function(this, "DELETE_OrderFunction", {
            functionName: "DELETE_OrderFunction",
            code: Code.fromAsset("./lambda/target/lambda-1.0-SNAPSHOT.jar"),
            runtime: lambda.Runtime.JAVA_8,
            handler: "com.sample.app.handler.OrderCatalogRequestHandler::deleteRequest",
            memorySize: 512,
            role: this.props.deleteOrderFunction.role,
            timeout: Duration.minutes(5),
        })
    }

}

interface LambdasProps {
    getOrderDetailFunction: {
        role: iam.Role,
    },
    deleteOrderFunction: {
        role: iam.Role,
    },
    createOrderFunction: {
        role: iam.Role,
    },
    processOrderFunction: {
        role: iam.Role,
        workloadQueue: sqs.Queue,
    },
}