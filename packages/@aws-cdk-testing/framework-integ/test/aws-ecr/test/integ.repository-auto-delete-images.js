"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const integ_tests_alpha_1 = require("@aws-cdk/integ-tests-alpha");
const ecr = require("aws-cdk-lib/aws-ecr");
const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecr-integ-stack');
const repo = new ecr.Repository(stack, 'Repo', {
    repositoryName: 'delete-even-if-containing-images',
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    autoDeleteImages: true,
});
new cdk.CfnOutput(stack, 'RepositoryURI', {
    value: repo.repositoryUri,
});
new integ_tests_alpha_1.IntegTest(app, 'cdk-integ-auto-delete-images', {
    testCases: [stack],
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWcucmVwb3NpdG9yeS1hdXRvLWRlbGV0ZS1pbWFnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnRlZy5yZXBvc2l0b3J5LWF1dG8tZGVsZXRlLWltYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxrRUFBdUQ7QUFDdkQsMkNBQTJDO0FBRTNDLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sS0FBSyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUscUJBQXFCLENBQUMsQ0FBQztBQUV4RCxNQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRTtJQUM3QyxjQUFjLEVBQUUsa0NBQWtDO0lBQ2xELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE9BQU87SUFDeEMsZ0JBQWdCLEVBQUUsSUFBSTtDQUN2QixDQUFDLENBQUM7QUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRTtJQUN4QyxLQUFLLEVBQUUsSUFBSSxDQUFDLGFBQWE7Q0FDMUIsQ0FBQyxDQUFDO0FBRUgsSUFBSSw2QkFBUyxDQUFDLEdBQUcsRUFBRSw4QkFBOEIsRUFBRTtJQUNqRCxTQUFTLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDbkIsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEludGVnVGVzdCB9IGZyb20gJ0Bhd3MtY2RrL2ludGVnLXRlc3RzLWFscGhhJztcbmltcG9ydCAqIGFzIGVjciBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNyJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbmNvbnN0IHN0YWNrID0gbmV3IGNkay5TdGFjayhhcHAsICdhd3MtZWNyLWludGVnLXN0YWNrJyk7XG5cbmNvbnN0IHJlcG8gPSBuZXcgZWNyLlJlcG9zaXRvcnkoc3RhY2ssICdSZXBvJywge1xuICByZXBvc2l0b3J5TmFtZTogJ2RlbGV0ZS1ldmVuLWlmLWNvbnRhaW5pbmctaW1hZ2VzJyxcbiAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgYXV0b0RlbGV0ZUltYWdlczogdHJ1ZSxcbn0pO1xuXG5uZXcgY2RrLkNmbk91dHB1dChzdGFjaywgJ1JlcG9zaXRvcnlVUkknLCB7XG4gIHZhbHVlOiByZXBvLnJlcG9zaXRvcnlVcmksXG59KTtcblxubmV3IEludGVnVGVzdChhcHAsICdjZGstaW50ZWctYXV0by1kZWxldGUtaW1hZ2VzJywge1xuICB0ZXN0Q2FzZXM6IFtzdGFja10sXG59KTtcbiJdfQ==