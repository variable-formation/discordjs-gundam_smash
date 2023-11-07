import subprocess
import requests
import time

# Thresholds
CPU_THRESHOLD = 80  # Percent
MEMORY_THRESHOLD = 80  # Percent
NETWORK_THRESHOLD = 10 * 1024 * 1024  # 10 MB/s


# Discord Webhook URL
DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1170977195494219866/_UCQFpAMJndLNUJmIBL86_vbDbfiJYXdbFVwPG1Xj4yMg3dUahsS6E6dNGIKjTgU2AKW'

# Interval between checks (in seconds)
CHECK_INTERVAL = 5

# Flags to track if an alert has already been sent
warning_sent = False
clear_sent = False

dev_process_name = 'gundam-smash-prod'
dev_restart_command = ['node', '/home/ubuntu/Projects/discordjs-gundam_smash/src/index.js', '--prod'] 

def send_alert_to_discord():
    """Sends an alert to the specified Discord webhook URL."""
    current_unix_timestamp = int(time.time())
    payload = {
        "username": "Restart Bot",
        "content": "",
        "embeds": [
            {
                "title": "🛑 Stopped!",
                "description": f"Gundam Smash! has stopped! Attempting to reboot!\n\nAlert Generated at <t:{current_unix_timestamp}:T> on <t:{current_unix_timestamp}:D>",
                "color": 16711680
            }
        ]
    }
    response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
    if response.status_code == 204:
        print(f"Alert sent to Discord.")
    else:
        print(f"Failed to send alert to Discord.")

def send_clear_to_discord():
    """Sends a clear message to the specified Discord webhook URL."""
    current_unix_timestamp = int(time.time())
    payload = {
        "username": "Restart Bot",
        "content": "",
        "embeds": [
            {
                "title": "✅ Running!",
                "description": f"Gundam Smash! is now running!\n\nAlert Generated at <t:{current_unix_timestamp}:T> on <t:{current_unix_timestamp}:D>",
                "color": 65280
            }
        ]
    }
    response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
    if response.status_code == 204:
        print(f"Alert sent to Discord.")
    else:
        print(f"Failed to send alert to Discord.")

def send_failure_to_discord():
    """Send a message of success to Discord when the process fails to restart."""
    current_unix_timestamp = int(time.time())
    payload = {
        "username": "Restart Bot",
        "content": "",
        "embeds": [
            {
                "title": "🚫 Failure!",
                "description": f"Gundam Smash! could not be restarted! Check the logs!\n\nAlert Generated at <t:{current_unix_timestamp}:T> on <t:{current_unix_timestamp}:D>",
                "color": 16711680
            }
        ]
    }
    response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
    if response.status_code == 204:
        print(f"Alert sent to Discord.")
    else:
        print(f"Failed to send alert to Discord.")

def send_success_to_discord():
    """Send a message of failure to Discord when the process fails to restart."""
    current_unix_timestamp = int(time.time())
    payload = {
        "username": "Restart Bot",
        "content": "",
        "embeds": [
            {
                "title": "✅ Success!",
                "description": f"Gundam Smash! was sucessfully restarted!\n\nAlert Generated at <t:{current_unix_timestamp}:T> on <t:{current_unix_timestamp}:D>",
                "color": 65280
            }
        ]
    }
    response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
    if response.status_code == 204:
        print(f"Alert sent to Discord.")
    else:
        print(f"Failed to send alert to Discord.")

def is_process_running(process_name):
    """Check if there is any running process that contains the given name process_name."""
    try:
        # Run a command to get all processes matching process_name
        proc = subprocess.Popen(['pgrep', '-f', process_name], stdout=subprocess.PIPE)
        # Read the output of the command
        output, _ = proc.communicate()
        # If the output is not empty, the process is running
        return True if output else False
    except Exception as e:
        print(f"An error occurred: {e}")
        return False

    
def restart_process(restart_command):
    """Try to restart the process using the provided command."""
    try:
        subprocess.Popen(restart_command)
        if is_process_running(process_name):
            print(f"Successfully restarted {process_name}.")
            send_success_to_discord()
        else:
            raise Exception(f"Failed to restart {process_name}.")
    except Exception as e:
        send_failure_to_discord()
        print(f"An error occurred: {e}")

while True:
    process_name = dev_process_name
    restart_command = dev_restart_command
    if not is_process_running(process_name) and not warning_sent:
        send_alert_to_discord()
        print(f"{process_name} is not running. Attempting to restart.")
        restart_process(restart_command)
        warning_sent = True
    elif is_process_running(process_name) and warning_sent:
        print(f"{process_name} is running again.")
        send_clear_to_discord()
        warning_sent = False

        
    # Wait for next check
    time.sleep(CHECK_INTERVAL)
