import requests

url = "https://interface-dwaq.c9users.io/api/liquid/types"


headers = {
    'content-type': "application/json",
    'cache-control': "no-cache"
    }



with open("short-list.txt", "r") as ins:
    array = []
    for line in ins:
        liquid = (line.rstrip('\n').rstrip('\r'))
        payload = "{ \"type\": \""+liquid+"\",\r\n  \"item\": []\r\n}"
        response = requests.request("POST", url, data=payload, headers=headers)
        print(response.text)