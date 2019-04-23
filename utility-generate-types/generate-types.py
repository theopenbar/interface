import requests

url = "https://interface-dwaq.c9users.io/api/liquid/types"

payload = "{ \"type\": \"Aquavit\",\r\n  \"item\": []\r\n}"
headers = {
    'content-type': "application/json",
    'cache-control': "no-cache",
    'postman-token': "719ef024-80bd-8932-bec8-bfc7815ae2d6"
    }

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)