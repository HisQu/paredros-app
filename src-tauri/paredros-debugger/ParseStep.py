class ParseStep:
    def __init__(self, some_variable:str):
        print("Initializing")
        self.test = "test12345"
        self.value = some_variable

    def get_some_variable(self):
        print("Get some variable called")
        return self.value
    
    def method1(self):
        print("method1 called")
    
    def get_test(self):
        return self.test
    
    def set_some_variable(self, some_variable:str):
        self.value = some_variable
        print("set some variable executed")