import requests
import json

url = "https://interface-dwaq.c9users.io/api/type/types"


headers = {
    'content-type': "application/json",
    'cache-control': "no-cache"
    }

data = {"type":"Wine","subtypes":[]}

with open("list.txt", "r") as ins:
    array = []
    for line in ins:
        subtype = (line.rstrip('\n').rstrip('\r'))
        data["subtypes"].append({"subtype":subtype})

json_data = json.dumps(data)
print json_data


response = requests.request("POST", url, data=json_data, headers=headers)
 