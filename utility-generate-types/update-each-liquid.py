import json, requests

liquids = [
  {
    "_id": "57bc9ffd6df8bbae1fa34d85",
    "type": "Beer",
    "subtype": "Ale",
    "brand": "*Any",
    "description": None,
    "amount": None,
    "barcode": None,
    "__v": 0
  },
  {
    "_id": "57bca0c66df8bbae1fa34d86",
    "type": "Beer",
    "subtype": "Lager",
    "brand": "*Any",
    "description": None,
    "amount": None,
    "barcode": None,
    "__v": 0
  },
  {
    "_id": "57bca0ce6df8bbae1fa34d87",
    "type": "Beer",
    "subtype": "Malt",
    "brand": "*Any",
    "description": None,
    "amount": None,
    "barcode": None,
    "__v": 0
  },
  {
    "_id": "57bca0d56df8bbae1fa34d88",
    "type": "Beer",
    "subtype": "Porter",
    "brand": "*Any",
    "description": None,
    "amount": None,
    "barcode": None,
    "__v": 0
  },
  {
    "_id": "57bca0db6df8bbae1fa34d89",
    "type": "Beer",
    "subtype": "Stout",
    "brand": "*Any",
    "description": None,
    "amount": None,
    "barcode": None,
    "__v": 0
  },
  {
    "_id": "57bf3ec4b89711730e1dab4d",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Apple",
    "amount": None,
    "type": "Brandy",
    "__v": 0
  },
  {
    "_id": "57bf3ec4b89711730e1dab4e",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Apricot",
    "amount": None,
    "type": "Brandy",
    "__v": 0
  },
  {
    "_id": "57bf3ec4b89711730e1dab4f",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Grape, Cognac",
    "amount": None,
    "type": "Brandy",
    "__v": 0
  },
  {
    "_id": "57bf3ec4b89711730e1dab50",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Coconut Milk",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec4b89711730e1dab51",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec4b89711730e1dab52",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Coconut",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab53",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Cream Of Coconut",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab54",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Half-and-half",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab55",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Heavy",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab56",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Heavy, Double",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab57",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Light",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab58",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Whipped",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab59",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Whipping",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab5a",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Egg",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab5b",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Egg, Eggnog",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec5b89711730e1dab5c",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Milk",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec6b89711730e1dab5d",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Milk, Chocolate",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec6b89711730e1dab5e",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Milk, Condensed",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec6b89711730e1dab5f",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Yoghurt",
    "amount": None,
    "type": "Dairy",
    "__v": 0
  },
  {
    "_id": "57bf3ec6b89711730e1dab60",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "*Any",
    "amount": None,
    "type": "Gin",
    "__v": 0
  },
  {
    "_id": "57bf3ec6b89711730e1dab61",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Dry",
    "amount": None,
    "type": "Gin",
    "__v": 0
  },
  {
    "_id": "57bf3ec6b89711730e1dab62",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Dry, Plymouth",
    "amount": None,
    "type": "Gin",
    "__v": 0
  },
  {
    "_id": "57bf3ec6b89711730e1dab63",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Sweet, Sloe",
    "amount": None,
    "type": "Gin",
    "__v": 0
  },
  {
    "_id": "57bf3ec6b89711730e1dab64",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "*Any",
    "amount": None,
    "type": "Grain Alcohol",
    "__v": 0
  },
  {
    "_id": "57bf3ec7b89711730e1dab65",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Apple",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec7b89711730e1dab66",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cherry",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec7b89711730e1dab67",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cherry, Maraschino",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec7b89711730e1dab68",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Clamato",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec7b89711730e1dab69",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cranberry",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec7b89711730e1dab6a",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Apple-Cranberry",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec7b89711730e1dab6b",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cranberry-Raspberry",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec7b89711730e1dab6c",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Grape",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab6d",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Grapefruit",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab6e",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Guava",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab6f",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Lemon",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab70",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Lime",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab71",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Mango",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab72",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Olive",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab73",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Orange",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab74",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Orange, Mandarin",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab75",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Papaya",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec8b89711730e1dab76",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Passion-fruit",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec9b89711730e1dab77",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Peach",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec9b89711730e1dab78",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Pineapple",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec9b89711730e1dab79",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Pomegranate",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec9b89711730e1dab7a",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Raspberry",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec9b89711730e1dab7b",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Strawberry",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec9b89711730e1dab7c",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Tomato",
    "amount": None,
    "type": "Juice",
    "__v": 0
  },
  {
    "_id": "57bf3ec9b89711730e1dab7d",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Margarita",
    "amount": None,
    "type": "Mixer",
    "__v": 0
  },
  {
    "_id": "57bf3ecab89711730e1dab7e",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "*Any",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecab89711730e1dab7f",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Aged, Anejo",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecab89711730e1dab80",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cachaca",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecab89711730e1dab81",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Dark",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecab89711730e1dab82",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Dark, Jamaican",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecab89711730e1dab83",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Coconut",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecab89711730e1dab84",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Mango",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecbb89711730e1dab85",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Pineapple",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecbb89711730e1dab86",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Gold",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecbb89711730e1dab87",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Overproof",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecbb89711730e1dab88",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Overproof, 151 Proof",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecbb89711730e1dab89",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Spiced",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecbb89711730e1dab8a",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White",
    "amount": None,
    "type": "Rum",
    "__v": 0
  },
  {
    "_id": "57bf3ecbb89711730e1dab8b",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Peach",
    "amount": None,
    "type": "Schnapps",
    "__v": 0
  },
  {
    "_id": "57bf3ecbb89711730e1dab8c",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Peppermint",
    "amount": None,
    "type": "Schnapps",
    "__v": 0
  },
  {
    "_id": "57bf3eccb89711730e1dab8d",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Raspberry",
    "amount": None,
    "type": "Schnapps",
    "__v": 0
  },
  {
    "_id": "57bf3eccb89711730e1dab8e",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Root Beer",
    "amount": None,
    "type": "Schnapps",
    "__v": 0
  },
  {
    "_id": "57bf3eccb89711730e1dab8f",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Strawberry",
    "amount": None,
    "type": "Schnapps",
    "__v": 0
  },
  {
    "_id": "57bf3eccb89711730e1dab90",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Vanilla",
    "amount": None,
    "type": "Schnapps",
    "__v": 0
  },
  {
    "_id": "57bf3eccb89711730e1dab91",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Watermelon",
    "amount": None,
    "type": "Schnapps",
    "__v": 0
  },
  {
    "_id": "57bf3eccb89711730e1dab92",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Wildberry",
    "amount": None,
    "type": "Schnapps",
    "__v": 0
  },
  {
    "_id": "57bf3eccb89711730e1dab93",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Almond",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3eccb89711730e1dab94",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Caramel",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3ecdb89711730e1dab95",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Chocolate",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3ecdb89711730e1dab96",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Gomme",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3ecdb89711730e1dab97",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Grenadine",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3ecdb89711730e1dab98",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Maple",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3ecdb89711730e1dab99",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Orgeat",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3ecdb89711730e1dab9a",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Passion-fruit",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3ecdb89711730e1dab9b",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Pineapple",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3ecdb89711730e1dab9c",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Raspberry",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3eceb89711730e1dab9d",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Simple",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3eceb89711730e1dab9e",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Strawberry",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3eceb89711730e1dab9f",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Sugar",
    "amount": None,
    "type": "Syrup",
    "__v": 0
  },
  {
    "_id": "57bf3eceb89711730e1daba0",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "*Any",
    "amount": None,
    "type": "Tequila",
    "__v": 0
  },
  {
    "_id": "57bf3eceb89711730e1daba1",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Gold",
    "amount": None,
    "type": "Tequila",
    "__v": 0
  },
  {
    "_id": "57bf3eceb89711730e1daba2",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Silver",
    "amount": None,
    "type": "Tequila",
    "__v": 0
  },
  {
    "_id": "57bf3eceb89711730e1daba3",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White",
    "amount": None,
    "type": "Tequila",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1daba4",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Almond, Amaretto",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1daba5",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Almond, Creme De",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1daba6",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Almond, Creme De, Noyaux",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1daba7",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Anise, Anis",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1daba8",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Anise, Sambuca",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1daba9",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Anise, Sambuca, Black",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1dabaa",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Anise, Sambuca, White",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1dabab",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Apple, Schnapps",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ecfb89711730e1dabac",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Banana",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabad",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Banana, Creme De",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabae",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Bitters",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabaf",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Blackberry, Brandy",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabb0",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Blackcurrant, Creme De Cassis",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabb1",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Blueberry, Schnapps",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabb2",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Butterscotch, Schnapps",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabb3",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cherry",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabb4",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cherry, Brandy",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabb5",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cherry, Maraschino",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed0b89711730e1dabb6",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Chocolate",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabb7",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Chocolate, Creme De Cacao",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabb8",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Chocolate, Creme De Cacao, Brown",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabb9",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Chocolate, Creme De Cacao, Dark",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabba",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Chocolate, Creme De Cacao, White",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabbb",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Chocolate, White",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabbc",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cinnamon, Schnapps",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabbd",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Coconut",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabbe",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Coffee",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed1b89711730e1dabbf",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Coffee, Brandy",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc0",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Amarula",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc1",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream, Irish",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc2",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Curacao",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc3",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Curacao, Blue",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc4",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Curacao, Orange",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc5",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Curacao, White",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc6",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Egg, Advocaat",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc7",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Hazelnut",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc8",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Herbal, Absinthe",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed2b89711730e1dabc9",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Herbal, Bitters",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabca",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Lemon, Limoncello",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabcb",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Licorice, Anisette",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabcc",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Melon",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabcd",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Mint, Creme De Menthe",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabce",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Mint, Creme De Menthe, Green",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabcf",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Mint, Creme De Menthe, White",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabd0",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Orange",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabd1",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Peach",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabd2",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Peach, Brandy",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed3b89711730e1dabd3",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Pear",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabd4",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Raspberry",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabd5",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Strawberry",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabd6",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Triple Sec",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabd7",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Vanilla",
    "amount": None,
    "type": "Liqueur",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabd8",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Blackcurrant, Cordial",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabd9",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cider",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabda",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Club",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabdb",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cola",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed4b89711730e1dabdc",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cola, Cherry",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabdd",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Cream",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabde",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Energy",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabdf",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Fruit, Fruit Punch",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabe0",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Fruit, Fruit Punch, Hawaiian Punch",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabe1",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Fruit, Lemon-lime",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabe2",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Ginger Ale",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabe3",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Ginger Ale, Dry",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabe4",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Ginger Beer",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabe5",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Grape",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed5b89711730e1dabe6",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Lemon, Bitter",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed6b89711730e1dabe7",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Lemon, Lemonade",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed6b89711730e1dabe8",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Lemon, Lemonade, Pink",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed6b89711730e1dabe9",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Lime, Cordial",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed6b89711730e1dabea",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Lime, Limeade",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed6b89711730e1dabeb",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Orange",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed6b89711730e1dabec",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Raspberry, Cordial",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed6b89711730e1dabed",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Root Beer",
    "amount": None,
    "type": "Soda",
    "__v": 0
  },
  {
    "_id": "57bf3ed6b89711730e1dabee",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Unflavored",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabef",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Apple",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf0",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Cherry",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf1",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Citrus",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf2",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Cranberry",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf3",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Lemon",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf4",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Lime",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf5",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Orange",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf6",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Peach",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf7",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Pepper",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed7b89711730e1dabf8",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Raspberry",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed8b89711730e1dabf9",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Strawberry",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed8b89711730e1dabfa",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Flavored, Vanilla",
    "amount": None,
    "type": "Vodka",
    "__v": 0
  },
  {
    "_id": "57bf3ed8b89711730e1dabfb",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Noncarbonated",
    "amount": None,
    "type": "Water",
    "__v": 0
  },
  {
    "_id": "57bf3ed8b89711730e1dabfc",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Seltzer",
    "amount": None,
    "type": "Water",
    "__v": 0
  },
  {
    "_id": "57bf3ed8b89711730e1dabfd",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Soda",
    "amount": None,
    "type": "Water",
    "__v": 0
  },
  {
    "_id": "57bf3ed8b89711730e1dabfe",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Tonic",
    "amount": None,
    "type": "Water",
    "__v": 0
  },
  {
    "_id": "57bf3ed8b89711730e1dabff",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "*Any",
    "amount": None,
    "type": "Whiskey",
    "__v": 0
  },
  {
    "_id": "57bf3ed8b89711730e1dac00",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Blended",
    "amount": None,
    "type": "Whiskey",
    "__v": 0
  },
  {
    "_id": "57bf3ed9b89711730e1dac01",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Bourbon",
    "amount": None,
    "type": "Whiskey",
    "__v": 0
  },
  {
    "_id": "57bf3ed9b89711730e1dac02",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Canadian",
    "amount": None,
    "type": "Whiskey",
    "__v": 0
  },
  {
    "_id": "57bf3ed9b89711730e1dac03",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Irish",
    "amount": None,
    "type": "Whiskey",
    "__v": 0
  },
  {
    "_id": "57bf3ed9b89711730e1dac04",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Rye",
    "amount": None,
    "type": "Whiskey",
    "__v": 0
  },
  {
    "_id": "57bf3ed9b89711730e1dac05",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Scotch",
    "amount": None,
    "type": "Whiskey",
    "__v": 0
  },
  {
    "_id": "57bf3ed9b89711730e1dac06",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Madeira",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3ed9b89711730e1dac07",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Port",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3ed9b89711730e1dac08",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Port, Lbv",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac09",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Port, Ruby",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac0a",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Port, Tawny",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac0b",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Sherry",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac0c",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Sherry, Cream",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac0d",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Sherry, Dry",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac0e",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Sherry, Sweet",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac0f",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Vermouth",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac10",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "Red, Vermouth, Sweet",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac11",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White, Dry",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edab89711730e1dac12",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White, Lillet",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edbb89711730e1dac13",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White, Sparkling",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edbb89711730e1dac14",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White, Sparkling, Champagne",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edbb89711730e1dac15",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White, Vermouth",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edbb89711730e1dac16",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White, Vermouth, Dry",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf3edbb89711730e1dac17",
    "description": None,
    "brand": "*Any",
    "barcode": None,
    "subtype": "White, Vermouth, French",
    "amount": None,
    "type": "Wine",
    "__v": 0
  },
  {
    "_id": "57bf4f2543d56b942aca41ee",
    "type": "Whiskey",
    "subtype": "Canadian",
    "brand": "Black Velvet",
    "description": "Blended Canadian Whiskey",
    "amount": 59.2,
    "barcode": "088100134511",
    "__v": 0
  },
  {
    "_id": "57bf4f9643d56b942aca41ef",
    "type": "Vodka",
    "subtype": "Unflavored",
    "brand": "Svedka",
    "description": "Imported Swedish Vodka",
    "amount": 59.2,
    "barcode": "617768111178",
    "__v": 0
  },
  {
    "_id": "57bf4ff443d56b942aca41f0",
    "type": "Rum",
    "subtype": "White",
    "brand": "Bacardi",
    "description": "Superior White Rum",
    "amount": 59.2,
    "barcode": "080480015236",
    "__v": 0
  },
  {
    "_id": "57bf504643d56b942aca41f1",
    "type": "Tequila",
    "subtype": "Silver",
    "brand": "Jose Cuervo",
    "description": "Especial",
    "amount": 59.2,
    "barcode": "811538010771",
    "__v": 0
  },
  {
    "_id": "57bf50f043d56b942aca41f2",
    "type": "Gin",
    "subtype": "Sweet, Sloe",
    "brand": "New Amsterdam",
    "description": "No. 485",
    "amount": 59.2,
    "barcode": "085000014301",
    "__v": 0
  }
]


headers = {
    'content-type': "application/json",
    'cache-control': "no-cache",
    }

data = '''
{
    "type": None,
    "subtype": None,
    "brand": "*Any",
    "description": None,
    "amount": None,
    "barcode": None
}
'''

post_url =  "https://interface-dwaq.c9users.io/api/liquid/delete/"

#response = requests.request("POST", post_url, data=data, headers=headers)
#print(response.text)

i = 0
for t in liquids:
    mid =  t["_id"]
    url = post_url + mid
    #print url
    response = requests.get(url);
    print(response.text)
    
    
'''
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
'''





