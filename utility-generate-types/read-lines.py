with open("liquids.txt", "r") as ins:
    array = []
    for line in ins:
        array.append(line.rstrip('\n').rstrip('\r'))
        print line