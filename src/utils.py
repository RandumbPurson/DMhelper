import os

class clear:
    def __init__(self, OS):
        if OS == "linux":
            self.command = lambda :  os.system("clear")
        if OS == "windows":
            self.command = lambda : os.system("cls")
    
    def __call__(self):
        self.command()