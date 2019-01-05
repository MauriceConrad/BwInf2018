# Voll Danaben

## Require

```javascript
const Casino = require('VollDaneben');
```

## Usage

### Create Casino Instance

```javascript
const myCasino = new Casino([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13]);
```

### Get Game Numbers

To get a list of game numbers (Al's numbers), apply `getGameNumbers()` method.
The first argument is the amount of game numbers that will be found. `10` is default value

```javascript
const gameNumbers = myCasino.getGameNumbers(10);

console.log(gameNumbers);
```

### Get Differences to List of Game Numbers

```javascript
const gameNumbers = myCasino.getGameNumbers(10);

const differences = myCasino.getDifferences(gameNumbers);

console.log(differences);
```

## CLI

```bash
$ demo/cli --lucky 1,2,3,4,5,6,7,8,9,10,13 --count 10
```

`--count` is not required. Default is `10`

### Lucky Numbers from URL

```bash
$ demo/cli --lucky https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/beispiel1.txt --count 10
```


## Algorithmus

Der Algorithmus funktioniert im Grunde nach folgender Logik:

- Wir haben 10 Zahlen, die wir frei wählen dürfen.
- Diese 10 Zahlen müssen die Glückszahlen der Spieler möglichst gut "abdecken"
- *"Abdecken"* bedeutet, dass jede Zahl von uns (Al's) sich um eine bestimmte Anzahl an Glückszahlen *"kümmern"* muss bzw. *"verantwortlich"* für diese sein muss
- In erster Linie ist jede unserer (*Al's*) Zahlen für so viele Glückszahlen verantwortlich wie die Division der Gesamtmenge an Glückszahlen durch `10` als natürliche Zahl ergibt (`trunc(anzahl_der_glückszahlen / 10)`)
  - Falls das nicht ganz aufgeht, bleiben natürlich Glückszahlen übrig für welche aktuell keine von unseren Zahlen *"verantwortlich"* wäre. Daher bekommt für den Rest der vorherigen Division je eine von unseren Zahlen eine weitere Glückszahl in die *"Verantwortung"*.
    - Bei 33 Glückszahlen (und 10 unserer Zahlen) bedeutet dass, das 7 unserer Zahlen für **3** Glückszahlen *"verantwortlich"* sind während  die restlichen 3 unserer Zahlen für **4** Glückszahlen *"verantwortlich"* wären.
- Nun haben wir eine Liste mit *"Zuständigkeiten"* die wir von hinten durchgehen, so dass die jenigen unserer Zahlen die für *"eine Glückszahl mehr"* bzw. am meisten Glückszahlen *"verantwortlich"* sind, zuerst dran kommen.
  - Dabei wird nun für jede *"Verantwortung"* eine Zahl gesucht die, entsprechend der Verantwortung, genug Glückszahlen abdeckt. Hierbei kommt die Methode `getClosestNumbers()` zur Geltung.
  - Alle damit verbundenen Zahlen, also alle für die die aktuelle unserer Zahlen verantwrtlich sein wird, werden zu einer Liste hinzugefügt, die diese ausschließt jemals wieder Teil einer weiteren *"Verantwortung"* zu sein, da diese ja nun *"abgearbeitet"* wurden.

### getClosestNumbers()

Die Methode `getClosestNumbers` gibt die günstigst zu einander gelegenen Zahlen einer Liste an (einer bestimmten Anzahl).

Dabei benötigt sie grundsätzlich **3** Argumente:
1. Eine, der Größe nach sortierte Liste an potentiellen Zahlen
2. Die Anzahl an Zahlen die günstig zueinander liegen sollen
3. Eine Liste mit Indexen aus der Liste, die ignoriert werden sollen


- Zuerst werden alle Zahlen der (sortierten) Liste durchgegangen und jeweils eine Liste dieser Zahl mit ihren nächsten Nachbarn (so viel wie es die Anzahl wünscht) erstellt.
- Dann wird die Summe der Abstände aller Nachbarn zur Zahl ausgerechnet.
- Die Zahl, deren Nachbarn in der Summe den geringsten Abstand zur Zahl haben wird dann zurückgegeben.
