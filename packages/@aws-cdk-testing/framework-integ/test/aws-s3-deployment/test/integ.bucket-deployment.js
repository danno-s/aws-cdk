"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ec2 = require("aws-cdk-lib/aws-ec2");
const s3 = require("aws-cdk-lib/aws-s3");
const cdk = require("aws-cdk-lib");
const integ = require("@aws-cdk/integ-tests-alpha");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const s3deploy = require("aws-cdk-lib/aws-s3-deployment");
class TestBucketDeployment extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const destinationBucket = new s3.Bucket(this, 'Destination', {
            websiteIndexDocument: 'index.html',
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // needed for integration test cleanup
        });
        new s3deploy.BucketDeployment(this, 'DeployMe', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket,
            retainOnDelete: false, // default is true, which will block the integration test cleanup
        });
        new s3deploy.BucketDeployment(this, 'DeployMeWithEfsStorage', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket,
            destinationKeyPrefix: 'efs/',
            useEfs: true,
            vpc: new ec2.Vpc(this, 'InlineVpc'),
            retainOnDelete: false, // default is true, which will block the integration test cleanup
        });
        const bucket2 = new s3.Bucket(this, 'Destination2', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // needed for integration test cleanup
        });
        new s3deploy.BucketDeployment(this, 'DeployWithPrefix', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket: bucket2,
            destinationKeyPrefix: 'deploy/here/',
            retainOnDelete: false, // default is true, which will block the integration test cleanup
        });
        const bucket3 = new s3.Bucket(this, 'Destination3', {
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // needed for integration test cleanup
        });
        new s3deploy.BucketDeployment(this, 'DeployWithMetadata', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket: bucket3,
            retainOnDelete: false,
            cacheControl: [s3deploy.CacheControl.setPublic(), s3deploy.CacheControl.maxAge(cdk.Duration.minutes(1))],
            contentType: 'text/html',
            metadata: { A: 'aaa', B: 'bbb', C: 'ccc' },
        });
        new s3deploy.BucketDeployment(this, 'DeployMeWithoutDeletingFilesOnDestination', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket,
            prune: false,
            retainOnDelete: false,
        });
        new s3deploy.BucketDeployment(this, 'DeployMeWithExcludedFilesOnDestination', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket,
            exclude: ['*.gif'],
            retainOnDelete: false,
        });
        const bucket4 = new s3.Bucket(this, 'Destination4', {
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // needed for integration test cleanup
        });
        new s3deploy.BucketDeployment(this, 'DeployMeWithoutExtractingFilesOnDestination', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website'))],
            destinationBucket: bucket4,
            extract: false,
            retainOnDelete: false,
        });
        this.bucket5 = new s3.Bucket(this, 'Destination5', {
            publicReadAccess: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true, // needed for integration test cleanup
        });
        const deploy5 = new s3deploy.BucketDeployment(this, 'DeployMe5', {
            sources: [s3deploy.Source.asset(path.join(__dirname, 'my-website-second'))],
            destinationBucket: this.bucket5,
            retainOnDelete: false, // default is true, which will block the integration test cleanup
        });
        deploy5.addSource(s3deploy.Source.data('some-key', 'helloworld'));
    }
}
const app = new cdk.App();
const testCase = new TestBucketDeployment(app, 'test-bucket-deployments-2');
// Assert that DeployMeWithoutExtractingFilesOnDestination deploys a zip file to bucket4
const integTest = new integ.IntegTest(app, 'integ-test-bucket-deployments', {
    testCases: [testCase],
});
const listObjectsCall = integTest.assertions.awsApiCall('S3', 'listObjects', {
    Bucket: testCase.bucket5.bucketName,
});
listObjectsCall.provider.addToRolePolicy({
    Effect: 'Allow',
    Action: ['s3:GetObject', 's3:ListBucket'],
    Resource: ['*'],
});
listObjectsCall.expect(integ.ExpectedResult.objectLike({
    Contents: integ_tests_alpha_1.Match.arrayWith([
        integ_tests_alpha_1.Match.objectLike({
            Key: '403.html',
        }),
        integ_tests_alpha_1.Match.objectLike({
            Key: 'some-key',
        }),
    ]),
}));
app.synth();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcuYnVja2V0LWRlcGxveW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5idWNrZXQtZGVwbG95bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE2QjtBQUM3QiwyQ0FBMkM7QUFDM0MseUNBQXlDO0FBQ3pDLG1DQUFtQztBQUNuQyxvREFBb0Q7QUFDcEQsa0VBQW1EO0FBRW5ELDBEQUEwRDtBQUUxRCxNQUFNLG9CQUFxQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBRTFDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUMzRCxvQkFBb0IsRUFBRSxZQUFZO1lBQ2xDLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxhQUFhLENBQUMsT0FBTztZQUN4QyxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsc0NBQXNDO1NBQ2hFLENBQUMsQ0FBQztRQUVILElBQUksUUFBUSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNwRSxpQkFBaUI7WUFDakIsY0FBYyxFQUFFLEtBQUssRUFBRSxpRUFBaUU7U0FDekYsQ0FBQyxDQUFDO1FBRUgsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLHdCQUF3QixFQUFFO1lBQzVELE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxF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QW9CLENBQUMsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUM7QUFFNUUsd0ZBQXdGO0FBQ3hGLE1BQU0sU0FBUyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsK0JBQStCLEVBQUU7SUFDMUUsU0FBUyxFQUFFLENBQUMsUUFBUSxDQUFDO0NBQ3RCLENBQUMsQ0FBQztBQUNILE1BQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxhQUFhLEVBQUU7SUFDM0UsTUFBTSxFQUFFLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVTtDQUNwQyxDQUFDLENBQUM7QUFDSCxlQUFlLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQztJQUN2QyxNQUFNLEVBQUUsT0FBTztJQUNmLE1BQU0sRUFBRSxDQUFDLGNBQWMsRUFBRSxlQUFlLENBQUM7SUFDekMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDO0NBQ2hCLENBQUMsQ0FBQztBQUNILGVBQWUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUM7SUFDckQsUUFBUSxFQUFFLHlCQUFLLENBQUMsU0FBUyxDQUN2QjtRQUNFLHlCQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2YsR0FBRyxFQUFFLFVBQVU7U0FDaEIsQ0FBQztRQUNGLHlCQUFLLENBQUMsVUFBVSxDQUFDO1lBQ2YsR0FBRyxFQUFFLFVBQVU7U0FDaEIsQ0FBQztLQUNILENBQ0Y7Q0FDRixDQUFDLENBQUMsQ0FBQztBQUVKLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBlYzIgZnJvbSAnYXdzLWNkay1saWIvYXdzLWVjMic7XG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCAqIGFzIGludGVnIGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCB7IE1hdGNoIH0gZnJvbSAnQGF3cy1jZGsvaW50ZWctdGVzdHMtYWxwaGEnO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBzM2RlcGxveSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMtZGVwbG95bWVudCc7XG5cbmNsYXNzIFRlc3RCdWNrZXREZXBsb3ltZW50IGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IGJ1Y2tldDU6IHMzLklCdWNrZXQ7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IGRlc3RpbmF0aW9uQnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnRGVzdGluYXRpb24nLCB7XG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogJ2luZGV4Lmh0bWwnLFxuICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIG5lZWRlZCBmb3IgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgfSk7XG5cbiAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCAnRGVwbG95TWUnLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0LFxuICAgICAgcmV0YWluT25EZWxldGU6IGZhbHNlLCAvLyBkZWZhdWx0IGlzIHRydWUsIHdoaWNoIHdpbGwgYmxvY2sgdGhlIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxuICAgIH0pO1xuXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveU1lV2l0aEVmc1N0b3JhZ2UnLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlJykpXSxcbiAgICAgIGRlc3RpbmF0aW9uQnVja2V0LFxuICAgICAgZGVzdGluYXRpb25LZXlQcmVmaXg6ICdlZnMvJyxcbiAgICAgIHVzZUVmczogdHJ1ZSxcbiAgICAgIHZwYzogbmV3IGVjMi5WcGModGhpcywgJ0lubGluZVZwYycpLFxuICAgICAgcmV0YWluT25EZWxldGU6IGZhbHNlLCAvLyBkZWZhdWx0IGlzIHRydWUsIHdoaWNoIHdpbGwgYmxvY2sgdGhlIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxuICAgIH0pO1xuXG4gICAgY29uc3QgYnVja2V0MiA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0Rlc3RpbmF0aW9uMicsIHtcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXG4gICAgICBhdXRvRGVsZXRlT2JqZWN0czogdHJ1ZSwgLy8gbmVlZGVkIGZvciBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICB9KTtcblxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lXaXRoUHJlZml4Jywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0MixcbiAgICAgIGRlc3RpbmF0aW9uS2V5UHJlZml4OiAnZGVwbG95L2hlcmUvJyxcbiAgICAgIHJldGFpbk9uRGVsZXRlOiBmYWxzZSwgLy8gZGVmYXVsdCBpcyB0cnVlLCB3aGljaCB3aWxsIGJsb2NrIHRoZSBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICB9KTtcblxuICAgIGNvbnN0IGJ1Y2tldDMgPSBuZXcgczMuQnVja2V0KHRoaXMsICdEZXN0aW5hdGlvbjMnLCB7XG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIG5lZWRlZCBmb3IgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgfSk7XG5cbiAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCAnRGVwbG95V2l0aE1ldGFkYXRhJywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldDogYnVja2V0MyxcbiAgICAgIHJldGFpbk9uRGVsZXRlOiBmYWxzZSwgLy8gZGVmYXVsdCBpcyB0cnVlLCB3aGljaCB3aWxsIGJsb2NrIHRoZSBpbnRlZ3JhdGlvbiB0ZXN0IGNsZWFudXBcbiAgICAgIGNhY2hlQ29udHJvbDogW3MzZGVwbG95LkNhY2hlQ29udHJvbC5zZXRQdWJsaWMoKSwgczNkZXBsb3kuQ2FjaGVDb250cm9sLm1heEFnZShjZGsuRHVyYXRpb24ubWludXRlcygxKSldLFxuICAgICAgY29udGVudFR5cGU6ICd0ZXh0L2h0bWwnLFxuICAgICAgbWV0YWRhdGE6IHsgQTogJ2FhYScsIEI6ICdiYmInLCBDOiAnY2NjJyB9LFxuICAgIH0pO1xuXG4gICAgbmV3IHMzZGVwbG95LkJ1Y2tldERlcGxveW1lbnQodGhpcywgJ0RlcGxveU1lV2l0aG91dERlbGV0aW5nRmlsZXNPbkRlc3RpbmF0aW9uJywge1xuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChwYXRoLmpvaW4oX19kaXJuYW1lLCAnbXktd2Vic2l0ZScpKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldCxcbiAgICAgIHBydW5lOiBmYWxzZSxcbiAgICAgIHJldGFpbk9uRGVsZXRlOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lNZVdpdGhFeGNsdWRlZEZpbGVzT25EZXN0aW5hdGlvbicsIHtcbiAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQsXG4gICAgICBleGNsdWRlOiBbJyouZ2lmJ10sXG4gICAgICByZXRhaW5PbkRlbGV0ZTogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBjb25zdCBidWNrZXQ0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnRGVzdGluYXRpb240Jywge1xuICAgICAgcHVibGljUmVhZEFjY2VzczogZmFsc2UsXG4gICAgICByZW1vdmFsUG9saWN5OiBjZGsuUmVtb3ZhbFBvbGljeS5ERVNUUk9ZLFxuICAgICAgYXV0b0RlbGV0ZU9iamVjdHM6IHRydWUsIC8vIG5lZWRlZCBmb3IgaW50ZWdyYXRpb24gdGVzdCBjbGVhbnVwXG4gICAgfSk7XG5cbiAgICBuZXcgczNkZXBsb3kuQnVja2V0RGVwbG95bWVudCh0aGlzLCAnRGVwbG95TWVXaXRob3V0RXh0cmFjdGluZ0ZpbGVzT25EZXN0aW5hdGlvbicsIHtcbiAgICAgIHNvdXJjZXM6IFtzM2RlcGxveS5Tb3VyY2UuYXNzZXQocGF0aC5qb2luKF9fZGlybmFtZSwgJ215LXdlYnNpdGUnKSldLFxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IGJ1Y2tldDQsXG4gICAgICBleHRyYWN0OiBmYWxzZSxcbiAgICAgIHJldGFpbk9uRGVsZXRlOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIHRoaXMuYnVja2V0NSA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ0Rlc3RpbmF0aW9uNScsIHtcbiAgICAgIHB1YmxpY1JlYWRBY2Nlc3M6IGZhbHNlLFxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLCAvLyBuZWVkZWQgZm9yIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxuICAgIH0pO1xuXG4gICAgY29uc3QgZGVwbG95NSA9IG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsICdEZXBsb3lNZTUnLCB7XG4gICAgICBzb3VyY2VzOiBbczNkZXBsb3kuU291cmNlLmFzc2V0KHBhdGguam9pbihfX2Rpcm5hbWUsICdteS13ZWJzaXRlLXNlY29uZCcpKV0sXG4gICAgICBkZXN0aW5hdGlvbkJ1Y2tldDogdGhpcy5idWNrZXQ1LFxuICAgICAgcmV0YWluT25EZWxldGU6IGZhbHNlLCAvLyBkZWZhdWx0IGlzIHRydWUsIHdoaWNoIHdpbGwgYmxvY2sgdGhlIGludGVncmF0aW9uIHRlc3QgY2xlYW51cFxuICAgIH0pO1xuICAgIGRlcGxveTUuYWRkU291cmNlKHMzZGVwbG95LlNvdXJjZS5kYXRhKCdzb21lLWtleScsICdoZWxsb3dvcmxkJykpO1xuICB9XG59XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCB0ZXN0Q2FzZSA9IG5ldyBUZXN0QnVja2V0RGVwbG95bWVudChhcHAsICd0ZXN0LWJ1Y2tldC1kZXBsb3ltZW50cy0yJyk7XG5cbi8vIEFzc2VydCB0aGF0IERlcGxveU1lV2l0aG91dEV4dHJhY3RpbmdGaWxlc09uRGVzdGluYXRpb24gZGVwbG95cyBhIHppcCBmaWxlIHRvIGJ1Y2tldDRcbmNvbnN0IGludGVnVGVzdCA9IG5ldyBpbnRlZy5JbnRlZ1Rlc3QoYXBwLCAnaW50ZWctdGVzdC1idWNrZXQtZGVwbG95bWVudHMnLCB7XG4gIHRlc3RDYXNlczogW3Rlc3RDYXNlXSxcbn0pO1xuY29uc3QgbGlzdE9iamVjdHNDYWxsID0gaW50ZWdUZXN0LmFzc2VydGlvbnMuYXdzQXBpQ2FsbCgnUzMnLCAnbGlzdE9iamVjdHMnLCB7XG4gIEJ1Y2tldDogdGVzdENhc2UuYnVja2V0NS5idWNrZXROYW1lLFxufSk7XG5saXN0T2JqZWN0c0NhbGwucHJvdmlkZXIuYWRkVG9Sb2xlUG9saWN5KHtcbiAgRWZmZWN0OiAnQWxsb3cnLFxuICBBY3Rpb246IFsnczM6R2V0T2JqZWN0JywgJ3MzOkxpc3RCdWNrZXQnXSxcbiAgUmVzb3VyY2U6IFsnKiddLFxufSk7XG5saXN0T2JqZWN0c0NhbGwuZXhwZWN0KGludGVnLkV4cGVjdGVkUmVzdWx0Lm9iamVjdExpa2Uoe1xuICBDb250ZW50czogTWF0Y2guYXJyYXlXaXRoKFxuICAgIFtcbiAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBLZXk6ICc0MDMuaHRtbCcsXG4gICAgICB9KSxcbiAgICAgIE1hdGNoLm9iamVjdExpa2Uoe1xuICAgICAgICBLZXk6ICdzb21lLWtleScsXG4gICAgICB9KSxcbiAgICBdLFxuICApLFxufSkpO1xuXG5hcHAuc3ludGgoKTtcbiJdfQ==