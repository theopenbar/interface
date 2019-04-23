import json, requests

types = [
  {
    "type": "Brandy"
  },
  {
    "type": "Dairy"
  },
  {
    "type": "Gin"
  },
  {
    "type": "Grain Alcohol"
  },
  {
    "type": "Juice"
  },
  {
    "type": "Mixer"
  },
  {
    "type": "Rum"
  },
  {
    "type": "Schnapps"
  },
  {
    "type": "Syrup"
  },
  {
    "type": "Tequila"
  },
  {
    "type": "Liqueur"
  },
  {
    "type": "Soda"
  },
  {
    "type": "Vodka"
  },
  {
    "type": "Water"
  },
  {
    "type": "Whiskey"
  },
  {
    "type": "Wine"
  }
]


headers = {
    'content-type': "application/json",
    'cache-control': "no-cache",
    }

data = '''
{
    "type": null,
    "subtype": null,
    "brand": "*Any",
    "description": null,
    "amount": null,
    "barcode": null
}
'''

post_url =  "https://interface-dwaq.c9users.io/api/liquid/save"

#response = requests.request("POST", post_url, data=data, headers=headers)
#print(response.text)


for t in types:
    atype = t["type"]
    get_url = "https://interface-dwaq.c9users.io/api/type/subtypes/"+atype
    #print url
    response = requests.get(get_url)
    subtypes = json.loads(response.text);
    #print subtypes
    for subtype in subtypes:
        #print type, subtype["subtype"]
        jdata = json.loads(data);
        jdata["type"] = atype
        jdata["subtype"] = subtype["subtype"]
        #print jdata
        simple = json.dumps(jdata)
        #print simple
        response = requests.request("POST", post_url, data=simple, headers=headers)
        print(response.text)
