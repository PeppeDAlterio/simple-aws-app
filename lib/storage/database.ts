import * as cdk from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";

export class Databases extends cdk.Construct {

    public readonly orderCatalogTable : dynamodb.Table;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        this.orderCatalogTable = this.createOrderCatalogTable();
    }

    private createOrderCatalogTable() : dynamodb.Table {
        return new dynamodb.Table(this, "OrderCatalog", {
            tableName: "OrderCatalog",
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        })
    }
}