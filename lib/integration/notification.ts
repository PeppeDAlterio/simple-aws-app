import * as cdk from "@aws-cdk/core";
import * as sns from "@aws-cdk/aws-sns";

export class Notifications extends cdk.Construct {

    public readonly responseSNSTopic : sns.Topic;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        this.responseSNSTopic = this.createResponseSNSTopic();
    }

    private createResponseSNSTopic() : sns.Topic {
        return new sns.Topic(this, "ResponseTopic", {
            topicName: "ResponseTopic",
            displayName: "ResponseTopic",
        })
    }
}