import boto3
from datetime import datetime

def lambda_handler(event, context):
    ec2 = boto3.client('ec2')
    instance_id = event['instance_id']
    
    current_time = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    ami_name = f'AMI-{instance_id}-{current_time}'
    
    ami_response = ec2.create_image(InstanceId=instance_id, Name=ami_name, NoReboot=True)
    return {'ami_id': ami_response['ImageId']}  # Adjusted to return ami_id directly
