import psutil
import requests
import time

# Thresholds
CPU_THRESHOLD = 80  # Percent
MEMORY_THRESHOLD = 80  # Percent
NETWORK_THRESHOLD = 10 * 1024 * 1024  # 10 MB/s


# Discord Webhook URL
DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/...'

# Interval between checks (in seconds)
CHECK_INTERVAL = 5

# Flags to track if an alert has already been sent
cpu_alert_sent = False
memory_alert_sent = False
network_alert_sent = False

# Network usage tracking
last_net_io = psutil.net_io_counters()


def send_alert_to_discord(resource_type, usage):
    """Sends an alert to the specified Discord webhook URL."""
    current_unix_timestamp = int(time.time())
    payload = {
        "username": "Resource Monitor Bot",
        "content": "",
        "embeds": [
            {
                "title": "⚠️ High Resource Usage Detected",
                "description": f"High {resource_type} usage detected: {usage}%\n\nAlert Generated at <t:{current_unix_timestamp}:T> on <t:{current_unix_timestamp}:D>",
                "color": 16711680
            }
        ]
    }
    response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
    if response.status_code == 204:
        print(f"Alert sent to Discord for {resource_type} usage: {usage}%")
    else:
        print(f"Failed to send alert to Discord for {resource_type} usage: {usage}%. Response: {response.text}")

def send_clear_to_discord(resource_type, usage):
    """Sends a clear message to the specified Discord webhook URL."""
    current_unix_timestamp = int(time.time())
    payload = {
        "username": "Resource Monitor Bot",
        "content": "",
        "embeds": [
            {
                "title": "✅ Resource Usage Back to Normal",
                "description": f"{resource_type} usage back to normal: {usage}%\n\nAlert Generated at <t:{current_unix_timestamp}:T> on <t:{current_unix_timestamp}:D>",
                "color": 65280
            }
        ]
    }
    response = requests.post(DISCORD_WEBHOOK_URL, json=payload)
    if response.status_code == 204:
        print(f"Clear sent to Discord for {resource_type} usage: {usage}%")
    else:
        print(f"Failed to send clear to Discord for {resource_type} usage: {usage}%. Response: {response.text}")

while True:
    # global cpu_alert_sent
    # global memory_alert_sent

    # Check CPU usage
    cpu_usage = psutil.cpu_percent(interval=0.1)
    if cpu_usage > CPU_THRESHOLD and not cpu_alert_sent:
        send_alert_to_discord('CPU', cpu_usage)
        cpu_alert_sent = True
    elif cpu_usage < CPU_THRESHOLD and cpu_alert_sent:
        send_clear_to_discord('CPU', cpu_usage)
        cpu_alert_sent = False
    
    # Check Memory usage
    memory_usage = psutil.virtual_memory().percent
    if memory_usage > MEMORY_THRESHOLD and not memory_alert_sent:
        send_alert_to_discord('Memory', memory_usage)
        memory_alert_sent = True
    elif memory_usage < MEMORY_THRESHOLD and memory_alert_sent:
        send_clear_to_discord('Memory', memory_usage)
        memory_alert_sent = False
    
    # Check Network usage
    current_net_io = psutil.net_io_counters()
    sent_bytes = current_net_io.bytes_sent - last_net_io.bytes_sent
    recv_bytes = current_net_io.bytes_recv - last_net_io.bytes_recv
    total_bytes = sent_bytes + recv_bytes
    network_usage = total_bytes / CHECK_INTERVAL
    if network_usage > NETWORK_THRESHOLD and not network_alert_sent:
        send_alert_to_discord('Network', f'{network_usage / (1024 * 1024):.2f} MB/s')
        network_alert_sent = True
    elif network_usage < NETWORK_THRESHOLD and network_alert_sent:
        send_clear_to_discord('Network', f'{network_usage / (1024 * 1024):.2f} MB/s')
        network_alert_sent = False
    last_net_io = current_net_io

    # Wait for next check
    time.sleep(CHECK_INTERVAL)
