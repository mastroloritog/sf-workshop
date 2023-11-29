frutta = ["Pera", "Limone", "Pesca", "Kiwi", "Mela", "Banana", "Arancia", "Mandarino"]

letters = "abcdefghijklmnopqrstuvwxyz"

frutta_selezionata = []

for letter in letters:
    selezione = []
    for frutto in frutta:
        if frutto[0].upper() == letter.upper():
            selezione.append(frutto)

    if len(selezione)!=0:
            frutta_selezionata.append(selezione)

print(frutta_selezionata)