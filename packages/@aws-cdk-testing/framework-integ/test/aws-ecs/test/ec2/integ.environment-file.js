"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const iam = require("aws-cdk-lib/aws-iam");
const s3 = require("aws-cdk-lib/aws-s3");
const s3deployment = require("aws-cdk-lib/aws-s3-deployment");
const cdk = require("aws-cdk-lib");
const ecs = require("aws-cdk-lib/aws-ecs");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
// S3 bucket to host envfile without public access
const bucket = new s3.Bucket(stack, 'Bucket', {
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
});
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
// ECS cluster to host EC2 task
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
    instanceType: new ec2.InstanceType('t2.micro'),
});
// permit EC2 task to read envfiles from S3
const s3PolicyStatement = new iam.PolicyStatement({
    actions: ['s3:GetBucketLocation', 's3:GetObject'],
});
s3PolicyStatement.addAllResources();
const executionRole = new iam.Role(stack, 'ExecutionRole', {
    assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    inlinePolicies: {
        s3Policy: new iam.PolicyDocument({
            statements: [s3PolicyStatement],
        }),
    },
});
// define task to run the container with envfiles
const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDefinition', {
    executionRole,
    networkMode: ecs.NetworkMode.AWS_VPC,
});
// deploy an envfile to S3 and delete when the bucket is deleted
const envFileDeployment = new s3deployment.BucketDeployment(stack, 'EnvFileDeployment', {
    destinationBucket: bucket,
    sources: [s3deployment.Source.asset(path.join(__dirname, '../demo-envfiles'))],
});
// define container with envfiles - one from local disk and another from S3
const containerDefinition = new ecs.ContainerDefinition(stack, 'Container', {
    environmentFiles: [
        ecs.EnvironmentFile.fromAsset(path.join(__dirname, '../demo-envfiles/test-envfile.env')),
        ecs.EnvironmentFile.fromBucket(bucket, 'test-envfile.env'),
    ],
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 256,
    taskDefinition,
});
containerDefinition.node.addDependency(envFileDeployment);
// define a service to run the task definition
new ecs.Ec2Service(stack, 'Service', {
    cluster,
    taskDefinition,
});
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuZW52aXJvbm1lbnQtZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLmVudmlyb25tZW50LWZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNkI7QUFDN0IsMkNBQTJDO0FBQzNDLDJDQUEyQztBQUMzQyx5Q0FBeUM7QUFDekMsOERBQThEO0FBQzlELG1DQUFtQztBQUNuQywyQ0FBMkM7QUFFM0MsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDMUIsTUFBTSxLQUFLLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUVsRCxrREFBa0Q7QUFDbEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUU7SUFDNUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLGlCQUFpQixDQUFDLFNBQVM7SUFDakQsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztJQUN4QyxpQkFBaUIsRUFBRSxJQUFJO0NBQ3hCLENBQUMsQ0FBQztBQUNILE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFckQsK0JBQStCO0FBQy9CLE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUM5RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFO0lBQzdDLFlBQVksRUFBRSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDO0NBQy9DLENBQUMsQ0FBQztBQUVILDJDQUEyQztBQUMzQyxNQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQztJQUNoRCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxjQUFjLENBQUM7Q0FDbEQsQ0FBQyxDQUFDO0FBRUgsaUJBQWlCLENBQUMsZUFBZSxFQUFFLENBQUM7QUFFcEMsTUFBTSxhQUFhLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxlQUFlLEVBQUU7SUFDekQsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLHlCQUF5QixDQUFDO0lBQzlELGNBQWMsRUFBRTtRQUNkLFFBQVEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUM7WUFDL0IsVUFBVSxFQUFFLENBQUMsaUJBQWlCLENBQUM7U0FDaEMsQ0FBQztLQUNIO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsaURBQWlEO0FBQ2pELE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRTtJQUN4RSxhQUFhO0lBQ2IsV0FBVyxFQUFFLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTztDQUNyQyxDQUFDLENBQUM7QUFFSCxnRUFBZ0U7QUFDaEUsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsbUJBQW1CLEVBQUU7SUFDdEYsaUJBQWlCLEVBQUUsTUFBTTtJQUN6QixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxDQUFDLENBQUM7Q0FDL0UsQ0FBQyxDQUFDO0FBRUgsMkVBQTJFO0FBQzNFLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRTtJQUMxRSxnQkFBZ0IsRUFBRTtRQUNoQixHQUFHLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3hGLEdBQUcsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQztLQUMzRDtJQUNELEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztJQUNsRSxjQUFjLEVBQUUsR0FBRztJQUNuQixjQUFjO0NBQ2YsQ0FBQyxDQUFDO0FBRUgsbUJBQW1CLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRTFELDhDQUE4QztBQUM5QyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLFNBQVMsRUFBRTtJQUNuQyxPQUFPO0lBQ1AsY0FBYztDQUNmLENBQUMsQ0FBQztBQUVILEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWlhbSc7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgczNkZXBsb3ltZW50IGZyb20gJ2F3cy1jZGstbGliL2F3cy1zMy1kZXBsb3ltZW50JztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjcyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBzdGFjayA9IG5ldyBjZGsuU3RhY2soYXBwLCAnYXdzLWVjcy1pbnRlZycpO1xuXG4vLyBTMyBidWNrZXQgdG8gaG9zdCBlbnZmaWxlIHdpdGhvdXQgcHVibGljIGFjY2Vzc1xuY29uc3QgYnVja2V0ID0gbmV3IHMzLkJ1Y2tldChzdGFjaywgJ0J1Y2tldCcsIHtcbiAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTCxcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsXG59KTtcbmNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHN0YWNrLCAnVnBjJywgeyBtYXhBenM6IDIgfSk7XG5cbi8vIEVDUyBjbHVzdGVyIHRvIGhvc3QgRUMyIHRhc2tcbmNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIoc3RhY2ssICdFY3NDbHVzdGVyJywgeyB2cGMgfSk7XG5jbHVzdGVyLmFkZENhcGFjaXR5KCdEZWZhdWx0QXV0b1NjYWxpbmdHcm91cCcsIHtcbiAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZSgndDIubWljcm8nKSxcbn0pO1xuXG4vLyBwZXJtaXQgRUMyIHRhc2sgdG8gcmVhZCBlbnZmaWxlcyBmcm9tIFMzXG5jb25zdCBzM1BvbGljeVN0YXRlbWVudCA9IG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcbiAgYWN0aW9uczogWydzMzpHZXRCdWNrZXRMb2NhdGlvbicsICdzMzpHZXRPYmplY3QnXSxcbn0pO1xuXG5zM1BvbGljeVN0YXRlbWVudC5hZGRBbGxSZXNvdXJjZXMoKTtcblxuY29uc3QgZXhlY3V0aW9uUm9sZSA9IG5ldyBpYW0uUm9sZShzdGFjaywgJ0V4ZWN1dGlvblJvbGUnLCB7XG4gIGFzc3VtZWRCeTogbmV3IGlhbS5TZXJ2aWNlUHJpbmNpcGFsKCdlY3MtdGFza3MuYW1hem9uYXdzLmNvbScpLFxuICBpbmxpbmVQb2xpY2llczoge1xuICAgIHMzUG9saWN5OiBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcbiAgICAgIHN0YXRlbWVudHM6IFtzM1BvbGljeVN0YXRlbWVudF0sXG4gICAgfSksXG4gIH0sXG59KTtcblxuLy8gZGVmaW5lIHRhc2sgdG8gcnVuIHRoZSBjb250YWluZXIgd2l0aCBlbnZmaWxlc1xuY29uc3QgdGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKHN0YWNrLCAnVGFza0RlZmluaXRpb24nLCB7XG4gIGV4ZWN1dGlvblJvbGUsXG4gIG5ldHdvcmtNb2RlOiBlY3MuTmV0d29ya01vZGUuQVdTX1ZQQyxcbn0pO1xuXG4vLyBkZXBsb3kgYW4gZW52ZmlsZSB0byBTMyBhbmQgZGVsZXRlIHdoZW4gdGhlIGJ1Y2tldCBpcyBkZWxldGVkXG5jb25zdCBlbnZGaWxlRGVwbG95bWVudCA9IG5ldyBzM2RlcGxveW1lbnQuQnVja2V0RGVwbG95bWVudChzdGFjaywgJ0VudkZpbGVEZXBsb3ltZW50Jywge1xuICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0LFxuICBzb3VyY2VzOiBbczNkZXBsb3ltZW50LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vZGVtby1lbnZmaWxlcycpKV0sXG59KTtcblxuLy8gZGVmaW5lIGNvbnRhaW5lciB3aXRoIGVudmZpbGVzIC0gb25lIGZyb20gbG9jYWwgZGlzayBhbmQgYW5vdGhlciBmcm9tIFMzXG5jb25zdCBjb250YWluZXJEZWZpbml0aW9uID0gbmV3IGVjcy5Db250YWluZXJEZWZpbml0aW9uKHN0YWNrLCAnQ29udGFpbmVyJywge1xuICBlbnZpcm9ubWVudEZpbGVzOiBbXG4gICAgZWNzLkVudmlyb25tZW50RmlsZS5mcm9tQXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2RlbW8tZW52ZmlsZXMvdGVzdC1lbnZmaWxlLmVudicpKSxcbiAgICBlY3MuRW52aXJvbm1lbnRGaWxlLmZyb21CdWNrZXQoYnVja2V0LCAndGVzdC1lbnZmaWxlLmVudicpLFxuICBdLFxuICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeSgnYW1hem9uL2FtYXpvbi1lY3Mtc2FtcGxlJyksXG4gIG1lbW9yeUxpbWl0TWlCOiAyNTYsXG4gIHRhc2tEZWZpbml0aW9uLFxufSk7XG5cbmNvbnRhaW5lckRlZmluaXRpb24ubm9kZS5hZGREZXBlbmRlbmN5KGVudkZpbGVEZXBsb3ltZW50KTtcblxuLy8gZGVmaW5lIGEgc2VydmljZSB0byBydW4gdGhlIHRhc2sgZGVmaW5pdGlvblxubmV3IGVjcy5FYzJTZXJ2aWNlKHN0YWNrLCAnU2VydmljZScsIHtcbiAgY2x1c3RlcixcbiAgdGFza0RlZmluaXRpb24sXG59KTtcblxuYXBwLnN5bnRoKCk7XG4iXX0=