#!/usr/bin/env python

import octopush
import time
import random

Push = octopush.pub()

time.sleep(1) #ZMQ pub/sub takes a little time to settle

while True:
    Push.broadcast("humidity", {
        "humid": random.random()*100,
        "time": time.time()
    })
    time.sleep(3)
