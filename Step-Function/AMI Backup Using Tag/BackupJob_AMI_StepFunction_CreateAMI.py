import boto3
from datetime import datetime

def lambda_handler(event, context):
    ec2 = boto3.client('ec2')
    tag_name = 'TestAlexander-AMIStep'  # Assuming you want to find instances with a Name tag of 'xyz'
    
    # Find instances with the specified Name tag
    instances = ec2.describe_instances(Filters=[
        {'Name': 'tag:Name', 'Values': [tag_name]},
        {'Name': 'instance-state-name', 'Values': ['running', 'stopped']}  # Only consider instances that are running or stopped
    ])
    
    # Assuming you want to create an AMI of the first instance found
    if instances['Reservations']:
        instance_id = instances['Reservations'][0]['Instances'][0]['InstanceId']
        
        current_time = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        ami_name = f'AMI-{tag_name}-{instance_id}-{current_time}'
        
        ami_response = ec2.create_image(InstanceId=instance_id, Name=ami_name, NoReboot=True)
        return {'ami_id': ami_response['ImageId']}
    else:
        return {'error': 'No instances found with the specified name tag'}

