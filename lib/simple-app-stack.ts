import * as cdk from '@aws-cdk/core';
import {Queues} from "./integration/queues";
import {Notifications} from "./integration/notification";
import {Lambdas} from "./compute/lambda";
import {RESTGateway} from "./api/gateway";
import {Databases} from "./storage/database";
import {Roles} from "./iam/roles";

export class SimpleAppStack extends cdk.Stack {

    private readonly appQueues: Queues;
    private readonly appNotification: Notifications;
    private readonly appLambdas: Lambdas;
    private readonly appApiGateway: RESTGateway;
    private readonly appDatabases: Databases;
    private readonly appRoles: Roles;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.appRoles = new Roles(this, "IAMRoles");
        this.appDatabases = new Databases(this, "Databases");
        this.appQueues = new Queues(this, "Queues");
        this.appNotification = new Notifications(this, "Notifications");
        this.appLambdas = new Lambdas(this, "Lambdas", {
            getOrderDetailFunction: {
                role: this.appRoles.lambdaGetOrderDetailFunction,
            },
            deleteOrderFunction: {
                role: this.appRoles.lambdaDeleteOrderDetailFunction,
            },
            createOrderFunction: {
                role: this.appRoles.lambdaCreateOrderFunction,
            },
            processOrderFunction: {
                role: this.appRoles.lambdaOrderProcessorFunction,
                workloadQueue: this.appQueues.newOrdersQueue,
            }
        });
        this.appApiGateway = new RESTGateway(this, "RESTApi", {
            getMethodLambdaFunction: this.appLambdas.getOrderDetailFunction,
            deleteMethodLambdaFunction: this.appLambdas.deleteOrderFunction,
            postMethodLambdaFunction: this.appLambdas.createOrderFunction,
        });

        this.permissions();
    }

    private permissions() {
        this.appDatabases.orderCatalogTable.grantReadData(this.appRoles.lambdaGetOrderDetailFunction);
        this.appDatabases.orderCatalogTable.grantWriteData(this.appRoles.lambdaDeleteOrderDetailFunction);
        this.appDatabases.orderCatalogTable.grantWriteData(this.appRoles.lambdaOrderProcessorFunction);

        this.appNotification.responseSNSTopic.grantPublish(this.appRoles.lambdaOrderProcessorFunction);

        this.appQueues.newOrdersQueue.grantSendMessages(this.appRoles.lambdaCreateOrderFunction);
        this.appQueues.newOrdersQueue.grantConsumeMessages(this.appRoles.lambdaOrderProcessorFunction);
    }

}