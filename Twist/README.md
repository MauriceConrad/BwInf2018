# Twist

## Umsetzung

Die Funktionalitäten des Twistens sind hier im Modul mit den beiden Methoden `encrypt()` & `decrypt()` implementiert.
Während die Methode `encrpyt()` lediglich einen Text als Argument benötigt, benötigt `decrypt()` neben einem zu dechiffrierenden Text auch eine Liste an Wörtern auf deren Basis das geschehen soll. Dieser Wortschatz ist völlig dynamisch und kann alle möglichen Wörter enthalten.

Da die Anforderungen der *Aufabe 2* aber die konkrete Dechiffrierung deutscher Texte fordert, habe ich diese Funktionalität in das CLI implementiert.
DIe Verwendung des CLI ist weiter unten beschrieben.

### Wichtig

Um Verwirrungen und verschiedene Interpretationen von Sonderzeichen als Teile eines Wortes zu vermeiden, werden Sonderzeichen pauschal als eigene Wörter und dementsrechend gesondert betrachtet. Die Nebenwirkung davon ist, dass sowhol nach `encrypt()` jedes Sonderzeichen mit einem Leerzeichen von den umliegenden Buchstaben getrennt ist. Da die Aufgabenstellung aber die Frage aufwirft, ob ein Algorithmus den Text dechiffrieren kann, ist dieser Umstand unerheblich da er keine Auswirkung auf den Inhalt des Textes hat.

##### Notiz am Rande

Leider ist die Liste auf der BwInf Seite aller deutscher Wörter unvollständig. Selbst das Beispiel 2 (https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/twist2.txt) enthält das Wort **"wegbegeben"** welches sich leider nicht in der Liste befindet.

## Algorithmik

### Twisten

Der von mir entwickelte Algorithmus zum "Twisten" funktioniert nach folgendem Schema:

1. Extrahiere den *inneren Teil* eines jeden Wortes (alle Zeichen zwischen dem 1. und dem letzten) in ein Array
2. Ordne das Array zufällig an (folgender Algorithmus):
  1. Erstelle neues leeres Array
  2. Gehe jedes Zeichen des Original Array durch:
    1. Generiere eine Liste (Array) mit den noch verfügbaren Positionen (Indexes) im neuen Array
    2. Wähle zufällige Position (Index) aus der Lise der verfügbaren
    3. Weise dieser zufälligen Position im neuen Array das aktuelle Zeichen zu
  3. Gebe das nun zufällig sortierte Array zurück
3. Gebe Anfangs- und Endbuchstabe und in der Mitte das neu sortierte Wortinnere zurück

### Enttwisten

Der von mir entwickelte Algorithmus zum "Enttwisten" funktioniert nach folgendem Schema:

Grundsätzlich kommen natürlich alle Wörter für ein "getwistetes" Wort in Frage. Mit folgenden Einschränkungen:
1. Filtere alle [deutschen] Wörter nach der Länge des getwisteten Originals
2. Filtere die verbleibenden Wörter danach, ob sie die selben Anfangs- und 

## Require

```javascript
const Twist = require('./Twist');
```

## Encrypt

```javascript
const encryptedMessage = Twist.encrypt("Hallo Welt");

console.log(encryptedMessage);
```

## Decrypt

```javascript
const decryptedMessage = Twist.decrypt("Hllao Wlet", ["Hallo", "Welt"]);

console.log(decryptedMessage);
```

Das 2. Argument ist die Liste an Wörtern auf deren Basis die Dechiffrierung stattfinden soll. Auf dieser Ebene ist eine solche Liste notwenig. Ein automatisches Fallback auf die deutsche Sprache anhand der Liste unter: https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/woerterliste.txt findet erst innerhlab des CLI statt.

## CLI

```bash
$ node /demo/cli --mode encrypt --text "Hallo Welt"
```
|Argument|Alias|Typ   |Mögliche Werte       |Benötigt|
|--------|-----|------|---------------------|--------|
|`mode`  |`m`  |String|`encrypt` / `decrypt`|Ja      |
|`text`  |`t`  |String|*Random text*        |Ja      |
|`words` |`w`  |String|File path or URL     |Nein    |

##### Important

Die Datei oder die URL bei `words` muss auf eine Text-Datei zeigen welche jedes Wort in einer neuen Zeile auflistet. Entsprechend der Syntax von: https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/woerterliste.txt

Wird das Argument nicht angegeben, nimmt das CLI standardmäßig die Datei von der BwInf Seite https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/woerterliste.txt welche lokal im CLI Programm existiert.

Außerdem gilt es zu beachten, dass der Algorithmus natürlich immer ein bisschen länger braucht wenn er eine URL anstelle einer Datei als Quelle benutzt, da HTTP Anfragen für gewöhnlich länger brauchen als eine Datei einzulesen.

### Example

#### Encrypt

```bash
$ node /demo/cli --text https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/twist1.txt --mode encrypt
```

#### Decrypt

```bash
$ node /demo/cli --text https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/enttwist.txt --mode decrypt
```
