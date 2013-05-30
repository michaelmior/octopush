#!/usr/bin/env python

import octopush
import time

Push = octopush.pub("tcp://*:3000")

time.sleep(1) #ZMQ pub/sub takes a little time to settle

while True:
    Push.broadcast("my_event", {
        "message": "This is some fancy stuff :)",
        "time": time.time()
    })
    time.sleep(3)
