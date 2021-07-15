import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import {ManagedPolicy} from "@aws-cdk/aws-iam";

export class Roles extends cdk.Construct {

    public readonly awsLambdaBasicExecutionManagedPolicy: iam.IManagedPolicy;
    public readonly lambdaGetOrderDetailFunction: iam.Role;
    public readonly lambdaDeleteOrderDetailFunction: iam.Role;
    public readonly lambdaCreateOrderFunction: iam.Role;
    public readonly lambdaOrderProcessorFunction: iam.Role;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        this.awsLambdaBasicExecutionManagedPolicy = this.createAWSLambdaBasicExecutionManagedPolicy();
        this.lambdaGetOrderDetailFunction = this.createGetOrderDetailFunctionRole();
        this.lambdaDeleteOrderDetailFunction = this.createDeleteOrderFunctionRole();
        this.lambdaCreateOrderFunction = this.createCreateOrderFunctionRole();
        this.lambdaOrderProcessorFunction = this.createOrderProcessorFunctionRole();

        this.lambdaGetOrderDetailFunction.addManagedPolicy(this.awsLambdaBasicExecutionManagedPolicy);
        this.lambdaDeleteOrderDetailFunction.addManagedPolicy(this.awsLambdaBasicExecutionManagedPolicy);
        this.lambdaCreateOrderFunction.addManagedPolicy(this.awsLambdaBasicExecutionManagedPolicy);
        this.lambdaOrderProcessorFunction.addManagedPolicy(this.awsLambdaBasicExecutionManagedPolicy);
    }

    private createAWSLambdaBasicExecutionManagedPolicy() {
        return ManagedPolicy.fromManagedPolicyArn(this, "AWSLambdaBasicExecutionRole",
            "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole");
    }

    private createOrderProcessorFunctionRole() {
        return new iam.Role(this, "LambdaOrderProcessorRole", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });
    }

    private createCreateOrderFunctionRole(): iam.Role {
        return new iam.Role(this, "LambdaCreateOrderDetailRole", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });
    }

    private createGetOrderDetailFunctionRole(): iam.Role {
        return new iam.Role(this, "LambdaGetOrderDetailRole", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });
    }

    private createDeleteOrderFunctionRole(): iam.Role {
        return new iam.Role(this, "LambdaDeleteOrderRole", {
            assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        });
    }

}