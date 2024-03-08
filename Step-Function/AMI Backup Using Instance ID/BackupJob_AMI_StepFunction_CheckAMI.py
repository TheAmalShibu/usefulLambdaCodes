import boto3

def lambda_handler(event, context):
    ec2 = boto3.client('ec2')
    ami_id = event['ami_id']  # Adjusted to directly access ami_id
    ami_description = ec2.describe_images(ImageIds=[ami_id])
    status = ami_description['Images'][0]['State']
    return {'status': status}
