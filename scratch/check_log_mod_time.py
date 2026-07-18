import os
import time

log_path = r"C:\Users\wajiz.pk\.gemini\antigravity-ide\brain\5bf886f7-7805-45ee-a15d-06135a0f4423\.system_generated\tasks\task-634.log"
if os.path.exists(log_path):
    mtime = os.path.getmtime(log_path)
    print("Log file modification time:", time.ctime(mtime))
    print("Current time:", time.ctime())
    print("Seconds since last update:", time.time() - mtime)
else:
    print("Log file not found.")
