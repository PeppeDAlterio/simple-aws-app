import * as cdk from "@aws-cdk/core";
import * as apigateway from '@aws-cdk/aws-apigateway';
import {IFunction} from "@aws-cdk/aws-lambda";

export class RESTGateway extends cdk.Construct {

    public readonly restApi: apigateway.IRestApi;

    private readonly props: RESTGatewayProps;

    constructor(scope: cdk.Construct, id: string, props: RESTGatewayProps) {
        super(scope, id);

        this.props = props;

        this.restApi = new apigateway.RestApi(this, "RestApiGateway", {
            restApiName: "myRestApi",
        })

        let orderResource = this.restApi.root.addResource("order");
        orderResource.addMethod("GET", new apigateway.LambdaIntegration(this.props.getMethodLambdaFunction));
        orderResource.addMethod("DELETE", new apigateway.LambdaIntegration(this.props.deleteMethodLambdaFunction))
        orderResource.addMethod("POST", new apigateway.LambdaIntegration(this.props.postMethodLambdaFunction))
    }

}

interface RESTGatewayProps {
    getMethodLambdaFunction: IFunction,
    deleteMethodLambdaFunction: IFunction,
    postMethodLambdaFunction: IFunction,
}